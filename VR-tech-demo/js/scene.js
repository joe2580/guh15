/*
Setup three.js WebGL renderer
*/
var renderer = new THREE.WebGLRenderer( { antialias: true } );

/*
Append the canvas element created by the renderer to document body element.
*/
document.body.appendChild( renderer.domElement );

/*
Create a three.js scene
*/
var scene = new THREE.Scene();

/*
Create a three.js camera
*/
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0, 100 );

/*
Apply VR headset orientation and positional to camera.
*/
var controls = new THREE.VRControls( camera );

/*
Apply VR stereo rendering to renderer
*/
var effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );


//Map is an array. generateTerrainMap is added in the html class.
var map = 0;
var heightCoeff = 10;

//POWER OF 2.
map = generateTerrainMap(1024, 1, 4);

//Geometry object which gets sent to mesh.
var geometry = new THREE.BufferGeometry();

//Array of vertices. Sized based on trial and error. Eep.
var vertices = new Float32Array( map.length * 15000); // three components per vertex
	
// components of the position vector for each vertex are stored
// contiguously in the buffer.
for(var x = 0; x < map.length; x++) 
{
	for(var y = 0; y < map.length; y++)
	{
		if(x + 1 < map.length && y + 1 < map.length)
		{
			//position in a 1D array equal to that of the 2D array.
			var oneDimPos = (y + (x * map.length));
			//Test output to browser console.
			//console.log("map[" + x + "][" + y + "] = " + map[x][y]
			    // + "1D Position: " + (y + (x * map.length)));		

			//Top Triangle.
			vertices[(oneDimPos*3*6) + 0 ] = x;	//X1
			vertices[(oneDimPos*3*6) + 1 ] = y;	//Y1
			vertices[(oneDimPos*3*6) + 2 ] = Math.pow((map[x][y] * heightCoeff), 2);	//Z1

			vertices[(oneDimPos*3*6) + 3 ] = x + 1;	//X2
			vertices[(oneDimPos*3*6) + 4 ] = y;	//Y2
			vertices[(oneDimPos*3*6) + 5 ] = Math.pow((map[x+1][y] * heightCoeff), 2);	//Z2

			vertices[(oneDimPos*3*6) + 6 ] = x;	//X3
			vertices[(oneDimPos*3*6) + 7 ] = y + 1;	//Y3
			vertices[(oneDimPos*3*6) + 8 ] = Math.pow((map[x][y+1] * heightCoeff), 2);	//Z3

			//Bottom Triangle.
			vertices[(oneDimPos*3*6) + 9 ] = x + 1;	//X2
			vertices[(oneDimPos*3*6) + 10 ] = y;	//Y2
			vertices[(oneDimPos*3*6) + 11 ] = Math.pow((map[x+1][y] * heightCoeff), 2);	//Z2

			vertices[(oneDimPos*3*6) + 12 ] = x + 1;	//X4
			vertices[(oneDimPos*3*6) + 13 ] = y + 1;	//Y4
			vertices[(oneDimPos*3*6) + 14 ] = Math.pow((map[x+1][y+1] * heightCoeff), 2);	//Z4

			vertices[(oneDimPos*3*6) + 15 ] = x;	//X1
			vertices[(oneDimPos*3*6) + 16 ] = y + 1;	//Y1
			vertices[(oneDimPos*3*6) + 17 ] = Math.pow((map[x][y+1] * heightCoeff), 2);	//Z1
		}
	}
}

// itemSize = 3 because there are 3 values (components) per vertex
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( -1, 0.75, 1 );
dirLight.position.multiplyScalar( 50);
dirLight.name = "dirlight";
// dirLight.shadowCameraVisible = true;

scene.add( dirLight );

dirLight.castShadow = true;
dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

var d = 300;

dirLight.shadowCameraLeft = -d;
dirLight.shadowCameraRight = d;
dirLight.shadowCameraTop = d;
dirLight.shadowCameraBottom = -d;

dirLight.shadowCameraFar = 3500;
dirLight.shadowBias = -0.0001;
dirLight.shadowDarkness = 0.35;



//Mesh mat.
var wireMat = new THREE.MeshBasicMaterial( { wireframe: true  } );
var material = new THREE.MeshPhongMaterial( { color: 0x999966, specular: 0x9999CC, shininess: 5, shading: THREE.FlatShading } );//material.side = THREE.DoubleSide;	//Make Double Sided.
var mesh = new THREE.Mesh(geometry, material); //Create mesh from geometry.
var wireMesh = new THREE.Mesh(geometry, wireMat); //Create mesh from geometry.
//scene.add(wireMesh);

mesh.scale.set( 0.5, 0.5, 0.5 );
scene.add(mesh);

//mesh.visible(false);

/*
var material = new THREE.ShaderMaterial( {
	uniforms: {},
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
	derivatives: true
} );
*/
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = 50;

camera.lookAt(new THREE.Vector3( 50, 100, 100 ));

	var keyboard = new THREEx.KeyboardState();

/*
Request animation frame loop function
*/
function update() {
	/*
	Apply rotation to cube mesh
	*/
	//mesh.rotation.y += 0.01;
	
	//Constantly move forawrd.
	//camera.position.y += 0.5;

	/*
	Update Keyboard Controls
	*/
	if (keyboard.pressed("W"))
	{
		var dir = new THREE.Vector3(0, 0, -1);
		dir.applyEuler(camera.rotation);
		camera.position.add(dir);
		
	}
	else if (keyboard.pressed("S"))
	{
		var dir = new THREE.Vector3(0, 0, 1);
		dir.applyEuler(camera.rotation);
		camera.position.add(dir);
	}

	if (keyboard.pressed("A"))
	{
		camera.position.y -= 1.5;
	}
	else if (keyboard.pressed("D"))
	{
			camera.position.y += 1.5;
	}
	/*
	Update VR headset position and apply to camera.
	*/
	controls.update();

	/*
	Render the scene through the VREffect.
	*/
	effect.render( scene, camera );

	requestAnimationFrame( update );
}

/*
Kick off animation loop
*/
update();


/*
Listen for double click event to enter full-screen VR mode
*/
document.body.addEventListener( 'dblclick', function() {
	effect.setFullScreen( true );
});


//HANDLE HEALTH WARNING HERE.
/*
Listen for keyboard event and zero positional sensor on appropriate keypress.
*/
function onkey(event) {
event.preventDefault();

if (event.keyCode == 90) { // z
	controls.zeroSensor();
}
};

window.addEventListener("keydown", onkey, true);


/*
Handle window resizes
*/
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	effect.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize, false );