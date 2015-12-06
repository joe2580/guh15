// instantiate a loader
var loader = new THREE.ColladaLoader();
var gliderObject;

loader.load(
	// resource URL
	'lib/model/glider.DAE',
	// Function when resource is loaded
	function ( collada ) {
		scene.add( collada.scene );
	},
	// Function called when download progresses
	function ( xhr ) {
		gliderObject = xhr;
	}
);
function addGliders(playerArray) {
	for (i = 0; i < playerArray.length; i++)
	{
		var startIndex = i * 7;
		gliderObject.position.set(startIndex, startIndex + 1, startIndex + 2);
		//gliderObject.quaternion.set(startIndex + 3, startIndex + 4, startIndex + 5, startIndex + 6);

		//Add this player to be rendered.
		scene.add(gliderObject);
	}

}