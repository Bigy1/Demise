#pragma strict

@script ExecuteInEditMode()
@script AddComponentMenu("Scripts/Utilities/Children Material Replacer")

var material : Material;

function Update () {
	for(var renderer : Renderer in GetComponentsInChildren.<Renderer>())
		renderer.material = material;
}