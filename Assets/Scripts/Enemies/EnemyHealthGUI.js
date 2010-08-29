var greenHealthGUI : Texture2D;
var yellowHealthGUI : Texture2D;
var redHealthGUI : Texture2D;
var lockIconGUI : Texture2D;

var healthBoxWidth : int = 13;
var enemyHeight = 150.0;

var damageRec : DamageReceiver;

private var currentHealthCount : int = 10;
private var healthChanged = false;
private var prevHP = 0;
private var isVis = false;
private var isLocked = false;

function OnGUI()
{
	if(isVis)
	{
		var healthPos = Camera.main.WorldToScreenPoint( transform.position );
		var healthBox = greenHealthGUI.width - ((10 - currentHealthCount) * healthBoxWidth);
		GUI.BeginGroup(Rect(healthPos.x - (healthBox / 2), Screen.height - healthPos.y - enemyHeight, healthBox, greenHealthGUI.height));
			if (currentHealthCount >=6)
			{
				//Debug.Log(healthPos);
				GUI.DrawTexture(Rect(0, 0, greenHealthGUI.width, greenHealthGUI.height), greenHealthGUI);
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
		if(isLocked)
		{
			GUI.DrawTexture(Rect(healthPos.x - (healthBox / 2) - 25, Screen.height - healthPos.y - enemyHeight,lockIconGUI.width, lockIconGUI.height), lockIconGUI);
		}
		//healthChanged = false;
	}
	
}

function UpdateHealth(input : int)
{
	currentHealthCount = input;
	//healthChanged = true;
}


function LateUpdate () 
{
	// Update gui every frame
	// We do this in late update to make sure machine guns etc. were already executed
	UpdateGUI();
}

function UpdateGUI () {

	UpdateHealth(damageRec.hitPoints);
}


/*
function OnBecameVisible()
{
isVis = true;
Debug.Log("Visible");
}
function OnBecameInvisible()
{
isVis = false;
Debug.Log("Invisible");
}*/


function AmIVisible(input : boolean)
{
isVis = input;
//Debug.Log("VIS" + gameObject.name);
}

function LockedOn()
{
isLocked = true;
}

function LostLock()
{
isLocked = false;
}
