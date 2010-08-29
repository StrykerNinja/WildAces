var mstyle : GUIStyle;
var rstyle : GUIStyle;
var estyle : GUIStyle;

var menu : Texture2D;
var returnToGame : Texture2D;
var exitGame : Texture2D;

private var paused : boolean = false;

function Update () 
{
if(Input.GetButtonDown("Pause"))
	Pause();
}

function Pause()
{
	if(paused)
	{
		Time.timeScale = 1.0;
	}
	else
	{
		Time.timeScale = 0.0000001;
	}
	paused = !paused;
}

function OnGUI()
{
	if(paused)
	{
		var w = menu.width;
		var h = menu.height;
		var x = Screen.width/2 - w/2;
		var y = Screen.height/2 - h/2;
		GUI.Box(Rect(x,y,w, h), " ", mstyle);
		
		if(GUI.Button(Rect(x+105,y+150,returnToGame.width, returnToGame.height), " ", rstyle))
		{
			paused = false;
			Time.timeScale = 1.0;
		}
		if(GUI.Button(Rect(x+160,y+490,exitGame.width, exitGame.height), " ", estyle))
		{
			Application.Quit();
			Debug.Log("QUIT");
		}
	}
}
