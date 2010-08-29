// variable for max Combo length
var maxComboLength = 20;

// variable for how fast we can fire
var firingRateTime = 0.3;
// how much damage does this combo weapon do?
var normalBulletDamage = 1;
// how far away can we hit something?
var maxShootingDistance = 5.0;
// how much vertical (juggling) force to do?
var verticalReactionForce = 10.0;
// how much horizontal force to do?
var horizontalReactionForce = 2.0;
// what layer is the enemy on?
var enemyLayer : LayerMask = -1;
// what does our bullet particles look like when we hit something
var bulletParticleEmitter : ParticleEmitter;

class ComboSystemMechanics {
	// keep track of last combo action
	@System.NonSerialized
	private var lastComboActionTime = -1.0;
	// variable in which the combo must continue
	private var comboContinueTime = 1.0;
	// variable to keep track of how much extra damage the combo system generates
	private var damageMultiplier = 1.0;
	// variable to keep track of the currnt combo system counter
	private var comboCounter = 1;
	
	private var maxComboCount = 20;
	
	function ComboSystemMechanics(maxCombo : int) {
		Debug.Log("Constructing Combo Mechanics with a max combo count: " + maxCombo);
		maxComboCount = maxCombo;
	}

	function IsEnemyInRange() {
		// hack for testing - Enemy is always in range
		return true;
	}

	function ApplyCombo() {
		// check if the existing combo has timed out
		if (HasTimedOut() || HasReachedMaxCombo()) 
		{
			// start new combo
			StartNewCombo();
		}
		else
		{
			ContinueCombo();
		}
	}

	function GetDamageMultiplier()	{
		if (HasTimedOut() || HasReachedMaxCombo()) 
		{
			StartNewCombo();
		}
		return damageMultiplier;
	}
	
	function ResetCombo() {
		comboCounter = 1;
		damageMultiplier = 1.0;
	}
	
	private function HasTimedOut() {
		//Debug.Log("Current time: " + Time.time + ", last combo interval: " + (lastComboActionTime + comboContinueTime));
		if (lastComboActionTime + comboContinueTime > Time.time)
		{
			return false;
		}
		else
		{
			Debug.Log("Combo Timed out!");
			return true;
			
		}
	}

	private function HasReachedMaxCombo() {
		if (comboCounter > maxComboCount)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	private function StartNewCombo() {
		Debug.Log("Starting new Combo!");
		lastComboActionTime = Time.time;
		ResetCombo();
	}

	private function ContinueCombo() {
		Debug.Log("Continuing combo, currently at: " + comboCounter);
		lastComboActionTime = Time.time;
		if (comboCounter > 0 && comboCounter <= 2)
		{
			damageMultiplier = 1.2;
		}
		else if (comboCounter > 2 && comboCounter <= 5)
		{
			damageMultiplier = 1.6;
		}
		else if (comboCounter > 5 && comboCounter <= 8)
		{
			damageMultiplier = 2.2;
		}
		else if (comboCounter > 8 && comboCounter <= 12)
		{
			damageMultiplier = 3.0;
		}
		else if (comboCounter > 12 && comboCounter <= 15)
		{
			damageMultiplier = 3.3;
		}
		else if (comboCounter > 15 && comboCounter <= maxComboCount)
		{
			damageMultiplier = 3.5;
		}
		else
		{
			// reset it
			damageMultiplier = 1.0;
		}
		comboCounter++;
	}
}

class ShootingMechanics {
	// keep track of last shot
	@System.NonSerialized
	private var lastShotTime = -1.0;
	
	private var firingRate : float;
	private var bulletDamage : int;
	private var maxShootingRange : float;
	private var verticalForce : float;
	private var horizontalForce : float;
	private var enemyLayerMask : LayerMask;
	private var bulletParticles : ParticleEmitter;
	private var comboSystem : ComboSystemMechanics;
	
