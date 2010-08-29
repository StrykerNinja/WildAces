//@script ExecuteInEditMode ()

////load weapon sound clips
//var pistolSound : AudioSource;
//var shotgunSound : AudioSource;
////load weapon sound container
//var activeGunSound;

var pistolsGUI : Texture2D;
var shotgunGUI : Texture2D;
var dynamiteGUI : Texture2D;

private var currentWeaponGUI : Texture2D;
private var currentWeapon = 0;

var xPos : float;
var yPos : float;

function Start () {
	// Select the first weapon
	SelectWeapon(0);
	currentWeaponGUI = pistolsGUI;
	////initialize default sound as pistol 
	//activeGunSound = pistolSound;
}

function Update () {
	// Did the user press fire?
	if (Input.GetButton ("Fire1"))
		SendMessageUpwards("Fire", null, SendMessageOptions.DontRequireReceiver);

	if (Input.GetKeyDown("1")) {
		if(currentWeapon != 0)
		{
			currentWeapon = 0;
			SelectWeapon(0);
			currentWeaponGUI = pistolsGUI;	
			
			////make pistol sound the active firing sound
			//activeGunSound = pistolSound;
			
			Debug.Log("Switching to Pistol");
			SendMessageUpwards("PistolsSwitched", SendMessageOptions.DontRequireReceiver);
		}
	}	
	else if (Input.GetKeyDown("2")) {
	if(currentWeapon != 1)
		{
			currentWeapon = 1;
			SelectWeapon(1);
			currentWeaponGUI = shotgunGUI;	
			
			////make shotgun sound the active firing sound
			//activeGunSound = shotgunSound;		
			
			Debug.Log("Switching to Shotgun");
			SendMessageUpwards("ShotgunSwitched", SendMessageOptions.DontRequireReceiver);
		}
	}	
	else if (Input.GetKeyDown("3")) {
		if(currentWeapon != 2)
		{
			currentWeapon = 2;
			SelectWeapon(2);
			currentWeaponGUI = dynamiteGUI;
			
			Debug.Log("Switching to Dynamite");
			SendMessageUpwards("DynamiteSwitched", SendMessageOptions.DontRequireReceiver);
			BroadcastMessage("DynamiteSwitched", SendMessageOptions.DontRequireReceiver);
		}
	}
}

function SelectWeapon (index : int) {
	for (var i=0;i<transform.childCount;i++)	{
		// Activate the selected weapon
		if (i == index)
			transform.GetChild(i).gameObject.SetActiveRecursively(true);
		// Deactivate all other weapons
		else
			transform.GetChild(i).gameObject.SetActiveRecursively(false);
	}
	SendMessageUpwards("WeaponSelected", index, SendMessageOptions.DontRequireReceiver);
}


function OnGUI()
{
	//Debug.Log("Screen Height: " + Screen.height + ", GUI Height: " + greenHealthGUI.height + ", y Pos when subtracted: " + (Screen.height - greenHealthGUI.height));
	GUI.BeginGroup(Rect(xPos - (currentWeaponGUI.width /2), yPos - (currentWeaponGUI.height / 2), currentWeaponGUI.width, currentWeaponGUI.height));
	GUI.DrawTexture(Rect(0,0,currentWeaponGUI.width, currentWeaponGUI.height), currentWeaponGUI);
	GUI.EndGroup();
}

//function Fired(){
//	//play active gunSound
//	activeGunSound.Play();
//}

//function LockedFire(){
//	//play active gunSound
//	activeGunSound.Play();
//}

function GetCurrentWeapon() : int
{
	return currentWeapon;
}