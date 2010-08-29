var target : Transform;
var projectile : Rigidbody;
var speed = 60;
var reloadTime = 0.5;
var range = 20;
private var lastShot = -10.0;

function Start () 
{
	if (target == null && GameObject.FindWithTag("Player"))
	{
		target = GameObject.FindWithTag("Player").transform;
	}
}

function Juggled()
{
	lastShot = Time.time;
	SendMessageUpwards("ShooterJuggle", true);
}

function Update () 
{
	if(transform == null || target == null)
		return;
	
	var direction = Vector2(target.position.x, target.position.y + 1.0) - Vector2(transform.position.x, transform.position.y);
	if(direction.magnitude > range)
	{
		SendMessageUpwards("AmIVisible", false);
		return;
	}
	else
	{
		SendMessageUpwards("AmIVisible", true);
	}
	Debug.DrawRay(transform.position, new Vector3(direction.x, direction.y, 0), Color.blue);
	var targetRotation = Quaternion.FromToRotation( Vector3(transform.position.x, 0, 0), direction);
	transform.rotation = targetRotation;
		
	if(lastShot + reloadTime > Time.time)
	{
		return;
	}
	
	SendMessageUpwards("ShooterShoot", true);
	var instantiatedProjectile : Rigidbody = Instantiate(projectile, transform.position, transform.rotation	);
	instantiatedProjectile.velocity = transform.TransformDirection( Vector3( speed, 0, 0 ) );
	Physics.IgnoreCollision( instantiatedProjectile. collider, transform.root.collider );
	lastShot = Time.time;
}
