//load sound clips
var ShooterShot : AudioSource;
var ShooterDeath : AudioSource;

function Start () {
	Debug.Log("Starting Shooter Sounds");
}

function ShooterShoot(){
	Debug.Log("Shooter Shot");
	ShooterShot.Play();
}

function Death(){
	Debug.Log("Shooter Died");
	ShooterDeath.Play();
}