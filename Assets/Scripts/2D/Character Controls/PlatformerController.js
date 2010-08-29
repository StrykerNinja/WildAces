
// Does this script currently respond to Input?

var canControl = false;

// The character will spawn at spawnPoint's position when needed.  This could be changed via a script at runtime to implement, e.g. waypoints/savepoints.
var spawnPoint : Transform;

var lives = 3;

var shootFallingSlowDuration = 0.5;

@System.NonSerialized
var lastShotTime = -10.0;	

var doubleDashTime = .1;

@System.NonSerialized
var hovering = false;

@System.NonSerialized
var hoverMult = 1.0;

var shootSlowRate = 2.0;

var crouchingHeight = 0.75;

private var crouching = false;
private var lastDashDownR = -10;
private var lastDashDownL = -10;
private var lastDashUpR = -10;
private var lastDashUpL = -10;
var doubleDashDelay = 0.5;

private var dr = false;
private var dl = false;
private var gameOver = false;

class PlatformerControllerMovement {
	// The speed when walking 
	var walkSpeed = 5.0;
	// when pressing "Fire1" button (control) we start running
	var runSpeed = 10.0;
	
	
	var airDashForwardVelocity = 15;
	var dashForwardVelocity = 25;
	var dashUpwardVelocity = 5;
	
	@System.NonSerialized
	var dashing = false;
	
	//@System.NonSerialized
	var dashRepeatTime = 0.05;

	@System.NonSerialized
	var dashTimeout = 0.15;
	
	// Last time the jump button was clicked down
	@System.NonSerialized
	var dashLastButtonTime = -10.0;
	
	// Last time we performed a jump
	@System.NonSerialized
	var dashLastTime = -1.0;
	
	

	var inAirControlAcceleration = 1.0;

	// The gravity for the character
	var gravity = 60.0;
	var maxFallSpeed = 20.0;

	// How fast does the character change speeds?  Higher is faster.
	var speedSmoothing = 5.0;

	// This controls how fast the graphics of the character "turn around" when the player turns around using the controls.
	var rotationSmoothing = 10.0;

	// The current move direction in x-y.  This will always been (1,0,0) or (-1,0,0)
	// The next line, @System.NonSerialized , tells Unity to not serialize the variable or show it in the inspector view.  Very handy for organization!
	@System.NonSerialized
	var direction = Vector3.zero;

	// The current vertical speed
	@System.NonSerialized
	var verticalSpeed = 0.0;

	// The current movement speed.  This gets smoothed by speedSmoothing.
	@System.NonSerialized
	var speed = 0.0;

	// Is the user pressing the left or right movement keys?
	@System.NonSerialized
	var isMoving = false;

	// The last collision flags returned from controller.Move
	@System.NonSerialized
	var collisionFlags : CollisionFlags; 

	// We will keep track of an approximation of the character's current velocity, so that we return it from GetVelocity () for our camera to use for prediction.
	@System.NonSerialized
	var velocity : Vector3;
	
	// This keeps track of our current velocity while we're not grounded?
	@System.NonSerialized
	var inAirVelocity = Vector3.zero;

	// This will keep track of how long we have we been in the air (not grounded)
	@System.NonSerialized
	var hangTime = 0.0;
}

var movement : PlatformerControllerMovement;

// We will contain all the jumping related variables in one helper class for clarity.
class PlatformerControllerJumping {
	// Can the character jump?
	var enabled = true;
	var doubleEnabled = true;

	// How high do we jump when pressing jump and letting go immediately
	var height = 1.0;
	// We add extraHeight units (meters) on top when holding the button down longer while jumping
	@System.NonSerialized
	var extraHeight = 4.1;
	
	var doubleJumpVelocity = 15.0;
	
	//var dashForwardVelocity = 15;
	//var dashUpwardVelocity = 1;
	
