#pragma strict

@script AddComponentMenu("Car/Wheel")
@script RequireComponent(WheelCollider, AudioSource)

var WheelMesh : Transform;
var Powered : boolean = true;
var Brakeable : boolean = true;
class brakingStiffnessMultipliers extends System.Object {
	var Forward : float = .75;
	var Sideways : float = .25;
}
var BrakingStiffnessMultipliers = brakingStiffnessMultipliers();
var Steerable : boolean = true;
enum Locations { 
	Front  =  2, 
	Center =  1, 
	Rear   =  0,
};
var Location : Locations = Locations.Center;

private var TurnMultiplier : int;
private var ForwardStiffness : float;
private var SidewaysStiffness : float;
private var wheelCollider : WheelCollider;
private var audioSource : AudioSource;

function Start() {
	TurnMultiplier = Location - 1;
	wheelCollider = GetComponent.<WheelCollider>();
	audioSource = GetComponent.<AudioSource>();
	ForwardStiffness = wheelCollider.forwardFriction.stiffness;
	SidewaysStiffness = wheelCollider.sidewaysFriction.stiffness;
}

function Upate() {
	//Wheel skid sound update
	var wheelHit : WheelHit;
    if(wheelCollider.GetGroundHit(wheelHit)) {
    	audioSource.volume = Mathf.Lerp(audioSource.volume, wheelHit.forwardSlip + wheelHit.sidewaysSlip, Time.deltaTime);
    } else
    	audioSource.volume = Mathf.Lerp(audioSource.volume, 0, Time.deltaTime);
}

function FixedUpdate() {
	MeshUpdate();
}

function MeshUpdate() {
	//Wheel real position
	var WheelColliderCenter = wheelCollider.transform.TransformPoint(wheelCollider.center);
	var hit : RaycastHit;
    if(Physics.Raycast(WheelColliderCenter, -wheelCollider.transform.up, hit, wheelCollider.suspensionDistance + wheelCollider.radius)) {
      WheelMesh.position = hit.point + (wheelCollider.transform.up * wheelCollider.radius);
    } else
      WheelMesh.position = WheelColliderCenter - (wheelCollider.transform.up * wheelCollider.suspensionDistance);
    //Wheel real rotation
    WheelMesh.Rotate(wheelCollider.rpm / 60 * 360 * Time.deltaTime, 0, 0);
	WheelMesh.localEulerAngles.y = wheelCollider.steerAngle - WheelMesh.localEulerAngles.z;
}

function WheelUpdate(MotorTorque : float, BrakeTorque : float, TurnAngle : float) {
	//Wheel power and turn update
	wheelCollider.brakeTorque = (Brakeable ? BrakeTorque : 0);
	wheelCollider.motorTorque = (Powered ? MotorTorque : 0);
	wheelCollider.steerAngle = (Steerable ? TurnAngle * TurnMultiplier : 0);
	//Wheel slip update
	wheelCollider.forwardFriction.stiffness = (BrakeTorque == 0 || !Brakeable ? ForwardStiffness : ForwardStiffness * BrakingStiffnessMultipliers.Forward);
	wheelCollider.sidewaysFriction.stiffness = (BrakeTorque == 0  || !Brakeable ? SidewaysStiffness : SidewaysStiffness * BrakingStiffnessMultipliers.Sideways);
	//Wheel mesh update
	MeshUpdate();
}