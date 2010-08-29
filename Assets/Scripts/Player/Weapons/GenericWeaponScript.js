
var projectile : Rigidbody;
var explosion : GameObject;

var speed = 60;

var reloadTime = 0.5;

private var lastShot = -10.0;
private var playerMask = 1 << 10;

var powerUpTime = 15.0;
private var damageMult = 1.0;
private var fireRateMult = 1.0;

function Start()
{

playerMask = ~playerMask;
}


function Update() 
{
	if(lastShot + (reloadTime * fireRateMult) > Time.time)
	{
	return;
	}
if( Input.GetButton( "Fire1" ) )
	{
		var instantiatedProjectile : Rigidbody = Instantiate(projectile, transform.position, transform.rotation );
		instantiatedProjectile.velocity = transform.TransformDirection( Vector3( speed, 0, 0 ) );
		Physics.IgnoreCollision( instantiatedProjectile. collider, transform.root.collider );
		lastShot = Time.time;
		SendMessageUpwards ("Fired", SendMessageOptions.DontRequireReceiver);
	}
}

function DynamiteSwitched()
{
//Debug.Log("ShootDynamite");
var direction = -Vector3.up;
var hit : RaycastHit;

if (Physics.Raycast (transform.position, direction, hit, 100, playerMask))
	{
		//Debug.Log("DynamiteHit");
		Instantiate(explosion, hit.point, Quaternion.identity);
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