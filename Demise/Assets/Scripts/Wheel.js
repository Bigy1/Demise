#pragma strict

@script RequireComponent(WheelCollider)

var WheelMesh : Transform;
var Powered : boolean = true;
var Steerable : boolean = true;
var TurnOffset : float = 0;
var Brakeable : boolean = true;

class brakingStiffnessMultipliers extends System.Object {
	var Forward : float = .75;
	var Sideways : float = .25;
}

var BrakingStiffnessMultipliers = brakingStiffnessMultipliers();

enum Locations { 
	Front  =  2, 
	Center =  1, 
	Rear   =  0,
};
var Location : Locations = Locations.Center;

private var TurnMultiplier : int;
private var ForwardStiffness : float;
private var SidewaysStiffness : float;

function Start() {
	TurnMultiplier = Location - 1;
	ForwardStiffness = GetComponent.<WheelCollider>().forwardFriction.stiffness;
	SidewaysStiffness = GetComponent.<WheelCollider>().sidewaysFriction.stiffness;
}

function WheelUpdate(MotorTorque : float, BrakeTorque : float, TurnAngle : float) {
	GetComponent.<WheelCollider>().forwardFriction.stiffness = (BrakeTorque != 0 ? ForwardStiffness * BrakingStiffnessMultipliers.Forward : ForwardStiffness);
	GetComponent.<WheelCollider>().sidewaysFriction.stiffness = (BrakeTorque != 0 ? SidewaysStiffness * BrakingStiffnessMultipliers.Sideways : SidewaysStiffness);
	GetComponent.<WheelCollider>().motorTorque = (Powered ? MotorTorque : 0);
	GetComponent.<WheelCollider>().brakeTorque = (Brakeable ? BrakeTorque : 0);;
	WheelMesh.Rotate(GetComponent.<WheelCollider>().rpm / 60 * 360 * Time.deltaTime, 0, 0);
	GetComponent.<WheelCollider>().steerAngle = (Steerable ? (TurnAngle + TurnOffset) * TurnMultiplier : 0);
	WheelMesh.localEulerAngles.y = GetComponent.<WheelCollider>().steerAngle - WheelMesh.localEulerAngles.z;
	var WheelColliderCenter = GetComponent.<WheelCollider>().transform.TransformPoint(GetComponent.<WheelCollider>().center);
	var hit : RaycastHit;
    if (Physics.Raycast(WheelColliderCenter, -GetComponent.<WheelCollider>().transform.up, hit, GetComponent.<WheelCollider>().suspensionDistance + GetComponent.<WheelCollider>().radius)) {
      WheelMesh.position = hit.point + (GetComponent.<WheelCollider>().transform.up * GetComponent.<WheelCollider>().radius);
    } else {
      WheelMesh.position = WheelColliderCenter - (GetComponent.<WheelCollider>().transform.up * GetComponent.<WheelCollider>().suspensionDistance);
    }
}