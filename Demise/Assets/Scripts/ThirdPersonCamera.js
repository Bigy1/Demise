#pragma strict

var LookSensitivity : float = 5;
var LookInverted : boolean = false;
public class lookLimits {
	public var PitchUp : float;
	public var PitchDown : float;
	public var Yaw : float;
	public function lookLimits(pitchUp : float, pitchDown : float, yaw : float) {
		PitchUp = pitchUp;
		PitchDown = pitchDown;
		Yaw = yaw;
	}
	public function lookLimits(pitchUp : float, pitchDown : float) {
		PitchUp = pitchUp;
		PitchDown = pitchDown;
	}
	public function lookLimits() {
		PitchUp = Mathf.Infinity;
		PitchDown = Mathf.Infinity;
		Yaw = Mathf.Infinity;
	}
}
var FirstPersonAnchor : Transform;
var FirstPersonLimits : lookLimits = new lookLimits(85f, 75f, 65f);
var ThirdPersonLimits : lookLimits = new lookLimits(85f, 75f);
var ThirdPersonAnchors : Transform[];
var SwapSmoothing : float = 5;
var ThirdPersonCameraOffset : float = 2.5;
class thirdPersonCameraOffsetLimits extends System.Object {
	@Range(0, Mathf.Infinity) var Top = 5;
	@Range(0, Mathf.Infinity) var Bottom = 1;
}
var ThirdPersonCameraOffsetLimits = thirdPersonCameraOffsetLimits();
var ZoomSensitivity : float = 3;

private var CurrentAnchor : Transform;
private var CurrentAnchorInt : int = 0;
private var FPLook : Quaternion = Quaternion.identity;
private var TPLook : Quaternion;
private var ThirdPerson : boolean = true;
private var DesiredPosition : Vector3;

function Start() {
	CurrentAnchor = new GameObject().transform;
	CurrentAnchor.name = "Current Anchor";
	CurrentAnchor.parent = FirstPersonAnchor.root;
	CurrentAnchor.position = ThirdPersonAnchors[CurrentAnchorInt].position;
}

function FixedUpdate() {
	FPLook.eulerAngles.x += Input.GetAxis("Mouse Y") * LookSensitivity * (LookInverted ? 1 : -1);
	FPLook.eulerAngles.y += Input.GetAxis("Mouse X") * LookSensitivity;
	ThirdPersonCameraOffset -= Input.GetAxis("Mouse ScrollWheel") * ZoomSensitivity;
	ThirdPersonCameraOffset = Mathf.Clamp(ThirdPersonCameraOffset, 0, ThirdPersonCameraOffsetLimits.Top);
	ThirdPerson = ThirdPersonCameraOffset > ThirdPersonCameraOffsetLimits.Bottom;
	if(ThirdPerson)
		FPLook.eulerAngles.x = Mathf.Clamp((FPLook.eulerAngles.x > 180 ? FPLook.eulerAngles.x - 360 : FPLook.eulerAngles.x), -ThirdPersonLimits.PitchUp, ThirdPersonLimits.PitchDown);
	else {
		FPLook.eulerAngles.x = Mathf.Clamp((FPLook.eulerAngles.x > 180 ? FPLook.eulerAngles.x - 360 : FPLook.eulerAngles.x), -FirstPersonLimits.PitchDown, FirstPersonLimits.PitchUp);
		FPLook.eulerAngles.y = Mathf.Clamp((FPLook.eulerAngles.y > 180 ? FPLook.eulerAngles.y - 360 : FPLook.eulerAngles.y), -FirstPersonLimits.Yaw, FirstPersonLimits.Yaw);
	}
	TPLook = FPLook;
	TPLook.eulerAngles.x += 180;
	if(ThirdPerson) {
		if(Input.GetButtonDown("Fire3")) {
			CurrentAnchorInt += 1;
			if(CurrentAnchorInt > ThirdPersonAnchors.Length - 1)
				CurrentAnchorInt = 0;
		}
		CurrentAnchor.localPosition = Vector3.Slerp(CurrentAnchor.localPosition, ThirdPersonAnchors[CurrentAnchorInt].localPosition, Time.deltaTime * SwapSmoothing);
		DesiredPosition = CurrentAnchor.position + TPLook * Vector3(0, 0, ThirdPersonCameraOffset);
		var hit : RaycastHit;
		if(Physics.Raycast(CurrentAnchor.position, (DesiredPosition - CurrentAnchor.position).normalized, hit, ThirdPersonCameraOffset + 0.125, 9))
			DesiredPosition = hit.point + hit.normal * 0.125;
		transform.position = DesiredPosition;
		transform.LookAt(CurrentAnchor);
	}
	transform.root.GetComponent.<CharacterHandler>().MovementDirection = transform.rotation;
}

function LateUpdate() {
	if(!ThirdPerson) {
		//FirstPersonAnchor.parent.Rotate(-FPLook.eulerAngles.y, FPLook.eulerAngles.z, FPLook.eulerAngles.x);
		FirstPersonAnchor.parent.rotation = Quaternion.Euler(-FPLook.eulerAngles.y, FPLook.eulerAngles.z, FPLook.eulerAngles.x);
		transform.position = FirstPersonAnchor.position;
		transform.rotation = FirstPersonAnchor.rotation;
	}
}