var comboComp : GameObject;
var launcher : GameObject;

private var comboNum = 0;
private var fireRate = .5;
private var lastShot = -.5;
private var lastHit = 0.0;
private var sp : Vector3;
private var ro : Vector3;
private var ic : GameObject;
private var td : TriggerDetect;
private var startCombo = false;

function Start()
{
	//Time.timeScale = .5;
}

function Update () 
{
	if(Input.GetButtonDown("Fire1") && Time.time - lastShot > fireRate)
	{
		if(Mathf.Abs(transform.eulerAngles.y-90) < 1.0)
		{
			if(comboNum == 0)
			{
				Inst(Vector3(.5,1.0,0), Vector3(0,90,0));
				comboNum++;
				lastShot = Time.time;
			}
			else if(comboNum == 1 && startCombo)
			{
				Inst(Vector3(.5,.7,0), Vector3(0,90,0));
				Inst(Vector3(.5,1.3,0), Vector3(0,90,0));
				comboNum++;
				lastShot = Time.time;
			}
			else if(comboNum == 2)
			{
				Inst(Vector3(.5,1.0,0), Vector3(0,90,0));
				Invoke("Temp1", .15);
				Invoke("Temp2", .3);
				comboNum++;
				lastShot = Time.time;
			}
			else if(comboNum == 3)
			{
				Inst(Vector3(.5,1.0,0), Vector3(0,90,0));
				Inst(Vector3(-.5,1.0,0), Vector3(180,90,0));
				
				lastShot = Time.time;
				comboNum++;
			}
			else if(comboNum == 4)
			{			
				Launch(Vector3(.5,0.3,.3), Vector3(0,90,0));
				Launch(Vector3(.5,0.3,-.3), Vector3(0,90,0));
				lastShot = Time.time;
				comboNum = 0;
			}
			else
			{
				comboNum = 0;
			}
		}
		else if(Mathf.Abs(transform.eulerAngles.y-270) < 1.0)
		{
			if(comboNum == 0)
			{
				Inst(Vector3(-.5,1.0,0), Vector3(180,90,0));
				comboNum++;
				lastShot = Time.time;
			}
			else if(comboNum == 1 && startCombo)
			{
				Inst(Vector3(-.5,.7,0), Vector3(180,90,0));
				Inst(Vector3(-.5,1.3,0), Vector3(180,90,0));
				comboNum++;
				lastShot = Time.time;
			}
			else if(comboNum == 2)
			{
				Inst(Vector3(-.5,1.0,0), Vector3(180,90,0));
				Invoke("Temp3", .15);
				Invoke("Temp4", .3);
				comboNum++;
				lastShot = Time.time;
			}
			else if(comboNum == 3)
			{
				Inst(Vector3(.5,1.0,0), Vector3(0,90,0));
				Inst(Vector3(-.5,1.0,0), Vector3(180,90,0));
				
				lastShot = Time.time;
				comboNum++;
			}
			else if(comboNum == 4)
			{			
				Launch(Vector3(-.5,0.3,.3), Vector3(180,90,0));
				Launch(Vector3(-.5,0.3,-.3), Vector3(180,90,0));
				lastShot = Time.time;
				comboNum = 0;
			}
			else
			{
				comboNum = 0;
			}
		
		}
	}
	if(Time.time - lastHit > 1.5*fireRate && comboNum > 1)
	{
		comboNum = 0;
	}
}


function ComboHit(c : int)
{
//Debug.Log(comboNum + " -> " + (c+1));
//if(c == comboNum)
	//comboNum=c+1;
lastHit = Time.time;
startCombo = true;
}

function Temp1()
{
				Inst(Vector3(0,1.5,0), Vector3(315,90,0));
}
function Temp2()
{
				Inst(Vector3(-.5,2.0,0), Vector3(270,90,0));
}

function Temp3()
{
				Inst(Vector3(0,1.5,0), Vector3(225,90,0));
}
function Temp4()
{
				Inst(Vector3(.5,2.0,0), Vector3(270,90,0));
}



function Inst(off : Vector3, ang : Vector3)
{
			sp = Vector3(transform.position.x + off.x, transform.position.y +off.y, transform.position.z+off.z);
			ro = Vector3(ang.x,ang.y,ang.z);
			//if(comboNum > 0)
				//ro.x  = 360.0-(30.0*comboNum);
			ic = Instantiate(comboComp);
			ic.transform.position = sp;
			ic.transform.eulerAngles = ro;
			td = ic.GetComponent(TriggerDetect);
			if(td)
			{
				td.par = gameObject;
				td.cnum = comboNum;
			}

}

function Launch(off : Vector3, ang : Vector3)
{
			sp = Vector3(transform.position.x + off.x, transform.position.y +off.y, transform.position.z+off.z);
			ro = Vector3(ang.x,ang.y,ang.z);
			//if(comboNum > 0)
				//ro.x  = 360.0-(30.0*comboNum);
			ic = Instantiate(launcher);
			ic.transform.position = sp;
			ic.transform.eulerAngles = ro;
			td = ic.GetComponent(TriggerDetect);
			if(td)
			{
				td.par = gameObject;
				td.cnum = comboNum;
			}

}