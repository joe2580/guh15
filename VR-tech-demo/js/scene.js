/*
Setup three.js WebGL renderer
*/
//var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );

var renderer = new THREE.WebGLRenderer( { antialias: true } );

var playerPos = new THREE.Vector3(0, 0, 5);
var playerDir = new THREE.Vector3(0, 0, -1);

renderer.setSize( window.innerWidth, window.innerHeight );
/*
Append the canvas element created by the renderer to document body element.
*/
document.body.appendChild( renderer.domElement );


/*
Apply VR headset orientation and positional to camera.
*/


//var controls = new THREE.VRControls( camera );

/*
Apply VR stereo rendering to renderer
*/
var effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );



//Map is an array. generateTerrainMap is added in the html class.
var map = 0;
var heightCoeff = 10;

//POWER OF exponential.

map = generateTerrainMap(1024, 1, 8, seed);

//Geometry object which gets sent to mesh.
var geometry = new THREE.BufferGeometry();

//Array of vertices. Sized based on trial and error. Eep.
var vertices = new Float32Array( map.length *15000); // three components per vertex
	
// components of the position vector for each vertex are stored
// contiguously in the buffer.
for(var x = 0; x < map.length; x++) 
{
	for(var y = 0; y < map.length; y++)
	{
		if(x + 1 < map.length && y + 1 < map.length)
		{
			//position in a 1D array equal to that of the 2D array.sss
			var oneDimPos = (y + (x * map.length));
			//Test output to browser console.
			//console.log("map[" + x + "][" + y + "] = " + map[x][y]
			    // + "1D Position: " + (y + (x * map.length)));		

			var exponential = 2;
			//Top Triangle.
			vertices[(oneDimPos*3*6) + 0 ] = x;	//X1
			vertices[(oneDimPos*3*6) + 1 ] = y;	//Y1
			vertices[(oneDimPos*3*6) + 2 ] = Math.pow((map[x][y] * heightCoeff), exponential);	//Z1

			vertices[(oneDimPos*3*6) + 3 ] = x + 1;	//X2
			vertices[(oneDimPos*3*6) + 4 ] = y;	//Y
			vertices[(oneDimPos*3*6) + 5 ] = Math.pow((map[x+1][y] * heightCoeff), exponential);	//Z2

			vertices[(oneDimPos*3*6) + 6 ] = x;	//X3
			vertices[(oneDimPos*3*6) + 7 ] = y + 1;	//Y3
			vertices[(oneDimPos*3*6) + 8 ] = Math.pow((map[x][y+1] * heightCoeff), exponential);	//Z3

			//Bottom Triangle.
			vertices[(oneDimPos*3*6) + 9 ] = x + 1;	//X2
			vertices[(oneDimPos*3*6) + 10 ] = y;	//Y2
			vertices[(oneDimPos*3*6) + 11 ] = Math.pow((map[x+1][y] * heightCoeff), exponential);	//Z2

			vertices[(oneDimPos*3*6) + 12 ] = x + 1;	//X4
			vertices[(oneDimPos*3*6) + 13 ] = y + 1;	//Y4
			vertices[(oneDimPos*3*6) + 14 ] = Math.pow((map[x+1][y+1] * heightCoeff), exponential);	//Z4

			vertices[(oneDimPos*3*6) + 15 ] = x;	//X1
			vertices[(oneDimPos*3*6) + 16 ] = y + 1;	//Y1
			vertices[(oneDimPos*3*6) + 17 ] = Math.pow((map[x][y+1] * heightCoeff), exponential);	//Z1
		}
	}
}

// itemSize = 3 because there are 3 values (components) per vertex
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

geometry.center();
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( -1, 0.75, 1 );
dirLight.position.multiplyScalar(50);
dirLight.name = "dirlight";
// dirLight.shadowCameraVisible = true;

scene.add( dirLight );

dirLight.castShadow = true;
dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*exponential;

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
var material = new THREE.MeshPhongMaterial( { color: 0x999966, specular: 0x9999CC, shininess: 5, shading: THREE.SmoothShading } );//material.side = THREE.DoubleSide;	//Make Double Sided.
//material = new THREE.MeshPhongMaterial( { color: 0xFFCC66, specular: 0x999966, shininess: 10, shading: THREE.SmoothShading } );
var mesh = new THREE.Mesh(geometry, material); //Create mesh from geometry.
var wireMesh = new THREE.Mesh(geometry, wireMat); //Create mesh from geometry.
scene.add(mesh);

geometry.computeVertexNormals();

//camera.position.z = 5;

mesh.renderDepth = 1000.0;  
mesh.scale.set( 0.5, 0.5, 0.5 );
mesh.rotateX(-(Math.PI/4));


camLookAt = scene.position;

/*
var material = new THREE.ShaderMaterial( {
	uniforms: {},
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
	derivatives: true
} );
*/

	var keyboard = new THREEx.KeyboardState();

/*
Request animation frame loop function
*/
function update() {
	
	//Constantly move forawrd.
	
	//camera.lookAt(camera.position + (dir));*/
	
	checkRotation();

	//Update Keyboard Controls
	if (keyboard.pressed("W"))
	{
		playerPos.add(playerDir);
	}
	else if (keyboard.pressed("S"))
	{
		//var dir = new THREE.Vector3(0, 0, 1);
		//dir.applyEuler(camera.rotation);
		//camera.position.add(dir);
	}

	if (keyboard.pressed("A"))
	{
		//camera.position.y -= exponential;
	}
	else if (keyboard.pressed("D"))
	{
			//camera.position.y += exponential;
	}
	/*
	Update VR headset position and apply to camera.
	*/
	//controls.update();

	camera.position.copy(playerPos);
	camera.lookAt(playerPos.add(playerDir));
	
	//Render the scene through the VREffect.
	effect.render(scene, camera);
	requestAnimationFrame( update );
}


function checkRotation(){

    var x = playerDir.x,
        y = playerDir.y,
        z = playerDir.z,
        rotSpeed = 0.2;

    if (keyboard.pressed("A")){ 
        playerDir.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
        playerDir.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
    } else if (keyboard.pressed("D")){
        playerDir.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
        playerDir.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
    }
    //camera.up = new THREE.Vector3(0,1,0);
    
} 


/*
Kick off animation loop
*/
update();



//Listen for double click event to enter full-screen VR mode

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