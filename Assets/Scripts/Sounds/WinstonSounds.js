//load weapon sound clips
var pistolShoot : AudioSource;
var pistolSwitch : AudioSource;
var shotgunShoot : AudioSource;
var shotgunSwitch : AudioSource;
var dynamiteShoot : AudioSource;
var dynamiteSwitch : AudioSource;

//load weapon sound container
var activeShoot;

function Start () {
	//Debug.Log("Starting Winston Sounds");
	//initialize default sound as pistol 
	activeShoot = pistolShoot;
}

function PistolsSwitched() {
Debug.Log("Pistol was switched");
 activeShoot = pistolShoot;
 pistolSwitch.Play();
}

function ShotgunSwitched() {
Debug.Log("Shotgun was switched");
 activeShoot = shotgunShoot;
 shotgunSwitch.Play();
}

function DynamiteSwitched() {
Debug.Log("Dynamite was switched");
 activeShoot = dynamiteShoot;
 dynamiteSwitch.Play();
}

function Fired(){
	//play active gunSound
	activeShoot.Play();
}

function LockedFire(){
Debug.Log("LockedFire");
	//play active gunSound
	activeShoot.Play();
}