#pragma strict

@script AddComponentMenu("Scripts/Camera/Car/First Person")

var Anchor : Transform;

function FixedUpdate() {
	transform.rotation = Quaternion.Slerp(Anchor.rotation, transform.rotation, Time.deltaTime);
}

function LateUpdate() {
	transform.position = Anchor.position;
}