var damage = 10;
var targetLayer : LayerMask = LayerMask.NameToLayer("Player");
var attackRate = 1.0;
private var lastAttackTime = -10.0;

function OnCollisionStay(collision : Collision)
{
//	Debug.Log(collision.gameObject.layer + " " + targetLayer);
	if(collision.gameObject.layer == targetLayer && lastAttackTime + attackRate < Time.time)
	{
		
		lastAttackTime = Time.time;
		collision.gameObject.BroadcastMessage("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
//		Debug.Log("DAMAGE");
	}

	
}
