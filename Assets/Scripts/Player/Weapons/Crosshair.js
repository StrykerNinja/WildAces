var pistol : Texture2D;
var shotgun : Texture2D;
var dynamite : Texture2D;

private var pw : PlayerWeapons;

function Start()
{
pw = GetComponent(PlayerWeapons);
}

function GetCurrentMousePosition(j : int)
{
if(j == 1)
	return Rect( (Input.mousePosition.x - (shotgun.width / 2)), ( (Screen.height - Input.mousePosition.y) - (shotgun.height / 2)), shotgun.width, shotgun.height );
else if(j == 2)
	return Rect( (Input.mousePosition.x - (dynamite.width / 2)), ( (Screen.height - Input.mousePosition.y) - (dynamite.height / 2)), dynamite.width, dynamite.height );
else 
	return Rect( (Input.mousePosition.x - (pistol.width / 2)), ( (Screen.height - Input.mousePosition.y) - (pistol.height / 2)), pistol.width, pistol.height );
}
function OnGUI()
{

var i = pw.GetCurrentWeapon();

if(i == 1)
	GUI.DrawTexture( GetCurrentMousePosition(1), shotgun );
else if(i == 2)
	GUI.DrawTexture( GetCurrentMousePosition(2), dynamite );
else
	GUI.DrawTexture( GetCurrentMousePosition(0), pistol );
}