	// This prevents inordinarily too quick jumping
	// The next line, @System.NonSerialized , tells Unity to not serialize the variable or show it in the inspector view.  Very handy for organization!
	@System.NonSerialized
	var repeatTime = 0.05;

	@System.NonSerialized
	var timeout = 0.15;

	// Are we jumping? (Initiated with jump button and not grounded yet)
	@System.NonSerialized
	var jumping = false;
	@System.NonSerialized
	var doublejumping = false;
	//@System.NonSerialized
	//var dashing = false;
	
	@System.NonSerialized
	var reachedApex = false;
  
	// Last time the jump button was clicked down
	@System.NonSerialized
	var lastButtonTime = -10.0;
	
	// Last time we performed a jump
	@System.NonSerialized
	var lastTime = -1.0;

	// the height we jumped from (Used to determine for how long to apply extra jump power after jumping.)
	@System.NonSerialized
	var lastStartHeight = 0.0;
}

var jump : PlatformerControllerJumping;

private var controller : CharacterController;

private var rb : Rigidbody;

// Moving platform support.
private var activePlatform : Transform;
private var activeLocalPlatformPoint : Vector3;
private var activeGlobalPlatformPoint : Vector3;
private var lastPlatformVelocity : Vector3;

// This is used to keep track of special effects in UpdateEffects ();
private var areEmittersOn = false;

function Awake () {
	movement.direction = transform.TransformDirection (Vector3.forward);
	controller = GetComponent (CharacterController);
	rb = GetComponent (Rigidbody);
	Spawn ();
}

function Spawn () {
	// reset the character's speed
	movement.verticalSpeed = 0.0;
	movement.speed = 0.0;
	
	// reset the character's position to the spawnPoint
	transform.position = spawnPoint.position;
	
}

/*
function OnDeath () {
	if (lives > 0)
	{
		lives--;
		Spawn ();
	}
	else
	{
		Spawn();
		canControl = false;
		gameOver = true;
		//Destroy(gameObject);
	}
}*/

function UpdateSmoothedMovementDirection () {	
	var h = Input.GetAxisRaw ("Horizontal");
	
	if (!canControl)
		h = 0.0;
	
	movement.isMoving = Mathf.Abs (h) > 0.1;
		
	if (movement.isMoving)
		movement.direction = Vector3 (h, 0, 0);
	
	// Grounded controls
	if (controller.isGrounded) {
		// Smooth the speed based on the current target direction
		var curSmooth = movement.speedSmoothing * Time.deltaTime;
		
		// Choose target speed
		var targetSpeed = Mathf.Min (Mathf.Abs(h), 1.0);
	
		// Pick speed modifier
		if (!crouching && canControl)
			targetSpeed *= movement.runSpeed;
		else
			targetSpeed *= movement.walkSpeed;
		
		movement.speed = Mathf.Lerp (movement.speed, targetSpeed, curSmooth);
		
		movement.hangTime = 0.0;
	}
	else {
		// In air controls
		
		movement.hangTime += Time.deltaTime;
		if (movement.isMoving)
			movement.inAirVelocity += Vector3 (Mathf.Sign(h), 0, 0) * Time.deltaTime * movement.inAirControlAcceleration;
	}
}

function FixedUpdate () {
	// Make sure we are absolutely always in the 2D plane.
	transform.position.z = 0;

}

function ApplyJumping () {
	// Prevent jumping too fast after each other
	if (jump.lastTime + jump.repeatTime > Time.time)
		return;

	if (movement.dashLastTime + movement.dashRepeatTime > Time.time)
		return;
		
	if (controller.isGrounded) {
		// Jump
		// - Only when pressing the button down
		// - With a timeout so you can press the button slightly before landing		
		if (jump.enabled && Time.time < jump.lastButtonTime + jump.timeout) 
		{
			movement.verticalSpeed = CalculateJumpVerticalSpeed (jump.height);
			movement.inAirVelocity = lastPlatformVelocity;
			SendMessage ("DidJump", SendMessageOptions.DontRequireReceiver);
		}
	}
	else if (jump.enabled && jump.doubleEnabled && !controller.isGrounded && !jump.doublejumping && Time.time < jump.lastButtonTime + jump.timeout && Input.GetButtonDown ("Jump"))
	{
			movement.verticalSpeed = CalculateJumpVerticalSpeed (jump.height);
			movement.inAirVelocity = movement.inAirVelocity + Vector3(0, jump.doubleJumpVelocity, 0);
			SendMessage ("DidDoubleJump", SendMessageOptions.DontRequireReceiver);
	}
	
	
}

