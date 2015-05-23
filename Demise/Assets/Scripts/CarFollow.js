#pragma strict

var CarTransform : Transform;
var CameraSmoothing : float = 5;
var CameraDisplacement : Vector3 = new Vector3(0, 2, 2);
var CameraRotation : Vector3 = new Vector3(-20, 0, 0);
var ReverseThreshhold : float = 0.1;

private var CameraPosition : Vector3;

function FixedUpdate() {
	CameraPosition = CarTransform.position + CarTransform.rotation * ((CarTransform.InverseTransformDirection(CarTransform.GetComponent.<Rigidbody>().velocity)).z < ReverseThreshhold ? Quaternion.identity : Quaternion.Euler(0, 180, 0)) * CameraDisplacement;
	var hit : RaycastHit;
	transform.position = Vector3.Slerp(transform.position, CameraPosition, Time.deltaTime * CameraSmoothing);
	if(Physics.Raycast(CarTransform.position, (CameraPosition - CarTransform.position).normalized, hit, CameraDisplacement.magnitude + 0.125, 9))
		CameraPosition = hit.point + hit.normal / 8;
	transform.LookAt(CarTransform);
	transform.rotation *= Quaternion.Euler(CameraRotation);
}