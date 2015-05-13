#pragma strict

@script ExecuteInEditMode()

var GetCenterOfMass : boolean = true;
var CenterOfMass : Vector3 = new Vector3(0, 0, 0);

function Update() {
	if(GetCenterOfMass) {
		gameObject.AddComponent.<Rigidbody>();
		CenterOfMass = GetComponent.<Rigidbody>().centerOfMass;
		Debug.Log(CenterOfMass);
		GetCenterOfMass = false;
	}
	transform.RotateAround(Quaternion.Euler(transform.forward) * CenterOfMass, 1);
}