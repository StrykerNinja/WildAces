var range = 20.0;
var fireRate = 0.2;
var vforce = 10.0;
var hforce = 2.0;
var damage = 1;
var hitParticles : ParticleEmitter;
var lockOnRadius = 5.0;
var powerUpTime = 15.0;
private var lastShotTime = -10.0;
private var playerMask = 1 << 10;
private var enemyMask = 1 << 8;
private var target : Transform;
private var damageMult = 1.0;
private var fireRateMult = 1.0;
//private var nextFireTime = 0.0;



function Start ()
{

// We don't want to emit particles all the time, only when we hit something.

if (hitParticles)
	hitParticles.emit = false;
playerMask = ~playerMask;
enemyMask = ~enemyMask;

}


function Update () 
{
/*
if (Time.time - fireRate > nextFireTime)
nextFireTime = Time.time - Time.deltaTime;
// Keep firing until we used up the fire time
while( nextFireTime < Time.time && Input.GetButton("Fire1") )
{
Fire();
nextFireTime += fireRate;
}*/

if(Input.GetButton("Fire2") )
	{
		var mouse = ScreenToWorld2d(Input.mousePosition);
		var center = Vector3(mouse.x, mouse.y, 0);
		
		var colliders : Collider[] = Physics.OverlapSphere (center, lockOnRadius, playerMask);
		var foundTarget = false;
		
		for (var hit in colliders)
		{	
			if(!hit)
				continue;
			if(hit.rigidbody)
			{
				foundTarget = true;
				if(target)
				{ target.BroadcastMessage("LostLock", SendMessageOptions.DontRequireReceiver); } 
				target = hit.transform;
				target.BroadcastMessage("LockedOn", SendMessageOptions.DontRequireReceiver);
				//Debug.Log("Locked" + target.position + hit.name);
				break;
			}
		}
		
		if(!foundTarget)
		{
			if(target)
				{ target.BroadcastMessage("LostLock", SendMessageOptions.DontRequireReceiver); } 
			target = null;
		}
	}

if( (Time.time - lastShotTime) > (fireRate * fireRateMult) )
	{
//Debug.Log("Time: " + Time.time + " lastShotTime: " + lastShotTime + " fireRate: " + fireRate + " DIF: " + (Time.time - lastShotTime));
		if( Input.GetButton("Fire1") )
			{
			if(target)
				{
				LockedFire();
				}
			else
				{
				FireShot();
				}
			}
	}

}

function LockedFire()
{
SendMessageUpwards ("Fired", SendMessageOptions.DontRequireReceiver);
lastShotTime = Time.time;


var hit : RaycastHit;
var aim = target.position;
aim.y += 0.5;
var direction = aim - transform.position;
Debug.DrawRay(transform.position, direction * hit.distance, Color.yellow);
//Debug.Log("LockedFire " + target.position + " " + transform.position + " " + direction);

if (Physics.Raycast (transform.position, direction, hit, range, playerMask))
	{
//Debug.DrawRay (transform.position, direction * hit.distance, Color.yellow);


	if (hit.rigidbody)
	{
		//hit.rigidbody.AddForceAtPosition(force * direction, hit.point);
//		var temp = force * direction;
//		temp.y = 0;
		if(hit.rigidbody.useGravity)
			hit.rigidbody.velocity = Vector3(0, vforce, 0);
			
		if(hit.transform.position.x < transform.position.x)
		{
			hit.rigidbody.velocity = hit.rigidbody.velocity - Vector3(hforce, 0, 0);
		}
		else
		{
			hit.rigidbody.velocity = hit.rigidbody.velocity + Vector3(hforce, 0, 0);
		}
		
	}
	//if (hitParticles)
		//{
		//Debug.Log("hitparticle before " + hitParticles.emit);
		Instantiate(hitParticles, hit.point, Quaternion.FromToRotation(Vector3.up, hit.normal));
	/*
		hitParticles.transform.position = hit.point;
		hitParticles.transform.rotation = Quaternion.FromToRotation(Vector3.up, hit.normal);*/
		hitParticles.emit = true;
		//Debug.Log("hitparticle after " + hitParticles.emit);
		
		//}

	hit.collider.SendMessageUpwards("ApplyDamage", (damage * damageMult) , SendMessageOptions.DontRequireReceiver);
	}

}

function FireShot()
{
SendMessageUpwards ("Fired", SendMessageOptions.DontRequireReceiver);
lastShotTime = Time.time;

var direction = transform.right;
var hit : RaycastHit;


if (Physics.Raycast (transform.position, direction, hit, range, playerMask))
	{
//Debug.DrawRay (transform.position, direction * hit.distance, Color.yellow);


	if (hit.rigidbody)
	{
	if(!hit.rigidbody.isKinematic)
		{
			//hit.rigidbody.AddForceAtPosition(force * direction, hit.point);
	//		var temp = force * direction;
	//		temp.y = 0;
			if(hit.rigidbody.useGravity)
			{	hit.rigidbody.velocity = Vector3(0, vforce, 0); }
				
			if(hit.transform.position.x < transform.position.x)
			{
				hit.rigidbody.velocity = hit.rigidbody.velocity - Vector3(hforce, 0, 0);
			}
			else
			{
				hit.rigidbody.velocity = hit.rigidbody.velocity + Vector3(hforce, 0, 0);
			}
		}
	}
	//if (hitParticles)
		//{
		//Debug.Log("hitparticle before " + hitParticles.emit);
		Instantiate(hitParticles, hit.point, Quaternion.FromToRotation(Vector3.up, hit.normal));
	/*
		hitParticles.transform.position = hit.point;
		hitParticles.transform.rotation = Quaternion.FromToRotation(Vector3.up, hit.normal);*/
		hitParticles.emit = true;
		//Debug.Log("hitparticle after " + hitParticles.emit);
		
		//}

	hit.collider.SendMessageUpwards("ApplyDamage", (damage * damageMult), SendMessageOptions.DontRequireReceiver);
	}
	

}

function PowerUp()
{
damageMult = 1.0;
fireRateMult = 0.5;
Invoke("PowerDown", powerUpTime);
}

function PowerDown()
{
damageMult = 1.0;
fireRateMult = 1.0;
}

function ScreenToWorld2d(screenPoint : Vector2)
{
	return Camera.main.ScreenToWorldPoint( Vector3(screenPoint.x, screenPoint.y, -Camera.main.transform.position.z) );
}