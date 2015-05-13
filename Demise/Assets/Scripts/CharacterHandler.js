#pragma strict
@script RequireComponent(CharacterController, AudioSource);

//Inspector variables
//Movement
var MovementSpeed : int = 5;
@Range (1, 10)  var TurnSmoothing : int = 5;
@Range (5, 15) var MovementSmoothing : int = 10;
var ForwardSpeed : float;

//Private variables
//Movement
private var Controller : CharacterController;
private var AudioSRC : AudioSource;
private var Anim : Animator;
private var IdleTimer : float = 0;
private var Idle : float = 0;

//Modified variables
//Movement
static var ThirdPerson : boolean;
static var Movement : Vector3;
static var MovementDirection : Quaternion;
static var MovementStrafe : float;
static var MovementFRWDBKWD : float;

function Start() {
	Controller = GetComponent(CharacterController);
	AudioSRC = GetComponent(AudioSource);
	Anim = GetComponent(Animator);
}

function Update() {
	if(MovementStrafe != 0 || MovementFRWDBKWD != 0) {
		transform.rotation = Quaternion.Slerp(transform.rotation, MovementDirection, Time.deltaTime * TurnSmoothing);
		Anim.SetFloat("FRWDBKWD", Mathf.Lerp(Anim.GetFloat("FRWDBKWD"), MovementFRWDBKWD, Time.deltaTime * MovementSmoothing));
		Anim.SetFloat("Strafe", Mathf.Lerp(Anim.GetFloat("Strafe"), MovementStrafe, Time.deltaTime * MovementSmoothing));
		IdleTimer = 0;
		Idle -= (IdleTimer < 10 ? Time.deltaTime * 0.5 : 0);
	} else {
		Anim.SetFloat("FRWDBKWD", Mathf.Lerp(Anim.GetFloat("FRWDBKWD"), 0, Time.deltaTime * MovementSmoothing));
		Anim.SetFloat("Strafe", Mathf.Lerp(Anim.GetFloat("Strafe"), 0, Time.deltaTime * MovementSmoothing));
		IdleTimer += Time.deltaTime;
		Idle += (IdleTimer > 10 ? Time.deltaTime * 0.5 : 0);
	}
	Anim.SetFloat("Idle", Idle);
	ForwardSpeed = Anim.GetFloat("FRWDBKWD");
	Controller.SimpleMove(Vector3.zero);
}