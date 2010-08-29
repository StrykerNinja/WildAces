
function OnBecameVisible()
{
SendMessageUpwards("AmIVisible", true);
//Debug.Log("Visible");
}
function OnBecameInvisible()
{
SendMessageUpwards("AmIVisible", false);
//Debug.Log("Invisible");
}