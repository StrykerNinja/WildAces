private var gameOver : boolean = false;

//var died : Texture2D;
var complete : Texture2D;
var replay : Texture2D;
var quitGame : Texture2D;
var rstyle : GUIStyle;
var qstyle : GUIStyle;

function OnTriggerEnter(other : Collider)
{
	if(other.gameObject.tag == "Player")
	{
		gameOver = true;
		Time.timeScale = 0.000001;
	}
}

function OnGUI()
{
	if(gameOver)
	{
		var w = complete.width;
		var h = complete.height;
		var x = Screen.width/2 - w/2;
		var y = Screen.height/2 - h/2;
		GUI.DrawTexture(Rect(x,y,w, h), complete);
	
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