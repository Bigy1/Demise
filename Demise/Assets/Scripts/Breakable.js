#pragma strict

@script RequireComponent(AudioSource);

var MeshObject : GameObject;
var Durability : float = 10;

private enum DestroyTypes {
	Detatch = 0,
	Shatter = 1,
	Explode = 2
}

var DestroyType : DestroyTypes = DestroyTypes.Detatch;

private var Broken : boolean = false;
private var PrvBroken : boolean = false;
private var OriginalRotation : Vector3;
private var OriginalPosition : Vector3;

@script ExecuteInEditMode() function Awake() {
	GetComponent.<AudioSource>().playOnAwake = false;
	OriginalRotation = transform.localEulerAngles;
	OriginalPosition = transform.localPosition;
}

function OnTriggerEnter(collider : Collider) {
	if(transform.root != collider.transform.root) {
		Durability -= 1;
		Durability = Mathf.Clamp(Durability, 0, Mathf.Infinity);
		Broken = Durability <= 0;
		if(Broken) {
			if(MeshObject && DestroyType == DestroyTypes.Detatch) {
				gameObject.AddComponent.<MeshFilter>();
				gameObject.AddComponent.<MeshRenderer>();
				GetComponent.<MeshFilter>().mesh = MeshObject.GetComponent.<MeshFilter>().mesh;
				GetComponent.<MeshRenderer>().material = MeshObject.GetComponent.<MeshRenderer>().material;
			}
			Destroy(MeshObject);
			transform.parent = null;
		}
		if(Broken != PrvBroken) {
			GetComponent.<AudioSource>().pitch = Random.Range(0.9, 1.1);
			GetComponent.<AudioSource>().Play();
			yield WaitForSeconds(GetComponent.<AudioSource>().clip.length);
			if(DestroyType == 0) {
				gameObject.AddComponent.<Rigidbody>();
				this.enabled = false;
			} else if(DestroyType == DestroyTypes.Detatch)
				GetComponent.<Collider>().enabled = false;
		}
		PrvBroken = Broken;
	}
}

function LateUpdate() {
	if(!Broken && DestroyType == DestroyTypes.Detatch) {
		transform.localEulerAngles = OriginalRotation;
		transform.localPosition = OriginalPosition;
	}
}