function ApplyDashing() 
{
	if (!canControl)
		return;

	if (movement.dashLastTime + movement.dashRepeatTime > Time.time)
		return;
	
	if(lastDashUpR != Time.time && Input.GetButtonUp ("DashRight") && Time.time - lastDashUpR < doubleDashDelay && lastDashUpR - lastDashDownR < doubleDashDelay)
	{
	dr = true;
	}
	else if(lastDashUpL != Time.time && Input.GetButtonUp ("DashLeft") && Time.time - lastDashUpL < doubleDashDelay && lastDashUpL - lastDashDownL < doubleDashDelay)
	{
	dl = true;
	}
	
	
		if (!movement.dashing && Input.GetButtonDown ("DashR") && !Input.GetButtonDown ("Jump") || dr)
		{
		dr = false;
			if(controller.isGrounded)
			{
			movement.inAirVelocity = movement.inAirVelocity + Vector3(movement.dashForwardVelocity, movement.dashUpwardVelocity, 0);
			movement.dashLastButtonTime = Time.time;
			
			}
			else
			{
			movement.inAirVelocity = movement.inAirVelocity + Vector3(movement.airDashForwardVelocity, 0, 0);
			movement.dashLastButtonTime = Time.time;
			}
			SendMessage ("DidDash", SendMessageOptions.DontRequireReceiver);
		}
		else if (!movement.dashing && Input.GetButtonDown ("DashL") && !Input.GetButtonDown ("Jump") || dl)
		{		
		dl = false;
		if(controller.isGrounded)
			{
			movement.inAirVelocity = movement.inAirVelocity + Vector3(-movement.dashForwardVelocity, movement.dashUpwardVelocity, 0);
			movement.dashLastButtonTime = Time.time;
			
			}
			else
			{
			movement.inAirVelocity = movement.inAirVelocity + Vector3(-movement.airDashForwardVelocity, 0, 0);
			movement.dashLastButtonTime = Time.time;
			}
			SendMessage ("DidDash", SendMessageOptions.DontRequireReceiver);
		}
	

}

function ApplyGravity () {
	// Apply gravity
	var jumpButton = Input.GetButton ("Jump");
	
	if (!canControl)
		jumpButton = false;
	
	// When we reach the apex of the jump we send out a message
	if (jump.jumping && !jump.reachedApex && movement.verticalSpeed <= 0.0) {
		jump.reachedApex = true;
		SendMessage ("DidJumpReachApex", SendMessageOptions.DontRequireReceiver);
	}
	
	// * When jumping up we don't apply gravity for some time when the user is holding the jump button
	//   This gives more control over jump height by pressing the button longer
	//var extraPowerJump =  jump.jumping && movement.verticalSpeed > 0.0 && jumpButton && transform.position.y < jump.lastStartHeight + jump.extraHeight && !IsTouchingCeiling ();
	
	
	/*if (extraPowerJump)
		return;
	else*/ if (controller.isGrounded)
	{
		movement.verticalSpeed = -movement.gravity * Time.deltaTime;
		hovering = false;
	}
	else if(Time.time < lastShotTime + shootFallingSlowDuration && movement.verticalSpeed < 0)
	{
		movement.verticalSpeed -= (movement.gravity * Time.deltaTime) / 20;
		hovering = true;
	}
	else
	{
		movement.verticalSpeed -= movement.gravity * Time.deltaTime;
		hovering = false;
	}
		
	
	// Make sure we don't fall any faster than maxFallSpeed.  This gives our character a terminal velocity.
	movement.verticalSpeed = Mathf.Max (movement.verticalSpeed, -movement.maxFallSpeed);
}

