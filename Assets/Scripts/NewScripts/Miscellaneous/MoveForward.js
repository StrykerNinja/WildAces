var speed = 1.0;

function Update () 
{

	transform.Translate(speed * Vector3.forward * Time.deltaTime);
}