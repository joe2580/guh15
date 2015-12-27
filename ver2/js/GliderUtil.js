//Namespace.
var gliderUtil = {}

//Player shape/mesh.
gliderUtil.geometry = new THREE.SphereGeometry(30, 32, 32);  
gliderUtil.material = new THREE.MeshPhongMaterial( { color: 0xFF0000, specular: 0xFF0000, shininess: 5, shading: THREE.FlatShading } );
gliderUtil.gliderObject = new THREE.Mesh(geometry, material);  

gliderUtil.addGliders = function(playerArray) {
	for (i = 1; i < Math.floor(playerArray.length/7); i++)
	{
		var startIndex = i * 7;
		gliderObject.position.set(playerArray[startIndex], playerArray[startIndex + 1], playerArray[startIndex + 2]);
		//gliderObject.quaternion.set(startIndex + 3, startIndex + 4, startIndex + 5, startIndex + 6);

		//Add this player to be rendered.
		scene.add(gliderObject);
	}
	//players = []; //Clear array.
}