var delayTime = 0.0;

function Start()
{
Invoke("Disappear", delayTime);
}

function Disappear()
{
	Destroy(gameObject);
}