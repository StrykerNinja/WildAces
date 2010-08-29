var canControl : boolean = true;
var dashSystem : DashSystem;
var jumpSystem : JumpSystem;
var movementSystem : MovementSystem;

private var characterController : CharacterController;

class DashSystem {
	function Dash(dashDirection) {
	}
	
	function Start() {
	}
}

class JumpSystem {
	var canJump : boolean = true;
	var canDoubleJump : boolean = true;
	var jumpRepeatTime : float = .05;
	//var jumpVelocity : float = 10.0;
	//var doubleJumpVelocity : float = 15.0;

	// How high do we jump when pressing jump and letting go immediately
	private var jumpHeight : float = 1.5;
	private var gravityEffect : float = 60.0;
	private var jumpTimeout : float = .15;
	// last time we pressed jump button (or attempted to jump)
	private var lastJumpAttemptTime : float = -1.0;
	// last time we actually did a jump
	private var lastJumpTime : float = -1.0;
	private var isJumping : boolean = false;
	private var reachedApex : boolean = false;
	private var isDoubleJumping : boolean = false;
	
	private var _characterController : CharacterController;
	private var _movementSystem : MovementSystem;

	function JumpSystem(charController : CharacterController, moveSystem : MovementSystem) {
		_characterController = charController;
		_movementSystem = moveSystem;
	}
	
	function Jump() {
		// Prevent jumping too fast after each other
		if (lastJumpTime + jumpRepeatTime > Time.time) {
			return;
		}
		
		//Debug.Log("in Jump, grounded: " + _characterController.isGrounded);
		if (_characterController.isGrounded) {
			if (canJump && CanStartNewJump) {
				_movementSystem.ChangeVerticalSpeed(JumpVerticalSpeed());
				//Debug.Log("Starting new jump");
				StartNewJump();
				//_movementSystem.ChangeVerticalVelocity(jumpVelocity);
				//SendMessage("Jumped", SendMessageOptions.DontRequireReceiver);
			}
		}
		else if (canJump && canDoubleJump && CanStartNewJump && !isDoubleJumping) {
			_movementSystem.ChangeVerticalSpeed(JumpVerticalSpeed());
			//Debug.Log("starting new double jump");
			StartNewJump();
			isDoubleJumping = true;
			//_movementSystem.ChangeVerticalVelocity(doubleJumpVelocity);
			//SendMessage ("DoubleJumped", SendMessageOptions.DontRequireReceiver);
		}
	}
	
	function ApplyGravity() {
		// When we reach the apex of the jump we send out a message
		//Debug.Log("Attempting to apply gravity");
		//Debug.Log("are we jumping: " + isJumping + ", apex? " + reachedApex + ", current vert speed: " + _movementSystem.CurrentVerticalSpeed());
		if (isJumping && !reachedApex && _movementSystem.CurrentVerticalSpeed() <= 0.0) {
			reachedApex = true;
			//SendMessage("JumpReachedApex", SendMessageOptions.DontRequireReceiver);
		}
		
		//Debug.Log("in Apply Gravity, grounded: " + _characterController.isGrounded);
		if (_characterController.isGrounded)
		{
			_movementSystem.ChangeVerticalSpeed((-1 * gravityEffect) * Time.deltaTime);
			isJumping = false;
			isDoubleJumping = false;
		}
		else
		{
			_movementSystem.ChangeVerticalSpeed(_movementSystem.CurrentVerticalSpeed() - (gravityEffect * Time.deltaTime));
		}
	}
	
	private function CanStartNewJump() {
		return (Time.time < lastJumpAttemptTime + jumpTimeout);
	}
	
	private function JumpVerticalSpeed() {
		// From the jump height and gravity we deduce the upwards speed 
		// for the character to reach at the apex.
		return Mathf.Sqrt(2 * jumpHeight * gravityEffect);
	}
	
	private function StartNewJump() {
		isJumping = true;
		reachedApex = false;
		lastJumpTime = Time.time;
	}
}

class MovementSystem {
	// The speed when walking 
	var walkSpeed : float = 5.0;
	// How fast does the character change speeds?  Higher is faster.
	var speedSmoothing : float = 50.0;
	
