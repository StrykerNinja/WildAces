var target : Transform;

function Start () 
{
	if (target == null && GameObject.FindWithTag("Player"))
	{
		target = GameObject.FindWithTag("Player").transform;
	}
}

function Update () 
{
	//if(target.position.x < transform.position.x)
	//{
	//	transform.eulerAngles.y = 270;
	//}
	//else
	//{
	//	transform.eulerAngles.y = 90;
	//}
	
	if(target.position.x < transform.position.x)
	{
		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(Vector3.left), Time.deltaTime * 10);
	}
	else
	{
		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(Vector3.right), Time.deltaTime * 10);
	}
}

function LateUpdate()
{
	transform.position.z = 0.0;
}