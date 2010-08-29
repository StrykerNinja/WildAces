var runSpeedScale = 1.0;

private var pistol = 0;

private var shotgun = 1;

private var dynamite = 2;

private var selectedWeapon = 0;

function Start ()
{
	selectedWeapon = 0;
/*	
-runNotShooting
-runShooting
runShootingAngle
runShootingUp
-jumpNotShooting
-jumpShooting
-fallNotShooting
-fallShooting
-landShooting
-landNotShooting
-idle
-runDynamite
-runThrowDynamite
-idleDynamite
-shooting
-runShotgun
-runShotgunShooting
-jumpShotgun
-jumpShotgunShooting
-fallShotgunShooting
-landShotgun
-landShotgunShooting
crouch
crouchShooting
*/
	animation["idle"].layer = -2;
	animation["runNotShooting"].layer = -1;
	animation["runShooting"].layer = -1;
	animation["shooting"].layer = -1;
	animation["runDynamite"].layer = -1;
	animation["runThrowDynamite"].layer = -1;
	animation["idleDynamite"].layer = -1;
	animation["runShotgun"].layer = -1;
	animation["runShotgunShooting"].layer = -1;
	
	//animation["crouch"].layer = -1;
	//animation["crouchShooting"].layer = -1;
	animation.SyncLayer(-1);
			
	animation["jumpNotShooting"].layer = 10;
	animation["fallNotShooting"].layer = 10;
	animation["jumpShooting"].layer = 10;
	animation["fallShooting"].layer = 10;
	animation["jumpShotgun"].layer = 10;
	animation["jumpShotgunShooting"].layer = 10;
	animation["fallShotgunShooting"].layer = 10;
	
	animation["landNotShooting"].layer = 10;
	animation["landNotShooting"].normalizedSpeed = 2.0;
	animation["landShotgun"].layer = 10;
	
	animation["landShooting"].layer = 10;
	animation["landShotgunShooting"].layer = 10;
	animation.SyncLayer(10);

	// We are in full control here - don't let any other animations play when we start
	animation.Stop();
	animation.Play("idle");
}

function Update ()
{
	var platformController : PlatformerController = GetComponent(PlatformerController);
	var currentSpeed = platformController.GetSpeed();
	
	// Fade in run
	if (currentSpeed > 0.1)
	{
		if (Input.GetButton ("Fire1"))
		{
			if ((selectedWeapon == shotgun) )
			{
				animation.CrossFade("runShotgunShooting", 0.0, PlayMode.StopSameLayer);
				animation.Blend("landShotgunShooting", 0);
			}
			else if (selectedWeapon == dynamite)
			{
				animation.CrossFade("runThrowDynamite", 0.0, PlayMode.StopSameLayer);
			}
			else
			{
				animation.CrossFade("runShooting", 0.0, PlayMode.StopSameLayer);
				animation.Blend("landShooting", 0);
			}
		}
		else
		{
			if ((selectedWeapon == shotgun))
			{
				animation.CrossFade("runShotgun", 0.0, PlayMode.StopSameLayer);
				animation.Blend("landShotgun", 0);
			}
			else if (selectedWeapon == dynamite)
			{
				animation.CrossFade("runDynamite", 0.0, PlayMode.StopSameLayer);
			}
			else
			{
				animation.CrossFade("runNotShooting", 0.0, PlayMode.StopSameLayer);
				animation.Blend("landNotShooting", 0);
			}
		}
	}
	// Fade out run
	else
	{
		if (Input.GetButton ("Fire1"))
		{
			if ((selectedWeapon == shotgun) )
			{
				//animation.CrossFade("runShotgunShooting", 0.0, );
				animation.CrossFade("landShotgunShooting", 0, PlayMode.StopSameLayer);
			}
			else if (selectedWeapon == dynamite)
			{
				animation.CrossFade("idleDynamite", 0.0, PlayMode.StopSameLayer);
			}
			else
			{
				animation.CrossFade("shooting", 0.0, PlayMode.StopSameLayer);
			}
		}
		else
		{
			if ((selectedWeapon == shotgun) )
			{
				animation.Blend("landShotgun", 0.0, 0.3);
			}
			else if (selectedWeapon == dynamite)
			{
				animation.Blend("idleDynamite", 0.0, 0.3);
			}
			else
			{
				animation.Blend("shooting", 0.0, 0.3);
				animation.Blend("runNotShooting", 0.0, 0.3);
			}
		}
	}
	
	/*if (platformController.IsCrouched())
	{
		//Debug.Log("crouched");
		if (Input.GetButton ("Fire1"))
		{
			animation.CrossFade("crouchShooting", 0.0, PlayMode.StopSameLayer);
			//animation.Blend("crouchShooting", 0.0, 0.3);
		}
		else
		{
			animation.CrossFade("crouch", 0.0, PlayMode.StopSameLayer);
			//animation.Blend("crouch", 0.0, 0.3);
		}
	}*/
	
	if (platformController.IsJumping())
	{
		if (Input.GetButton ("Fire1"))
		{
			if ((selectedWeapon == shotgun) )
			{
				animation.CrossFade("jumpShotgunShooting", 0, PlayMode.StopSameLayer);
			}
			else if (selectedWeapon == dynamite)
			{
				animation.CrossFade("runThrowDynamite", 0.0, PlayMode.StopSameLayer);
			}
			else
			{
				animation.CrossFade("jumpShooting", 0.0, PlayMode.StopSameLayer);
			}
		}
		else
		{
			if (platformController.HasJumpReachedApex())
			{
				if ((selectedWeapon == shotgun) )
				{
					animation.CrossFade("fallShotgunShooting", 0, PlayMode.StopSameLayer);
				}
				else if (selectedWeapon == dynamite)
				{
					animation.CrossFade("idleDynamite", 0.0, PlayMode.StopSameLayer);
				}
				else
				{
					animation.CrossFade("fallNotShooting", 0.0, PlayMode.StopSameLayer);
				}
			}
			else
			{
				if ((selectedWeapon == shotgun) )
				{
					animation.CrossFade("jumpShotgun", 0, PlayMode.StopSameLayer);
				}
				else if (selectedWeapon == dynamite)
				{
					animation.CrossFade("idleDynamite", 0.0, PlayMode.StopSameLayer);
				}
				else
				{
					animation.CrossFade("jumpNotShooting", 0.0, PlayMode.StopSameLayer);
				}
			}
		}
	}
}

function DidLand () 
{
	if (Input.GetButton("Fire1"))
	{
		if ((selectedWeapon == shotgun) )
		{
			animation.Play("landShotgunShooting");
		}
		else if (selectedWeapon == dynamite)
		{
			animation.Play("idleDynamite");
		}
		else
		{
			animation.Play("landShooting");
		}
	}
	else
	{
		if ((selectedWeapon == shotgun) )
		{
			animation.Play("landShotgun");
		}
		else if (selectedWeapon == dynamite)
		{
			animation.Play("idleDynamite");
		}
		else
		{
			animation.Play("landNotShooting");
		}
	}
}

function WeaponSelected(index : int)
{
	selectedWeapon = index;
}