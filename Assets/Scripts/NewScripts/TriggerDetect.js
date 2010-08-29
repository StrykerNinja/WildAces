var par : GameObject;
var cnum : int;

function OnTriggerEnter(other : Collider)
{
	if(other.gameObject.tag == "TagEnemy")
	{
		other.gameObject.BroadcastMessage("Juggled", SendMessageOptions.DontRequireReceiver);
		other.gameObject.BroadcastMessage("ApplyDamage", 1, SendMessageOptions.DontRequireReceiver);
		if(par)
			par.BroadcastMessage("ComboHit", cnum, SendMessageOptions.DontRequireReceiver);
		Destroy(gameObject);
	}
}