#pragma strict

@script AddComponentMenu("Car/Engine")

var CarEngine : AudioSource;
var IdleRPM : float = 500;
var MaxRPM : float = 6000;
var KPL : float = 6.8;
var IdleConsumption : float = 0.0001;

function FixedUpdate() {
	
}