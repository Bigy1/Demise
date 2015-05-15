#pragma strict

//Inspector variables
//Camera
var LookInverted : boolean = false;
var Debugging : boolean = false;
@Range (0.5, 15) var LookSensitivity : int = 5;
@Range (5, 15) var ZoomSensitivity : int = 6;
@Range (0, 90) var LookPitchLimitUp : int = 85;
@Range (0, 90) var LookPitchLimitDown : int = 75;
@Range (.75, 10) var ViewDistance : float = 1.5;
@Range (1, 10) var CameraSmoothing : int = 4;
var FirstPersonCameraAnchor : GameObject;
var ThirdPersonCameraAnchors : GameObject[];
var RotationOffset : Vector3;

//Private variables
//Camera
private var LookYaw : float = 100;
private var LookPitch : float = 0;
private var ThirdPerson : boolean;
private var TPPreviousFrame : boolean;
//1st Person Camera
//3rd Person Camera
private var View : Transform;
private var CurrentCAInt : int = 1;
private var ThirdPersonCameraAnchor : Transform;
private var LookVector : Vector3;
private var LookEuler : Quaternion;
private var LookHeading : Vector3;
private var ViewPosition : Vector3;
private var ViewHit : RaycastHit;
private var ViewOffset : Vector3;
//CharacterHandler
//Debug
private var ViewHitBoolean : boolean;


function Start() {
	View = transform.Find("View");
	ThirdPersonCameraAnchor = new GameObject().transform;
	ThirdPersonCameraAnchor.gameObject.name = "CameraAnchorTP";
	ThirdPersonCameraAnchor.parent = transform;
	ThirdPersonCameraAnchor.position = ThirdPersonCameraAnchors[1].transform.position;
	ThirdPerson = TPPreviousFrame = ViewDistance > .75;
	LookYaw = (transform.rotation * Vector3(0, 190, 0)).y;
}

function Update() {
	if(Input.GetKeyDown(KeyCode.L)) {
		Application.LoadLevel("Race");
	}
	if(Input.GetKeyDown(KeyCode.R)) {
		Application.LoadLevel(Application.loadedLevelName);
	}
	//Camera
	LookYaw += Input.GetAxis("Mouse X") * LookSensitivity;
	LookYaw = LookYaw % 360 + (LookYaw < 0 ? 360 : 0); 
	LookPitch += Input.GetAxis("Mouse Y") * LookSensitivity * (LookInverted ? -1 : 1);
	ViewDistance -= Input.GetAxis("Mouse ScrollWheel") * ZoomSensitivity;
	ViewDistance = Mathf.Clamp(ViewDistance, .5, 10);
	ThirdPerson = ViewDistance > .75;
	if(TPPreviousFrame != ThirdPerson) {
		LookYaw = (ThirdPerson ? (transform.rotation * Quaternion.Euler(Vector3(0, 190, 0))).eulerAngles.y : RotationOffset.y);
		LookPitch = 0;
	}
	TPPreviousFrame = ThirdPerson;
	CharacterHandler.ThirdPerson = ThirdPerson;
	//1st Person Camera
	if(!ThirdPerson) {
		LookPitch = Mathf.Clamp(LookPitch, -LookPitchLimitDown, LookPitchLimitUp);
		LookVector = Vector3(-LookPitch, LookYaw, 0);
		LookEuler = Quaternion.Euler(LookVector);
	}
	
	//3rd Person Camera
	else {
		LookPitch = Mathf.Clamp(LookPitch, -LookPitchLimitUp, LookPitchLimitDown);
		LookVector = Vector3(LookPitch, LookYaw, 0);
		LookEuler = Quaternion.Euler(LookVector);
		if(Input.GetButtonDown("Fire3")) {
			CurrentCAInt = !CurrentCAInt ? 1 : 0;
		}
		ThirdPersonCameraAnchor.position = Vector3.Slerp(ThirdPersonCameraAnchor.position, ThirdPersonCameraAnchors[CurrentCAInt].transform.position, Time.deltaTime * CameraSmoothing);
		
	}
}

