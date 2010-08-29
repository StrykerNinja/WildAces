var hitPoints = 10.0;
var maxHitPoints = 10;
var detonationDelay = 0.0;
var explosion : Transform;
var deadReplacement : Rigidbody;
var armor = 0;
private var currentArmor = 0;



function ApplyDamage(damage : float)
{
	//death stuff
	if(hitPoints <= 0.0)
		{
		hitPoints = maxHitPoints;
		SendMessage ("OnDeath", SendMessageOptions.DontRequireReceiver);
		return;
		}
		
	//Debug.Log("ApplyDamage" + damage);



	if(currentArmor <= 0)
	{
		hitPoints -= damage;
		currentArmor = armor;
	}
	else
	{
		currentArmor -= damage;		
	}


	//death stuff
	if(hitPoints <= 0.0)
		{
		var emitter : ParticleEmitter = GetComponentInChildren(ParticleEmitter);
		if(emitter)
			emitter.emit = true;
			
			hitPoints = maxHitPoints;
		SendMessage ("OnDeath", SendMessageOptions.DontRequireReceiver);
		//Invoke("DelayedDetonate", detonationDelay);
		}
		else if(hitPoints > maxHitPoints)
		{
		hitPoints = maxHitPoints;
		}
}

function DelayedDetonate()
{
	BroadcastMessage("Detonate");
}

function Detonate()
{
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


function PistolsSwitched()
{
currentArmor = 0;
armor = 0;
}

function ShotgunSwitched()
{
armor = 2;
}

function DynamiteSwitched()
{
armor = 1;
}


@scriptRequireComponent(Rigidbody)
	
	