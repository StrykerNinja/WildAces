private var currentAnimation = "idle";

function Start ()
{
/*	
die
shoot
idle
hit
*/
	animation["idle"].layer = -2;
	animation["shoot"].layer = -1;
	animation.SyncLayer(-1);
			
	animation["hit"].layer = 10;
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

function ShooterShoot()
{
	currentAnimation = "shoot";
}

function ShooterJuggle()
{
	currentAnimation = "hit";
}

function ShooterIdle()
{
	currentAnimation = "idle";
}

function Death()
{
	animation.Play("die");
}