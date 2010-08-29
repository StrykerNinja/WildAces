private var currentAnimation = "idle";

function Start ()
{
/*	
run
runPunch
die
jump
fall
land
idle
standPunch
*/
	animation["idle"].layer = -2;
	animation["run"].layer = -1;
	animation["standPunch"].layer = -1;
	animation.SyncLayer(-1);
			
	//animation["jump"].layer = 10;
	animation["fall"].layer = 10;
	//animation["land"].layer = 10;
	animation.SyncLayer(10);

	animation["die"].layer = 20;
	
	// We are in full control here - don't let any other animations play when we start
	animation.Stop();
	animation.Play("idle");
}

function Update ()
{
	animation.CrossFade(currentAnimation, 0, PlayMode.StopSameLayer);
}

function GruntPunch()
{
	currentAnimation = "standPunch";
}

function GruntRun()
{
	currentAnimation = "run";
}

function GruntJuggle()
{
	currentAnimation = "fall";
}

function GruntIdle()
{
	currentAnimation = "idle";
}

function Death()
{
	animation.Play("die");
}