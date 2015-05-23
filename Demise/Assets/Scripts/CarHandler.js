#pragma strict

@script RequireComponent(Rigidbody)

var MaxTurnAngle : float = 45;
var MaxTorque : float = 2000;
var Acceleration : float = 10;
var MaxBrakeTorque : float = 1000;
var SteeringWheel : Transform;
var BrakeLights : GameObject[];
var CenterOfGravity : Transform;
var Materials : Material[];
var EngineAudioSource : AudioSource;
var MaxRPM : float = 1000;

private var MaterialsInt : int = 0;
private var Wheels : Wheel[];
private var MotorTorque : float = 0;
private var BrakeTorque : float = 0;
private var TurnAngle : float = 0;
private var AverageRPM : float = 0;
private var PoweredWheels : int;

function Awake() {
	Wheels = GetComponentsInChildren.<Wheel>();
	GetComponent.<Rigidbody>().centerOfMass = CenterOfGravity.localPosition;
}

function Update() {
	if(Input.GetKeyDown(KeyCode.C)) {
		MaterialsInt += 1;
		if(MaterialsInt > Materials.Length - 1)
			MaterialsInt = 0;
		for(var renderer : Renderer in GetComponentsInChildren.<Renderer>()) {
			for(var material : Material in Materials) {
				if(renderer.material.name == material.name + " (Instance)") {
					renderer.material = Materials[MaterialsInt];
					break;
				}
			}
		}
	}
	if(Input.GetKeyDown(KeyCode.L)) {
		Application.LoadLevel("Island");
	}
	if(Input.GetKeyDown(KeyCode.R)) {
		Application.LoadLevel(Application.loadedLevelName);
	}
}

function FixedUpdate() {
	PoweredWheels = 0;
	MotorTorque = (Input.GetButton("Vertical") ? Mathf.Lerp(MotorTorque, -Input.GetAxis("Vertical") * MaxTorque, Time.deltaTime * Acceleration) : 0);
	Debug.Log(MotorTorque);
	BrakeTorque = (Input.GetButton("Jump") ? MaxBrakeTorque : 0);
	for(var BrakeLight : GameObject in BrakeLights)
		BrakeLight.SetActive(Input.GetButton("Jump"));
	TurnAngle = Input.GetAxis("Horizontal") * MaxTurnAngle;
	SteeringWheel.localRotation.eulerAngles.z = Mathf.Lerp((SteeringWheel.localRotation.eulerAngles.z > 180 ? SteeringWheel.localRotation.eulerAngles.z - 360 : SteeringWheel.localRotation.eulerAngles.z), TurnAngle, Time.deltaTime * 32);
	for(var BrakeLight : GameObject in BrakeLights) { 
		BrakeLight.SetActive(Input.GetButton("Jump"));
	}
	for(var Wheel in Wheels) {
		Wheel.WheelUpdate(MotorTorque, BrakeTorque, TurnAngle);
		if(Wheel.Powered) {
			AverageRPM += Mathf.Abs(Wheel.gameObject.GetComponent.<WheelCollider>().rpm);
			PoweredWheels += 1;
		}
	}
	AverageRPM /= PoweredWheels;
	EngineAudioSource.pitch = Mathf.Lerp(GetComponentInChildren.<AudioSource>().pitch, 0.5 + AverageRPM / MaxRPM, Time.deltaTime * 4);
}