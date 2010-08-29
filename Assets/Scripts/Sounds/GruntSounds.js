//load sound clips
var GruntSwing : AudioSource;
var GruntDeath : AudioSource;

function Start () {
	Debug.Log("Starting Grunt Sounds");
}

function GruntPunch(){
	Debug.Log("Grunt Swing");
	GruntSwing.Play();
}

function Death(){
	Debug.Log("Grunt Died");
	GruntDeath.Play();
}