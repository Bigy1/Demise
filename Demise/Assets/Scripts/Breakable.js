#pragma strict

@script RequireComponent(AudioSource)

var MeshObject : GameObject;
var Durability : float = 10;

private enum DestroyTypes {
	Detatch = 0,
	Shatter = 1,
	Explode = 2
}

var DestroyType : DestroyTypes = DestroyTypes.Detatch;
var DestroyParticles : GameObject;

private var Broken : boolean = false;
private var PrvBroken : boolean = false;
private var ColliderType;

@script ExecuteInEditMode() function Awake() {
	GetComponent.<AudioSource>().playOnAwake = false;
	if(GetComponents.<Collider>().Length < 2) {
		ColliderType = GetComponent.<Collider>().GetType();
		if(ColliderType == MeshCollider) {
			gameObject.AddComponent.<MeshCollider>();
			GetComponents.<MeshCollider>()[1].convex = GetComponents.<MeshCollider>()[0].convex;
			GetComponents.<MeshCollider>()[1].sharedMesh = GetComponents.<MeshCollider>()[0].sharedMesh;
			if(!GetComponents.<MeshCollider>()[0].material.name.StartsWith("Default (Instance)"))
				GetComponents.<MeshCollider>()[1].material = GetComponents.<MeshCollider>()[0].material;
			GetComponents.<MeshCollider>()[1].isTrigger = true;
		} else if(ColliderType == BoxCollider) {
			gameObject.AddComponent.<BoxCollider>();
			GetComponents.<BoxCollider>()[1].center = GetComponents.<BoxCollider>()[0].center;
			GetComponents.<BoxCollider>()[1].size = GetComponents.<BoxCollider>()[0].size;
			if(!GetComponents.<BoxCollider>()[0].material.name.StartsWith("Default (Instance)"))
				GetComponents.<BoxCollider>()[1].material = GetComponents.<BoxCollider>()[0].material;
			GetComponents.<BoxCollider>()[1].isTrigger = true;
		}
	}
}

function OnTriggerEnter(collider : Collider) {
	if(transform.root != collider.transform.root)
		Damage();
}
	
function Damage() {
    Durability -= transform.root.GetComponent.<Rigidbody>().GetRelativePointVelocity(transform.localPosition).magnitude;
	Durability = Mathf.Clamp(Durability, 0, Mathf.Infinity);
	Broken = Durability <= 0;
	if(Broken) {
		Destroy(GetComponents.<Collider>()[1]);
		GetComponent.<AudioSource>().pitch = Random.Range(0.9, 1.1);
		GetComponent.<AudioSource>().Play();
		if(DestroyParticles)
			Destroy(Instantiate(DestroyParticles, transform.position, transform.rotation), DestroyParticles.GetComponent.<ParticleSystem>().startLifetime);
		if(DestroyType == DestroyTypes.Detatch) {
			if(MeshObject)
				MeshObject.transform.parent = transform;
			gameObject.AddComponent.<Rigidbody>();
			transform.parent = null;
			Destroy(this);
		} else if(DestroyType == DestroyTypes.Shatter) {
			Destroy(MeshObject);
			Destroy(gameObject);
		}
	}
	PrvBroken = Broken;
}