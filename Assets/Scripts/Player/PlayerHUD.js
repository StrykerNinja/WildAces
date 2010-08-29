//@script ExecuteInEditMode ()
var rstyle : GUIStyle;
var qstyle : GUIStyle;
var healthGUI : UpdateHealthGUI;
var died : Texture2D;
//var complete : Texture2D;
var replay : Texture2D;
var quitGame : Texture2D;

//var pistolsGUI : Texture2D;
//var shotgunGUI : Texture2D;

var currentHealthCount : int = 10;

var damageRec : PlayerDamageReceiver;

private var currentWeaponIndex = 0;
private var gameOver = false;

function Start()
{
	healthGUI.gameObject.guiTexture.pixelInset.y = Screen.height - healthGUI.gameObject.guiTexture.pixelInset.height - 5;
}

function LateUpdate () 
{
	// Update gui every frame
	// We do this in late update to make sure machine guns etc. were already executed
	UpdateGUI();
}

function UpdateGUI () {
	// Update health gui
	//Debug.Log("Screen Height: " + Screen.height);
	healthGUI.gameObject.guiTexture.pixelInset.y = Screen.height - healthGUI.gameObject.guiTexture.pixelInset.height - 5;
	healthGUI.UpdateHealth(damageRec.hitPoints);
}


function OnDeath()
{
	gameOver = true;
}

function OnGUI()
{
	if(gameOver)
	{
		var w = died.width;
		var h = died.height;
		var x = Screen.width/2 - w/2;
		var y = Screen.height/2 - h/2;
		GUI.DrawTexture(Rect(x,y,w, h), died);
		Time.timeScale = 0.000001;
		
		if(GUI.Button(Rect(Screen.width/2+20,y+250,quitGame.width, quitGame.height), " ", qstyle))
		{
			Application.Quit();
			Debug.Log("QUIT");
		}
		if(GUI.Button(Rect(Screen.width/2-replay.width-20,y+250,replay.width, replay.height), " ", rstyle))
		{
			paused = false;
			Time.timeScale = 1.0;
			gameOver = false;
			Application.LoadLevel(0);
			//SendMessage("Spawn", SendMessageOptions.DontRequireReceiver);
		}
		
	}
}