#pragma strict

var CloneName : String;
var DeleteClones : boolean = false;

@script ExecuteInEditMode() function Update() {
	if(DeleteClones) {
		for(var _gameObject : GameObject in GameObject.FindObjectsOfType(GameObject)) {
			if(_gameObject.name.StartsWith(CloneName + "(Clone)"))
				DestroyImmediate(_gameObject);
		}
		DeleteClones = false;
	}
}