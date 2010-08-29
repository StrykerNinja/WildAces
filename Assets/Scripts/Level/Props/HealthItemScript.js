var target : Transform;
var range = 2;
var healAmount = 3;
var particleEffect : GameObject;


function Start () 
{
	if (target == null && GameObject.FindWithTag("Player"))
	{
		target = GameObject.FindWithTag("Player").transform;
	}
	healAmount = 0 - healAmount;
}


function Update () 
{
	/*
	var direction = Vector2(target.position.x, target.position.y + 1.0) - Vector2(transform.position.x, transform.position.y);
	if(direction.magnitude > range)
	{
	return;
	}
	else
	{*/
	if(Vector3.Distance(transform.position, target.position) < range)
	{
		if(particleEffect)
			Instantiate(particleEffect, transform.position, Quaternion.identity);
		target.BroadcastMessage("ApplyDamage", healAmount, SendMessageOptions.DontRequireReceiver);
		Destroy(gameObject);
	}

}