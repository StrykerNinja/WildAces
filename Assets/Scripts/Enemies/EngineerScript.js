var visibleRange = 10.0;
var attackRange = 1.0;
var target : Transform;
var speed = 2.0;
var targetLayer = 9;

function Start () 
{
	if (target == null && GameObject.FindWithTag("Player"))
	{
		target = GameObject.FindWithTag("Player").transform;
	}
}

function Update () 
{
	if (target == null)
	{
		return;
	}
	
	if(target.position.x < transform.position.x)
	{
		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(Vector3.left), Time.deltaTime * 10);
	}
	else
	{
		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(Vector3.right), Time.deltaTime * 10);
	}
	
	if( Mathf.Abs(target.position.x - transform.position.x) < visibleRange )
	{
		SendMessageUpwards("AmIVisible", true);
		if ( Mathf.Abs(target.position.x - transform.position.x) < attackRange )
		{
			SendMessageUpwards("EngineerAttack", true);
		}
		else
		{
			SendMessageUpwards("EngineerRun", true);
			if(target.position.x < transform.position.x)
			{
				transform.position.x -= speed * Time.deltaTime;
			}
			else
			{
				transform.position.x += speed * Time.deltaTime;
			}
		}
	}
	else
	{
		SendMessageUpwards("AmIVisible", false);
		SendMessageUpwards("EngineerIdle", true);
	}
	transform.position.z = 0.0;
}

@script RequireComponent (Rigidbody)