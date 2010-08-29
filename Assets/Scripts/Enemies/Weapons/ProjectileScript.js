
var explosion : GameObject;

/*

function OnCollisionEnter( collision : Collision)
{

		var contact : ContactPoint = collision.contacts[0];
		var rotation = Quaternion.FromToRotation(Vector3.up, contact.normal);
		Instantiate(explosion, contact.point, rotation);
		Destroy( gameObject );
}*/

var damage : int = 1;
private var destroyOnContact = true; 
function OnTriggerEnter(other : Collider)
{
		if(other.gameObject.tag != "Enemy")
	
			other.gameObject.BroadcastMessage("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
		if(explosion)
		{
			Instantiate(explosion, transform.position, Quaternion.identity);
		}
		if(destroyOnContact)
			Destroy(gameObject);
	
}