var explosionRadius = 1.0;
//var explosionPower = 10.0;
var explosionDamage = 10.0;

var explosionTime = 1.0; 
var juggleForce = 10;


var enemyMask = 1;
var shamt = 9;


function Start()
{

enemyMask = enemyMask << shamt;
enemyMask = ~enemyMask;

var explosionPosition = transform.position;
var colliders : Collider[] = Physics.OverlapSphere (explosionPosition, explosionRadius, enemyMask);

for (var hit in colliders)
	{
	if(!hit)
		continue;
	if(hit.rigidbody)
		{
		//hit.rigidbody.AddExplosionForce(explosionPower, explosionPosition, explosionRadius, 3.0);
		hit.rigidbody.SendMessageUpwards("ApplyDamage", explosionDamage, SendMessageOptions.DontRequireReceiver);
		//hit.rigidbody.velocity = Vector3( 0, juggleForce, 0);
		}
	}
	
	if(particleEmitter)
	{
		particleEmitter.emit= true;
		yield WaitForSeconds(0.5);
		particleEmitter.emit = false;
	}
	
	Destroy (gameObject, explosionTime);
}