function ApplyCrouching() {

if(!controller.isGrounded)
return;

if(Input.GetButtonDown ("Crouch") && controller.height > 1.5)
{
controller.height = crouchingHeight;
crouching = true;
}
else if(Input.GetButtonDown ("Crouch") && controller.height < 1.5)
{
controller.height = 1.85;
crouching = false;
}

}

function ApplyShooting () {

if(Time.time < lastShotTime + 0.05 && !controller.isGrounded && movement.dashing)
	{
		movement.speed /= shootSlowRate;
		movement.inAirVelocity /= shootSlowRate;
	}
else if(Time.time < lastShotTime + 0.05 && !controller.isGrounded)
	{
		movement.speed /= 1.05;
		movement.inAirVelocity /= 1.05;
	}

}




function CalculateJumpVerticalSpeed (targetJumpHeight : float) {
	// From the jump height and gravity we deduce the upwards speed 
	// for the character to reach at the apex.
	return Mathf.Sqrt (2 * targetJumpHeight * movement.gravity);
}

function DidJump () {
	jump.jumping = true;
	jump.reachedApex = false;
	jump.lastTime = Time.time;
	jump.lastStartHeight = transform.position.y;
	jump.lastButtonTime = -10;
}


function DidDoubleJump () {
	jump.doublejumping = true;
	jump.reachedApex = false;
	jump.lastTime = Time.time;
	jump.lastStartHeight = transform.position.y;
	jump.lastButtonTime = -10;
}


function DidDash () {
	movement.dashing = true;
	//jump.reachedApex = false;
	movement.dashLastTime = Time.time;
	//jump.lastStartHeight = transform.position.y;
	movement.dashLastButtonTime = -10;
	SendMessage ("DidJump", SendMessageOptions.DontRequireReceiver);
	lastDashUpL = -10;
	lastDashUpR = -10;
	lastDashDownL = -10;
	lastDashDownR = -10;
}

function Fired()
{
lastShotTime = Time.time;
//Debug.Log(lastShotTime);
}

function UpdateEffects () {
	wereEmittersOn = areEmittersOn;
	areEmittersOn = jump.jumping && movement.verticalSpeed > 0.0;
	
	// By comparing the previous value of areEmittersOn to the new one, we will only update the particle emitters when needed
	if (wereEmittersOn != areEmittersOn) {
		for (var emitter in GetComponentsInChildren (ParticleEmitter)) {
			emitter.emit = areEmittersOn;
		}
	}
}

