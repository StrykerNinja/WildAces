var explosionRadius = 1.0;
var explosionPower = 10.0;
var explosionDamage = 10.0;

var explosionTime = 1.0; 
var juggleForce = 10;


private var playerMask = 1 << 10;


function Start()
{
playerMask = ~playerMask;
var explosionPosition = transform.position;
var colliders : Collider[] = Physics.OverlapSphere (explosionPosition, explosionRadius, playerMask);

for (var hit in colliders)
	{
	if(!hit)
		continue;
	if(hit.rigidbody)
		{
			if(hit.rigidbody.position.x < transform.position.x)
			{
			hit.rigidbody.AddForce(-explosionPower, juggleForce, 0);
			}
			else if(hit.rigidbody.position.x > transform.position.x)
			{
			hit.rigidbody.AddForce(explosionPower, juggleForce, 0);
			}
			else
			{
			hit.rigidbody.AddForce(0, (juggleForce + explosionPower), 0);
			}
			//hit.rigidbody.AddExplosionForce(explosionPower, explosionPosition, explosionRadius, -1.0);
			hit.rigidbody.SendMessageUpwards("ApplyDamage", explosionDamage, SendMessageOptions.DontRequireReceiver);
			//hit.rigidbody.velocity = hit.rigidbody.velocity - Vector3(0, 100, 0);
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
