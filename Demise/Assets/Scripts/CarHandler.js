#pragma strict

@script RequireComponent(Rigidbody)

var MaxTurnAngle : float = 45;
var MaxTorque : float = 2000;
var Acceleration : float = 10;
var MaxBrakeTorque : float = 1000;
var BrakeLights : GameObject[];
var CenterOfGravity : Transform;

private var Wheels : Wheel[];
private var MotorTorque : float = 0;
private var BrakeTorque : float = 0;
private var TurnAngle : float = 0;

function Awake() {
	Wheels = GetComponentsInChildren.<Wheel>();
	GetComponent.<Rigidbody>().centerOfMass = CenterOfGravity.localPosition;
}

function Update() {
	if(Input.GetKeyDown(KeyCode.L)) {
		Application.LoadLevel("Island");
	}
	if(Input.GetKeyDown(KeyCode.R)) {
		Application.LoadLevel(Application.loadedLevelName);
	}
}

function FixedUpdate() {
	MotorTorque = (Input.GetButton("Vertical") ? Mathf.Lerp(MotorTorque, -Input.GetAxis("Vertical") * MaxTorque, Time.deltaTime * 0.75) : 0);
	BrakeTorque = (Input.GetButton("Jump") ? MaxBrakeTorque : 0);
	TurnAngle = Input.GetAxis("Horizontal") * MaxTurnAngle;
	for(var BrakeLight : GameObject in BrakeLights) {
		BrakeLight.SetActive(Input.GetButton("Jump"));
	}
	for(var Wheel in Wheels) {
		Wheel.WheelUpdate(MotorTorque, BrakeTorque, TurnAngle);
	}
}