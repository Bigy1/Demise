using UnityEngine;
using System.Collections;

[AddComponentMenu("Vehicle/Axels")]

public class Axels : MonoBehaviour {

	public float AntiRoll = 5000f;
	[System.Serializable]
	public class Axel {
		public Wheel wheel1;
		public Wheel wheel2;
		public float maxAngle = 45f;
	}
	public Axel[] axels;
    public Transform steeringWheel;
    public float steerRotation = 180f;

	Rigidbody rigidbody;

	void Start() {
		rigidbody = GetComponent<Rigidbody>();
	}
	
	void FixedUpdate() {
		foreach (Axel axel in axels) {
            axel.wheel1.WheelUpdate(turnAngle: Input.GetAxis("Horizontal") * axel.maxAngle);
            axel.wheel2.WheelUpdate(turnAngle: Input.GetAxis("Horizontal") * axel.maxAngle);
            if (steeringWheel){
                Vector3 eulerAngles = steeringWheel.localEulerAngles;
                eulerAngles.z = Input.GetAxis("Horizontal") * steerRotation;
                steeringWheel.localEulerAngles = eulerAngles;
            }
            float travel1 = 1f;
			float travel2 = 1f;

            WheelHit wheelHit;

			bool grounded1 = axel.wheel1.collider.GetGroundHit(out wheelHit);
			if(grounded1)
				travel1 = (-axel.wheel1.transform.InverseTransformPoint(wheelHit.point).y - axel.wheel1.collider.radius) / axel.wheel1.collider.suspensionDistance;
			
            bool grounded2 = axel.wheel2.collider.GetGroundHit(out wheelHit);
			if(grounded2)
				travel2 = (-axel.wheel2.transform.InverseTransformPoint(wheelHit.point).y - axel.wheel2.collider.radius) / axel.wheel2.collider.suspensionDistance;	
			
            float antiRollForce = (travel1 - travel2) * AntiRoll;
			
			if(grounded1)
				rigidbody.AddForceAtPosition (axel.wheel1.transform.up * -antiRollForce, axel.wheel1.transform.position); 
			if(grounded2)
				rigidbody.AddForceAtPosition (axel.wheel2.transform.up * antiRollForce, axel.wheel2.transform.position); 
		}
	}
}