#pragma strict

var CameraScripts : MonoBehaviour[];
var SwitchKey : KeyCode = KeyCode.F;

private var CameraScriptsInt : int = 0;

function Start() {
	CameraScripts[CameraScriptsInt].enabled = true;
}

function Update() {
	if(Input.GetKeyDown(SwitchKey)) {
		CameraScriptsInt += 1;
		if(CameraScriptsInt > CameraScripts.Length - 1)
			CameraScriptsInt = 0;
		for(var CameraScript : MonoBehaviour in CameraScripts)
			CameraScript.enabled = false;
		CameraScripts[CameraScriptsInt].enabled = true;
	}
}