#pragma strict

@script ExecuteInEditMode()

var SendPacket : boolean = false;

function Update () {
	if(SendPacket)
		SendPacket = false;
	for(var joint : CharacterJoint in GetComponentsInChildren.<CharacterJoint>())
		DestroyImmediate(joint);
	for(var collider : CapsuleCollider in GetComponentsInChildren.<CapsuleCollider>())
		DestroyImmediate(collider);
	for(var collider : BoxCollider in GetComponentsInChildren.<BoxCollider>())
		DestroyImmediate(collider);
	for(var collider : SphereCollider in GetComponentsInChildren.<SphereCollider>())
		DestroyImmediate(collider);
	for(var rb : Rigidbody in GetComponentsInChildren.<Rigidbody>())
		DestroyImmediate(rb);
}