#pragma strict

@script AddComponentMenu("Scripts/Camera/Car/Follow Fixed")

var CarTransform : Transform;
var CameraSmoothing : float = 5;
var CameraDisplacement : Vector3 = new Vector3(0, 2, 2);
var CameraRotation : Vector3 = new Vector3(-20, 0, 0);
var ReverseThreshhold : float = 0.1;

private var CameraPosition : Vector3;
private var PrevCameraPosition : Vector3 = Vector3.zero;
private var Rot : float = 0;

function FixedUpdate() {
	Rot = ((CarTransform.InverseTransformDirection(CarTransform.GetComponent.<Rigidbody>().velocity)).z < ReverseThreshhold ? 0 : -180);
	CameraPosition = CarTransform.InverseTransformPoint(CarTransform.position + CarTransform.rotation * Quaternion.Euler(0, Rot, 0) * CameraDisplacement);
	Debug.DrawRay(CarTransform.position, (CarTransform.TransformPoint(CameraPosition) - CarTransform.position), Color.red);
	CameraPosition = Vector3.Slerp(PrevCameraPosition, CameraPosition, Time.deltaTime * CameraSmoothing);
	Debug.DrawRay(CarTransform.position, (CarTransform.TransformPoint(CameraPosition) - CarTransform.position), Color.green);
	PrevCameraPosition = CameraPosition;
	var hit : RaycastHit;
	Debug.DrawRay(CarTransform.position, (CarTransform.TransformPoint(CameraPosition) - CarTransform.position), Color.blue);
	if(Physics.Raycast(CarTransform.position, (CarTransform.TransformPoint(CameraPosition) - CarTransform.position).normalized, hit, CameraDisplacement.magnitude + 0.125, 9)) {
		CameraPosition = CarTransform.InverseTransformPoint((CarTransform.TransformPoint(CameraPosition) - CarTransform.position).normalized * (Vector3.Distance(CarTransform.position, hit.point) - 0.125));
		Debug.DrawRay(CarTransform.position, (CarTransform.TransformPoint(CameraPosition) - CarTransform.position), Color.magenta);
	}
	transform.position = CarTransform.TransformPoint(CameraPosition);
	transform.LookAt(CarTransform);
	transform.rotation *= Quaternion.Euler(CameraRotation);
	GetComponent.<Camera>().fieldOfView = 60 + (CarTransform.GetComponent.<Rigidbody>().velocity.magnitude) / 100;
}