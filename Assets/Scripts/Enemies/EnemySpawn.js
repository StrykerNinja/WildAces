public var respawnTime = 30.0;
public var maxNumberOfEnemies = 5;
public var enemy : GameObject;

private var shouldSpawn = false;
private var lastSpawnTime = -1.0;
private var numberOfEnemiesSpawned = 0;

function Start () 
{
	if (enemy == null && GameObject.FindWithTag("Enemy"))
	{
		enemy = GameObject.FindWithTag("Enemy");
	}
}

function Update () 
{
	if (enemy == null)
	{
		return;
	}
	
	if (numberOfEnemiesSpawned >= maxNumberOfEnemies)
	{
		return;
	}
	
	if (shouldSpawn)
	{
		SpawnEnemy();
	}
}

function Sentry()
{
	// received a sentry message, main character is near, start spawning enemies
	shouldSpawn = true;
}

function SpawnEnemy()
{
	if (numberOfEnemiesSpawned > 0)
	{	
		if (lastSpawnTime + respawnTime > Time.time)
		{
			return;
		}
	}
	if (numberOfEnemiesSpawned >= maxNumberOfEnemies)
	{
		return;
	}
	Instantiate(enemy, transform.position, Quaternion.identity);
	lastSpawnTime = Time.time;
	numberOfEnemiesSpawned++;
}