function FixedUpdate() {
	//Camera
	
	//1st Person Camera
	if(!ThirdPerson) {
		if(Mathf.Abs(LookVector.y - RotationOffset.y) > 65 && !(Input.GetButton("Vertical") && Input.GetButton("Horizontal"))) {
			transform.Rotate(Vector3(0, LookYaw + (LookYaw > RotationOffset.y + 65 ? RotationOffset.y - 65 : RotationOffset.y + 65), 0));
			LookVector.y = LookYaw = Mathf.Clamp(LookVector.y, RotationOffset.y - 65, RotationOffset.y + 65);
		} else if(Mathf.Abs(LookVector.y - RotationOffset.y) > 5 && (Input.GetButton("Vertical") || Input.GetButton("Horizontal"))) {
			transform.Rotate(Vector3(0, LookYaw + (LookYaw > RotationOffset.y + 5 ? RotationOffset.y - 5 : RotationOffset.y + 5), 0));
			LookVector.y = LookYaw = Mathf.Clamp(LookVector.y, RotationOffset.y - 5, RotationOffset.y + 5);
		}
		FirstPersonCameraAnchor.transform.parent.Rotate((Quaternion.AngleAxis(RotationOffset.y, Vector3.left) * Quaternion.Euler(Vector3(-LookVector.y, 0, LookVector.x))).eulerAngles);
		View.transform.position = FirstPersonCameraAnchor.transform.position;
		View.transform.rotation = FirstPersonCameraAnchor.transform.rotation;
	}
	
	//3rd Person Camera
	else {
		if(!Input.GetButton("Vertical") || !Input.GetButton("Horizontal"))
			ViewPosition = ThirdPersonCameraAnchor.position + LookEuler * Vector3(0, 0, ViewDistance);
		else
			ViewPosition = ThirdPersonCameraAnchor.position + transform.rotation * Quaternion.AngleAxis(RotationOffset.y, Vector3.up) * Vector3(0, 0, ViewDistance);
		LookHeading = (ViewPosition - ThirdPersonCameraAnchor.position).normalized;
	    if(Physics.Raycast(ThirdPersonCameraAnchor.position, LookHeading, ViewHit, ViewDistance + 0.5, 9)) {
	    	ViewHitBoolean = true;
	    	View.position = ViewHit.point + ViewHit.normal / 2;
	    } else {
	    	ViewHitBoolean = false;
	    	View.position = ThirdPersonCameraAnchor.position + LookEuler * Vector3(0, 0, ViewDistance);
	    }
		View.LookAt(ThirdPersonCameraAnchor);
	}
	
	//CharacterHandler
	CharacterHandler.MovementDirection = (!ThirdPerson ? transform.rotation : Quaternion.AngleAxis(RotationOffset.y, Vector3.up) * Quaternion.AngleAxis(Input.GetAxis("Horizontal") * (Input.GetAxis("Vertical") >= 0 ? 45 : -45), Vector3.up) * Quaternion.Euler(0, LookVector.y, 0));
	CharacterHandler.MovementFRWDBKWD = Input.GetAxis("Vertical") * (2 + (Input.GetKey(KeyCode.LeftShift) ? 1 : 0) + (Input.GetKey(KeyCode.LeftAlt) ? -1 : 0));
	if(!ThirdPerson) {
		if(Input.GetButton("Horizontal") && !Input.GetButton("Vertical")) {
			CharacterHandler.MovementStrafe = Input.GetAxis("Horizontal") * (2 + (Input.GetKey(KeyCode.LeftShift) ? 1 : 0) + (Input.GetKey(KeyCode.LeftAlt) ? -1 : 0));
		} else {
			CharacterHandler.MovementStrafe = 0;
			CharacterHandler.MovementDirection *= Quaternion.AngleAxis(Input.GetAxis("Horizontal") * (Input.GetAxis("Vertical") >= 0 ? 45 : -45), Vector3.up);
		}
	} else {
		CharacterHandler.MovementStrafe = 0;
	}
	
	//Debug
	Debugger();
}

function Debugger() {
	if(Debugging) {
		Debug.Log("------ New Frame ------");
		Debug.ClearDeveloperConsole();
		Debug.DrawRay(ThirdPersonCameraAnchor.position, LookHeading * ViewDistance, Color.red, 0.01);
		Debug.Log((ViewHitBoolean ? "Camera is colliding" : "Camera is not collding"));
		Debug.Log("LookYaw " + LookYaw);
	}
}