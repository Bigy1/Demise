#pragma strict

var LookSensitivity : float = 5;
var LookInverted : boolean = false;
class firstPersonLimits extends System.Object {
	var FPPitchUp : float = 85;
	var FPPitchDown : float = 75;
	var FPYaw : float = 65;
}
var FirstPersonAnchor : Transform;
var FirstPersonLimits = firstPersonLimits();
class thirdPersonLimits extends System.Object {
	var TPPitchUp : float = 75;
	var TPPitchDown : float = 65;
}
var ThirdPersonLimits = thirdPersonLimits();
var ThirdPersonAnchors : Transform[];
var ThirdPersonCameraOffset : float = 2.5;
class thirdPersonCameraOffsetLimits extends System.Object {
	@Range(0, Mathf.Infinity) var Top = 5;
	@Range(0, Mathf.Infinity) var Bottom = 1;
}
var ThirdPersonCameraOffsetLimits = thirdPersonCameraOffsetLimits();
var ZoomSensitivity : float = 3;

private var CurrentAnchor : Transform;
private var FPLook : Quaternion = Quaternion.identity;
private var TPLook : Quaternion;
private var ThirdPerson : boolean = true;
private var DesiredPosition : Vector3;

function Start() {
	CurrentAnchor = ThirdPersonAnchors[0];
}

function FixedUpdate() {
	FPLook.eulerAngles.x += Input.GetAxis("Mouse Y") * LookSensitivity * (LookInverted ? 1 : -1);
	FPLook.eulerAngles.y += Input.GetAxis("Mouse X") * LookSensitivity;
	ThirdPersonCameraOffset -= Input.GetAxis("Mouse ScrollWheel") * ZoomSensitivity;
	Debug.Log(ThirdPersonCameraOffset);
	ThirdPersonCameraOffset = Mathf.Clamp(ThirdPersonCameraOffset, 0, ThirdPersonCameraOffsetLimits.Top);
	ThirdPerson = ThirdPersonCameraOffset > ThirdPersonCameraOffsetLimits.Bottom;
	if(ThirdPerson)
		FPLook.eulerAngles.x = Mathf.Clamp((FPLook.eulerAngles.x > 180 ? FPLook.eulerAngles.x - 360 : FPLook.eulerAngles.x), -ThirdPersonLimits.TPPitchUp, ThirdPersonLimits.TPPitchDown);
	else {
		FPLook.eulerAngles.x = Mathf.Clamp((FPLook.eulerAngles.x > 180 ? FPLook.eulerAngles.x - 360 : FPLook.eulerAngles.x), -FirstPersonLimits.TPPitchDown, FirstPersonLimits.TPPitchUp);
		FPLook.eulerAngles.y = Mathf.Clamp((FPLook.eulerAngles.y > 180 ? FPLook.eulerAngles.y - 360 : FPLook.eulerAngles.y), -FirstPersonLimits.TPYaw, FirstPersonLimits.TPYaw);
	}
	TPLook = FPLook;
	Debug.Log(FPLook.eulerAngles);
	TPLook.eulerAngles.x += 180;
	TPLook.eulerAngles.y += 180;
	if(ThirdPerson) {
		DesiredPosition = CurrentAnchor.position + TPLook * Vector3(0, 0, ThirdPersonCameraOffset);
		var hit : RaycastHit;
		if(Physics.Raycast(CurrentAnchor.position, (DesiredPosition - CurrentAnchor.position).normalized, hit, ThirdPersonCameraOffset + 0.5, 9))
			DesiredPosition = hit.point + hit.normal / 2;
		transform.position = DesiredPosition;
		transform.LookAt(CurrentAnchor);
	} else {
		transform.position = FirstPersonAnchor.position;
		transform.localRotation = FPLook;
	}
}