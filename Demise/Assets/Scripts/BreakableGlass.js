#pragma strict

@script RequireComponent(Rigidbody, AudioSource);

var GlassMesh : GameObject;
var Durability : float = 10;

private var Broken : boolean = false;
private var PrvBroken : boolean = false;

@script ExecuteInEditMode() function Awake() {
	GetComponent.<Collider>().isTrigger = true;
	GetComponent.<Rigidbody>().drag = GetComponent.<Rigidbody>().angularDrag = 0;
	GetComponent.<Rigidbody>().useGravity = false;
	GetComponent.<Rigidbody>().isKinematic = true;
	GetComponent.<AudioSource>().playOnAwake = false;
}

function OnTriggerEnter(Collided : Collider) {
	if(Collided.transform.root != transform.root) {
		Debug.Log("Asd");
		Durability -= 1;
		Durability = Mathf.Clamp(Durability, 0, Mathf.Infinity);
		Broken = Durability == 0;
		GetComponent.<Collider>().enabled = !Broken;
		GlassMesh.SetActive(!Broken);
		if(Broken != PrvBroken) {
			GetComponent.<AudioSource>().pitch = Random.Range(0.9, 1.1);
			GetComponent.<AudioSource>().Play();
		}
		PrvBroken = Broken;
	}
}