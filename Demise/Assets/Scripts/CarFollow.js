#pragma strict

var CarTransform : Transform;
var CameraSmoothing : float = 5;
var CameraDisplacement : Vector3 = new Vector3(0, 2, 2);
var CameraRotation : Vector3;

function FixedUpdate() {
	transform.position = Vector3.Slerp(transform.position, CarTransform.position + (CarTransform.rotation * Quaternion.Euler(CameraRotation) * CameraDisplacement), Time.deltaTime * CameraSmoothing);
	transform.LookAt(CarTransform);
	transform.rotation *= Quaternion.Euler(-20, 0, 0);
}