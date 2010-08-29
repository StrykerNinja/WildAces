private var ang : Vector3;

function Start()
{
ang = transform.eulerAngles;
}

function Update () 
{
transform.eulerAngles = ang;
}