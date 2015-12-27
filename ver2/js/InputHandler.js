//Namespace.
var inputHandler = {

	//Listen for keyboard event.
	onKeyDown : function(event) {
		event.preventDefault();

		var x = playerDir.x,
        y = playerDir.y,
        z = playerDir.z,
        rotSpeed = 0.2;

		if (event.keyCode == 87 || event.keyCode == 38)	//W or Up Arrow.
		{
        	playerDir.y = y * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
        	// playerDir.z = y * Math.sin(rotSpeed) + z * Math.cos(rotSpeed);
		}
		else if (event.keyCode == 83 || event.keyCode == 40) //S or Down Arrow.
		{
        	playerDir.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
        	// playerDir.z = y * Math.sin(rotSpeed) - z * Math.cos(rotSpeed);
		}

		if (event.keyCode == 65 || event.keyCode == 37)	//A or Left Arrow
		{
			playerDir.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
        	playerDir.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
		}
		else if (event.keyCode == 68|| event.keyCode == 39)	//D or Right Arrow.
		{
			playerDir.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
        	playerDir.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
		}

		if (event.keyCode == 16) { // Shift
			camera.position.copy(playerPos); //Update camera, move player.
			var speedBoost = new THREE.Vector3(playerDir.x * 10, playerDir.y * 10, playerDir.z * 10);
			camera.lookAt(playerPos.add(speedBoost));	
		}

		if (event.keyCode == 90) { // Z
			controls.zeroSensor();	//Zero positional sensor.
		}
	}
};