using UnityEngine;
using System.Collections;

[AddComponentMenu("Vehicle/Gearbox")]

public class Gearbox : MonoBehaviour {

	[System.Serializable]
	public class gear {
		//public string label = "Gear";
		public float torque = 10f;
		public float size = 1f;
	}
	public gear[] gears;

	Engine engine;
	Wheel[] wheels;
	gear currentGear;
	public int currentGearInt = 0;

	void Start () {
		engine = GetComponent<Engine>();
		wheels = GetComponentsInChildren<Wheel>();
		currentGear = gears[currentGearInt];
	}

	void FixedUpdate() {
		if (engine.rpm > engine.maxRPM - 100) {
			currentGearInt += 1;
			currentGearInt = Mathf.Clamp (currentGearInt, 0, gears.Length - 1);
			currentGear = gears [currentGearInt];
			engine.rpm *= gears [Mathf.Clamp (currentGearInt - 1, 0, gears.Length - 1)].size / currentGear.size;
		} else if (engine.rpm < engine.idleRPM + 100) {
			currentGearInt -= 1;
			currentGearInt = Mathf.Clamp (currentGearInt, 0, gears.Length - 1);
			currentGear = gears [currentGearInt];
			engine.rpm *= gears [Mathf.Clamp (currentGearInt - 1, 0, gears.Length - 1)].size / currentGear.size;
		}
	}
	public void SetTorque(float engineTorque) {
		foreach(Wheel wheel in wheels) {
			wheel.WheelUpdate(motorTorque: engineTorque);
		}
	}
}
