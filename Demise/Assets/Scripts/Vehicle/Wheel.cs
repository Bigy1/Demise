using UnityEngine;
using System.Collections;

[AddComponentMenu("Vehicle/Wheel")]
[RequireComponent(typeof(WheelCollider), typeof(AudioSource))]

public class Wheel : MonoBehaviour {
    [HideInInspector]
    public WheelCollider collider;
	public Transform wheelMesh;
	public bool powered = true;
	public bool brakeable = true;
	public bool rotationFix = false;

	[System.Serializable]
	public class BrakingStiffnessMultipliers  {
		public float forward = 0.75f;
		public float sideways = 0.25f;
	}

	public BrakingStiffnessMultipliers brakingStiffnessMultipliers = new BrakingStiffnessMultipliers();
	public bool steerable = true;
	[System.Serializable]
	public enum Locations { 
		front  =  1, 
		center =  0, 
		rear   = -1,
	};
	public Locations location = Locations.center;

	float forwardStiffness;
	float sidewaysStiffness;
	AudioSource audioSource;
	int turnMultiplier;
	
	void Start() {
		collider = GetComponent<WheelCollider>();
		forwardStiffness = collider.forwardFriction.stiffness;
		sidewaysStiffness = collider.sidewaysFriction.stiffness;
		audioSource = GetComponent<AudioSource>();
		turnMultiplier = (int)location;
	}

	void Update() {
		//Wheel skid sound update
		WheelHit wheelHit = new WheelHit();
		if(collider.GetGroundHit(out wheelHit))
			audioSource.volume = Mathf.Lerp(audioSource.volume, wheelHit.forwardSlip + wheelHit.sidewaysSlip, Time.deltaTime);
		else
			audioSource.volume = Mathf.Lerp(audioSource.volume, 0, Time.deltaTime);
	}

	void FixedUpdate() {
		MeshUpdate();
	}

	void MeshUpdate() {
		//Wheel real position
		Vector3 WheelColliderCenter = collider.transform.TransformPoint(collider.center);
		RaycastHit raycastHit = new RaycastHit();
		if(Physics.Raycast(WheelColliderCenter, -collider.transform.up, out raycastHit, collider.suspensionDistance + collider.radius))
			wheelMesh.position = raycastHit.point + (collider.transform.up * collider.radius);
		else
			wheelMesh.position = WheelColliderCenter - (collider.transform.up * collider.suspensionDistance);
		
        //Wheel real rotation
		wheelMesh.Rotate(collider.rpm / 60 * 360 * Time.deltaTime, 0, 0);
		Vector3 wheelMeshEuler = wheelMesh.localEulerAngles;
		wheelMeshEuler.y = collider.steerAngle - wheelMesh.localEulerAngles.z;
		wheelMesh.localEulerAngles = wheelMeshEuler;
	}

	public void WheelUpdate(float? motorTorque = null, float? brakeTorque = null, float? turnAngle = null) {
		//Wheel power and turn update
        if(motorTorque != null)
		    collider.motorTorque = (float)((powered ? motorTorque : 0) * (rotationFix ? -1 : 1));
        if(brakeTorque != null)
		    collider.brakeTorque = (float)(brakeable ? brakeTorque : 0);
        if(turnAngle != null)
		    collider.steerAngle = (float)(steerable ? turnAngle * turnMultiplier : 0);
        Debug.Log(brakeTorque == 0 || !brakeable);
		
        //Wheel slip update
        if (brakeTorque == 0 || !brakeable) {
            WheelFrictionCurve forwardFriction = collider.forwardFriction;
            WheelFrictionCurve sidewaysFriction = collider.sidewaysFriction;
            forwardFriction.stiffness = forwardStiffness * brakingStiffnessMultipliers.forward;
            sidewaysFriction.stiffness = sidewaysStiffness * brakingStiffnessMultipliers.sideways;
            collider.forwardFriction = forwardFriction;
            collider.sidewaysFriction = sidewaysFriction;
        } else {
            WheelFrictionCurve forwardFriction = collider.forwardFriction;
            WheelFrictionCurve sidewaysFriction = collider.sidewaysFriction;
            forwardFriction.stiffness = forwardStiffness;
            sidewaysFriction.stiffness = sidewaysStiffness;
        }
		
        //Wheel mesh update
		MeshUpdate();
	}
}