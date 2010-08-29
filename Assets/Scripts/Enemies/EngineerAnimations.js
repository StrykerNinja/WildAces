private var currentAnimation = "idle";

function Start ()
{
/*	
runWrench
fallWrench
die
idleWrench
attackWrench
*/
	animation["idleWrench"].layer = -2;
	animation["runWrench"].layer = -1;
	animation["attackWrench"].layer = -1;
	animation.SyncLayer(-1);
			
	animation["fallWrench"].layer = 10;
	animation.SyncLayer(10);

	animation["die"].layer = 20;
	
	// We are in full control here - don't let any other animations play when we start
	animation.Stop();
	animation.Play("idleWrench");
}

function Update ()
{
	animation.CrossFade(currentAnimation, 0, PlayMode.StopSameLayer);
}

function EngineerAttack()
{
	currentAnimation = "attackWrench";
}

function EngineerRun()
{
	currentAnimation = "runWrench";
}

function EngineerIdle()
{
	currentAnimation = "idleWrench";
}

function Juggled()
{
	currentAnimation = "fallWrench";
}

function Death()
{
	animation.Play("die");
}