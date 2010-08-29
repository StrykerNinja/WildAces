var visibleRange = 10.0;
var attackRange = 1.0;
var attackRepeat = 1.0;
var target : Transform;
private var rb : Rigidbody;
private var isJuggled = false;
private var lastJuggled = -10.0;
private var lastAttackTime : float = 1.0;
var juggledMoveDelay = 2.5;
var speed = 2.0;
var targetLayer : LayerMask = LayerMask.NameToLayer("Player");

function Start () 
{
	if (target == null && GameObject.FindWithTag("Player"))
	{
		target = GameObject.FindWithTag("Player").transform;
	}
	rb = GetComponent (Rigidbody);
	lastAttackTime = -1.0;
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
		if(!isJuggled)
		{
			if ( Mathf.Abs(target.position.x - transform.position.x) < attackRange )
			{
				if (lastAttackTime + attackRepeat > Time.time)
				{
					return;
				}
				SendMessageUpwards("GruntPunch", true);
				lastAttackTime = Time.time;
			}
			else
			{
				SendMessageUpwards("GruntRun", true);
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
			SendMessageUpwards("GruntJuggle", true);
			if(target.position.x < transform.position.x)
			{
				transform.position.x -= speed * Time.deltaTime / 2;
			}
			else
			{
				transform.position.x += speed * Time.deltaTime / 2;
			}
		}
	}
	else
	{
		SendMessageUpwards("AmIVisible", false);
		SendMessageUpwards("GruntIdle", true);
	}
}

function LateUpdate()
{
	transform.position.z = 0.0;
}

function Juggled()
{
	isJuggled = true;
	lastJuggled = Time.time;
	Invoke("NotJuggled", juggledMoveDelay);
}

function NotJuggled()
{
	if(lastJuggled + juggledMoveDelay <= Time.time)
	{
		isJuggled = false;
	}
}

@script RequireComponent (Rigidbody)