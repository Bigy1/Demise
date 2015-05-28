using UnityEngine;
using System.Collections;

[AddComponentMenu("Vehicle/Engine")]

public class Engine : MonoBehaviour {

	public AudioSource engineAudioSource;
	public float idleRPM = 800f;
	public float maxRPM = 6000f;
    public float maxTorque = 200000;
	public AnimationCurve acceleration;
	[System.Serializable]
	public class GasClass {
		public float maxLitersGas = 60f;
		public float currentLitersGas = 60f;
		public float fullThrottleConsumption = 0.01f;
		public float idleConsumption = 0.0001f;
		public float RPMPerLiter = 0.005f;
		public float kilometersPerLiter = 6.8f;
	}
	public GasClass gas = new GasClass();
	public float resistance;
	[HideInInspector]
	public float rpm = 0f;

	Gearbox gearBox;
	float throttle = 0f;
	
	void Start() {
		gearBox = GetComponent<Gearbox>();
	}

	void FixedUpdate() {
        throttle = Mathf.Lerp(throttle, Input.GetAxis("Vertical"), Time.deltaTime * .1);
		gas.currentLitersGas -= gas.idleConsumption;
		gas.currentLitersGas = Mathf.Clamp(gas.currentLitersGas, 0, gas.maxLitersGas);
		//rpm = Mathf.Lerp(rpm, idleRPM + throttle * maxRPM, Time.deltaTime * resistance);
		gearBox.SetTorque(throttle);
		engineAudioSource.pitch = Mathf.Lerp(engineAudioSource.pitch, 1 + (rpm - idleRPM) / (maxRPM - idleRPM), Time.deltaTime * 4);
	}
}