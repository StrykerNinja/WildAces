var par : GameObject;
var cnum : int;
var launchAmount : float = 10.0;

function OnTriggerEnter(other : Collider)
{
	if(other.gameObject.tag == "TagEnemy")
	{
		other.gameObject.BroadcastMessage("Juggled", SendMessageOptions.DontRequireReceiver);
		other.gameObject.BroadcastMessage("ApplyDamage", 1, SendMessageOptions.DontRequireReceiver);
		if(par)
			par.BroadcastMessage("ComboHit", cnum, SendMessageOptions.DontRequireReceiver);
		var rb = other.gameObject.GetComponent(Rigidbody);
		if(rb)
			rb.velocity.y += launchAmount;
		Destroy(gameObject);
	}
}