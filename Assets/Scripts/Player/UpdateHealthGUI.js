@script ExecuteInEditMode ()

var greenHealthGUI : Texture2D;
var yellowHealthGUI : Texture2D;
var redHealthGUI : Texture2D;

var healthBoxWidth : int = 19;

var xPos : float;
var yPos : float;

private var currentHealthCount : int = 10;

function OnGUI()
{
	//Debug.Log("Screen Height: " + Screen.height + ", GUI Height: " + greenHealthGUI.height + ", y Pos when subtracted: " + (Screen.height - greenHealthGUI.height));
	GUI.BeginGroup(Rect(xPos, yPos, greenHealthGUI.width - ((10 - currentHealthCount) * healthBoxWidth), greenHealthGUI.height));
		if (currentHealthCount >=6)
		{
			GUI.DrawTexture(Rect(0,0,greenHealthGUI.width, greenHealthGUI.height), greenHealthGUI);
		}
		else if (currentHealthCount >=4)
		{
			GUI.DrawTexture(Rect(0,0,yellowHealthGUI.width, yellowHealthGUI.height), yellowHealthGUI);
		}
		else
		{
			GUI.DrawTexture(Rect(0,0,redHealthGUI.width, redHealthGUI.height), redHealthGUI);
		}
	GUI.EndGroup();
}

function UpdateHealth(input : int)
{
	currentHealthCount = input;
}