var hitPoints = 10;
var detonationDelay = 1.0;
var explosion : Transform;
var deadReplacement : Rigidbody;
private var rb : Rigidbody;
var hoverDelay = 0.5;
var shotHoverTime = 0.5;
var hoverStrength = 1000;
var itemDrop : GameObject;
var dropChance = 0.5;

function Awake () {
	rb = GetComponent (Rigidbody);
}

function ApplyDamage(damage : int)
{
if(hitPoints <= 0)
	return;

hitPoints -= damage;
//Invoke("ApplyDrag", hoverDelay);
//Invoke("DisableGravity", hoverDelay);

BroadcastMessage("Juggled", SendMessageOptions.DontRequireReceiver);

if(hitPoints <= 0)
	{
	var emitter : ParticleEmitter = GetComponentInChildren(ParticleEmitter);
	if(emitter)
		emitter.emit = true;
	
	BroadcastMessage("Death", SendMessageOptions.DontRequireReceiver);
	
	Invoke("DelayedDetonate", detonationDelay);
	}
}

function ApplyDrag()
{
rb.drag = hoverStrength;
Invoke("ResetDrag", shotHoverTime);
}

function ResetDrag()
{
rb.drag = 0;
}

function DisableGravity()
{
rb.useGravity = false;
Invoke("EnableGravity", shotHoverTime);
}

function EnableGravity()
{
rb.useGravity = true;
}

function DelayedDetonate()
{
	BroadcastMessage("Detonate");
}

function Detonate()
{
	if(itemDrop)
	{
		if(Random.Range(0.0,1.0) < dropChance)
			Instantiate(itemDrop, Vector3(transform.position.x, transform.position.y+1.5, 0), Quaternion.identity);
	}
	Destroy(gameObject);
	
	if(explosion)
	{
		Instantiate(explosion, transform.position, transform.rotation);
	}	
		
	if(deadReplacement)
		{
		var dead : Rigidbody = Instantiate(deadReplacement, transform.position, transform.rotation);
		
		dead.rigidbody.velocity = rigidbody.velocity;
		dead.angularVelocity = rigidbody.angularVelocity;
		}
	
	var emitter : ParticleEmitter = GetComponentInChildren(ParticleEmitter);
	if(emitter)
		{
		emitter.emit = false;
		emitter.transform.parent = null;
		}
}

@scriptRequireComponent(Rigidbody)
	
	