	// The current movement speed.  This gets smoothed by speedSmoothing.
	private var movementSpeed : float = 0.0;
	// The current vertical movement speed.
	private var verticalMovementSpeed : float = 0.0;
	// The current vertical movement speed.
	private var maxFallSpeed : float = -20.0;
	
	// are we moving?
	private var isMoving : boolean = false;
	// which direction?
	private var movementDirection : Vector3 = Vector3.zero;
	// collision flags
	private var movementCollisionFlags : CollisionFlags; 
	// This controls how fast the graphics of the character "turn around" when the player turns around using the controls.
	private var movementRotationSmoothing = 10.0;
	
	private var _characterController : CharacterController;

	function MovementSystem(charController : CharacterController) {
		_characterController = charController;
	}

	function MoveCharacter(theCharacter : Transform) {
		//Debug.Log("Attempting to Move Character");
		var horizontalSpeed = Input.GetAxisRaw("Horizontal");
		//Debug.Log("Current Horizontal Speed: " + horizontalSpeed);
		
		isMoving = Mathf.Abs(horizontalSpeed) > 0.1;
		//Debug.Log("Are we moving? " + isMoving);
		if (isMoving) {
			movementDirection = Vector3(horizontalSpeed, 0, 0);
			//Debug.Log("Current movement direction: " + movementDirection);
		}
		
		// Smooth the speed based on the current target direction
		var speedSmoothingDelta = speedSmoothing * Time.deltaTime;

		// Choose target speed
		var targetSpeed = Mathf.Min(Mathf.Abs(horizontalSpeed), 1.0);
		targetSpeed *= walkSpeed;
		
		movementSpeed = Mathf.Lerp(movementSpeed, targetSpeed, speedSmoothingDelta);
		//Debug.Log("Current movement speed: " + movementSpeed);
		
		// Save lastPosition for velocity calculation.
		var lastPosition = theCharacter.position;
	
		// Calculate actual motion
		//var currentMovementOffset = movementDirection * movementSpeed;
		var currentMovementOffset = movementDirection * movementSpeed + Vector3(0, verticalMovementSpeed, 0);
	
		// We always want the movement to be framerate independent.  Multiplying by Time.deltaTime does this.
		currentMovementOffset *= Time.deltaTime;
	
		// Move our character!
		movementCollisionFlags = _characterController.Move(currentMovementOffset);
	
		// Calculate the velocity based on the current and previous position.  
		// This means our velocity will only be the amount the character actually moved as a result of collisions.
		var movementVelocity = (theCharacter.position - lastPosition) / Time.deltaTime;
	
		// Set rotation to the move direction	
		if (movementDirection.sqrMagnitude > 0.01) {
			theCharacter.rotation = Quaternion.Slerp(theCharacter.rotation, Quaternion.LookRotation(movementDirection), Time.deltaTime * movementRotationSmoothing);
		}
	}
	
	function ChangeVerticalSpeed(newSpeed : float) {
		verticalMovementSpeed = newSpeed;
		// Make sure we don't fall any faster than maxFallSpeed.  This gives our character a terminal velocity.
		verticalMovementSpeed = Mathf.Max(verticalMovementSpeed, maxFallSpeed);
	}
	
	//function ChangeVerticalVelocity(newVelocity : float) {
	//	verticalVelocity = newVelocity;
	//}
	
	function CurrentVerticalSpeed() {
		return verticalMovementSpeed;
	}
}

function Awake () {
	characterController = GetComponent(CharacterController);
}

function Start() {
	//Debug.Log("Starting Platform Controller...");
	//Debug.Log("Initializing Dash System");
	dashSystem.Start();

	//Debug.Log("Initializing Movement System");
	movementSystem = MovementSystem(characterController);
	
	//Debug.Log("Initializing Jump System");
	jumpSystem = JumpSystem(characterController, movementSystem);
}

function Update() {
	// no need to execute if we can't control the character
	if (!canControl) {
		return;
	}
	
	movementSystem.MoveCharacter(transform);
	
	jumpSystem.ApplyGravity();
	
	if (Input.GetButtonDown("Jump")) {
		jumpSystem.Jump();
	}
	if (Input.GetButtonDown("DashRight")) {
		dashSystem.Dash("Right");
	}
	if (Input.GetButtonDown("DashLeft")) {
		dashSystem.Dash("Right");
	}
}

@script AddComponentMenu ("2D Controls/Platform Controller")