	function ShootingMechanics(fireRate, damage, shootingRange, vForce, hForce, eLayer, bParticles, cSystem) {
	//function ShootingMechanics(fireRate, damage, shootingRange, vForce, hForce, eLayer, cSystem) {
		Debug.Log("Constructing Shooting Mechanics with: " + fireRate + ", " + damage + ", " + shootingRange + ", " + vForce + ", " + hForce + ", " + eLayer + ", " + bParticles + ", " + cSystem);
		//Debug.Log("Constructing Shooting Mechanics with: " + fireRate + ", " + damage + ", " + shootingRange + ", " + vForce + ", " + hForce + ", " + eLayer + ", " + cSystem);
		firingRate = fireRate;
		bulletDamage = damage;
		maxShootingRange = shootingRange;
		verticalForce = vForce;
		horizontalForce = hForce;
		enemyLayerMask = eLayer;
		bulletParticles = bParticles;
		comboSystem = cSystem;
		
		// We don't want to emit particles all the time, only when we hit something.
		if (bulletParticles)
		{
			bulletParticles.emit = false;
		}
	}

	function CanFire() {
		//Debug.Log("Checking to see if it is time to fire");
		if (lastShotTime + firingRate > Time.time)
		{
			// not ready to fire again
			return false;
		}
		else
		{
			// fire at will!
			return true;
		}
	}

	function Shoot(currentTransform : Transform) {
		currentTransform.SendMessageUpwards ("Fired", SendMessageOptions.DontRequireReceiver);
		lastShotTime = Time.time;

		var shotDirection = currentTransform.right;
		var objectShotAt : RaycastHit;
		
		Debug.DrawRay(currentTransform.position, shotDirection * maxShootingRange, Color.magenta);
		if (Physics.Raycast(currentTransform.position, shotDirection, objectShotAt, maxShootingRange, enemyLayerMask.value))
		{
			//Debug.DrawRay(currentTransform.position, shotDirection * objectShotAt.distance, Color.yellow);
			if (objectShotAt.rigidbody)
			{
				if(!objectShotAt.rigidbody.isKinematic)
				{
					// I think useGravity is how we determine is being juggled
					if(objectShotAt.rigidbody.useGravity)
					{	
						// apply upward force - juggling
						objectShotAt.rigidbody.velocity = Vector3(0, verticalForce, 0); 
					}
					
					// apply a horizontal force either left or right of the player
					if(objectShotAt.transform.position.x < currentTransform.position.x)
					{
						objectShotAt.rigidbody.velocity = objectShotAt.rigidbody.velocity - Vector3(horizontalForce, 0, 0);
					}
					else
					{
						objectShotAt.rigidbody.velocity = objectShotAt.rigidbody.velocity + Vector3(horizontalForce, 0, 0);
					}
				}
			}
			
			// if we have particles, show em
			if (bulletParticles)
			{
				var tempParticles : ParticleEmitter = GameObject.Instantiate(bulletParticles, objectShotAt.point, Quaternion.FromToRotation(Vector3.up, objectShotAt.normal));
				tempParticles.emit = true;
			}

			Debug.Log("Applying Damage of: " + (bulletDamage * comboSystem.GetDamageMultiplier()) + " at point: " + objectShotAt.point);
			objectShotAt.collider.SendMessageUpwards("ApplyDamage", (bulletDamage * comboSystem.GetDamageMultiplier()), SendMessageOptions.DontRequireReceiver);
		}
		else
		{
			// we missed an enemy, reset the combo
			comboSystem.ResetCombo();
		}
	}
}

private var comboMechanicsSystem : ComboSystemMechanics;
private var shootingSystem : ShootingMechanics;

function Start() {
	Debug.Log("Starting Combo Shooting...");
	comboMechanicsSystem = ComboSystemMechanics(maxComboLength);
	shootingSystem = ShootingMechanics(firingRateTime, normalBulletDamage, maxShootingDistance, verticalReactionForce, horizontalReactionForce, enemyLayer, bulletParticleEmitter, comboMechanicsSystem);
	//shootingSystem = ShootingMechanics(firingRateTime, normalBulletDamage, maxShootingDistance, verticalReactionForce, horizontalReactionForce, enemyLayer, comboMechanicsSystem);
}

function Update () {
	if (Input.GetButtonDown("Fire1") && shootingSystem.CanFire())
	{
		//Debug.Log("Attempting to fire!");
		// we hit the fire button, and we're within fire rate, so shoot!
		shootingSystem.Shoot(transform);
		
		// determine if combo system should affect the next shot
		if (comboMechanicsSystem.IsEnemyInRange())
		{
			//Debug.Log("Applying Combo!");
			comboMechanicsSystem.ApplyCombo();
		}
	}
}