function Update () {
	if (Input.GetButtonDown ("Jump") && canControl) {
		jump.lastButtonTime = Time.time;
	}
	if (Input.GetButtonUp ("DashRight") && canControl) {
		lastDashUpR = Time.time;
	}
	if (Input.GetButtonUp ("DashLeft") && canControl) {
		lastDashUpL = Time.time;
	}
	if (Input.GetButtonDown ("DashRight") && canControl) {
		lastDashDownR = Time.time;
	}
	if (Input.GetButtonUp ("DashLeft") && canControl) {
		lastDashDownL = Time.time;
	}
	/*
	if ((Input.GetButtonDown ("DashR") || Input.GetButtonDown ("DashL")) && canControl) {
		movement.dashLastButtonTime = Time.time;
	}*/

	UpdateSmoothedMovementDirection();
	
	// Apply gravity
	// - extra power jump modifies gravity
	ApplyGravity ();

	// Apply jumping logic
	ApplyJumping ();
	
	ApplyDashing();
	
	ApplyShooting();
	
	ApplyCrouching();
	
	// Moving platform support
	if (activePlatform != null) {
		var newGlobalPlatformPoint = activePlatform.TransformPoint(activeLocalPlatformPoint);
		var moveDistance = (newGlobalPlatformPoint - activeGlobalPlatformPoint);
		transform.position = transform.position + moveDistance;
		lastPlatformVelocity = (newGlobalPlatformPoint - activeGlobalPlatformPoint) / Time.deltaTime;
	} else {
		lastPlatformVelocity = Vector3.zero;	
	}
	
	activePlatform = null;
	
	// Save lastPosition for velocity calculation.
	lastPosition = transform.position;
	
	// Calculate actual motion
	var currentMovementOffset = movement.direction * movement.speed + Vector3 (0, movement.verticalSpeed, 0) + movement.inAirVelocity;
	
	// We always want the movement to be framerate independent.  Multiplying by Time.deltaTime does this.
	currentMovementOffset *= Time.deltaTime;
	
   	// Move our character!
	//Debug.Log(currentMovementOffset);
	movement.collisionFlags = controller.Move (currentMovementOffset);
	
	// Calculate the velocity based on the current and previous position.  
	// This means our velocity will only be the amount the character actually moved as a result of collisions.
	movement.velocity = (transform.position - lastPosition) / Time.deltaTime;
	
	// Moving platforms support
	if (activePlatform != null) {
		activeGlobalPlatformPoint = transform.position;
		activeLocalPlatformPoint = activePlatform.InverseTransformPoint (transform.position);
	}
	
	// Set rotation to the move direction	
	if (movement.direction.sqrMagnitude > 0.01)
		transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation (movement.direction), Time.deltaTime * movement.rotationSmoothing);
	
	// We are in jump mode but just became grounded
	if (controller.isGrounded) {
		movement.inAirVelocity = Vector3.zero;
		if (jump.jumping || jump.doublejumping || movement.dashing) {
			jump.jumping = false;
			jump.doublejumping = false;
			movement.dashing = false;
			SendMessage ("DidLand", SendMessageOptions.DontRequireReceiver);

			var jumpMoveDirection = movement.direction * movement.speed + movement.inAirVelocity;
			if (jumpMoveDirection.sqrMagnitude > 0.01)
				movement.direction = jumpMoveDirection.normalized;
		}
	}	

	// Update special effects like rocket pack particle effects
	UpdateEffects ();
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (hit.moveDirection.y > 0.01) 
		return;
	
	// Make sure we are really standing on a straight platform
	// Not on the underside of one and not falling down from it either!
	if (hit.moveDirection.y < -0.9 && hit.normal.y > 0.9) {
		activePlatform = hit.collider.transform;	
	}
}

function PistolsSwitched()
{
jump.enabled = true;
jump.doubleEnabled = true;
}

function ShotgunSwitched()
{
jump.enabled = false;
jump.doubleEnabled = false;
movement.inAirVelocity.x = 0.0;
movement.speed = 0.0;
}

function DynamiteSwitched()
{
jump.enabled = true;
jump.doubleEnabled = false;
}


// Various helper functions below:
function GetSpeed () {
	return movement.speed;
}

function GetVelocity () {
	return movement.velocity;
}


function IsMoving () {
	return movement.isMoving;
}

function IsJumping () {
	return jump.jumping;
}

function IsTouchingCeiling () {
	return (movement.collisionFlags & CollisionFlags.CollidedAbove) != 0;
}

function GetDirection () {
	return movement.direction;
}

function GetHangTime() {
	return movement.hangTime;
}

function Reset () {
	gameObject.tag = "Player";
}

function HasJumpReachedApex()
{
	return jump.reachedApex;
}

function SetControllable (controllable : boolean) {
	canControl = controllable;
}



// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterController)
@script AddComponentMenu ("2D Platformer/Platformer Controller")
@script RequireComponent (Rigidbody)
