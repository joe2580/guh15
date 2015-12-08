/*
Setup three.js WebGL renderer
*/
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


//Geometry object which gets sent to mesh.
var geometry = new THREE.BufferGeometry();

//Array of vertices. Sized based on trial and error. Eep.
var vertices = new Float32Array( map.length * 15000); // three components per vertex
	
// components of the position vector for each vertex are stored
//Mesh mat.
var wireMat = new THREE.MeshBasicMaterial( { wireframe: true  } );
var material = new THREE.MeshPhongMaterial( { color: 0x999966, specular: 0x9999CC, shininess: 5, shading: THREE.FlatShading } );//material.side = THREE.DoubleSide;	//Make Double Sided.
var mesh = new THREE.Mesh(geometry, material); //Create mesh from geometry.
var wireMesh = new THREE.Mesh(geometry, wireMat); //Create mesh from geometry.

var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
var material = new THREE.MeshBasicMaterial( { color: 0xFFD700 } );
var hoopObject = new THREE.Mesh( geometry, material );



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
dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

var d = 300;

dirLight.shadowCameraLeft = -d;
dirLight.shadowCameraRight = d;
dirLight.shadowCameraTop = d;
dirLight.shadowCameraBottom = -d;

dirLight.shadowCameraFar = 3500;
dirLight.shadowBias = -0.0001;
dirLight.shadowDarkness = 0.35;



//scene.add(wireMesh);
mesh.renderDepth = 1000.0;  
mesh.scale.set( 0.5, 0.5, 0.5 );
mesh.rotateX(-(Math.PI/4));
geometry.computeFaceNormals();
scene.add(mesh);

players.push(0);
players.push(0);
players.push(0);

addGliders(players);

var renderer = new THREE.WebGLRenderer( { antialias: true } );
var caster = new THREE.Raycaster();

document.body.appendChild( renderer.domElement );

var keyboard = new THREEx.KeyboardState();

function setSeed(seed) {


/*
Append the canvas element created by the renderer to document body element.
*/



//POWER OF 2.
	map = generateTerrainMap(1024, 1, 8, seed);
	update();


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


//mesh.visible(false);

/*
var material = new THREE.ShaderMaterial( {
	uniforms: {},
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
	derivatives: true
} );
*/



document.body.addEventListener( 'dblclick', function() {
	effect.setFullScreen( true );
});



window.addEventListener("keydown", onkey, true);

setInterval(function(){ sendpos(camera.position.x, camera.position.y, camera.position.z, camera.rotation.x, camera.rotation.y, 1); }, 300);

window.addEventListener( 'resize', onWindowResize, false );
}
/*
Request animation frame loop function
*/
function update() {
	

	/*
	Apply rotation to cube mesh
	*/
	//mesh.rotation.y += 0.01;

	updateWrld();
	

	var x = Math.floor(camera.position.x);
	var y = Math.floor(camera.position.y);

				//Constantly move forawrd.
	var dir = new THREE.Vector3(0, 0, -1);
	dir.applyEuler(camera.rotation);
	dir.multiplyScalar(0.8);

	caster.set(camera.position, dir.normalize());
	collisions = this.caster.intersectObjects(mesh);

	if (collisions > 0)
	{
	 if (collisions[0].distance <= 350)
		{

		}
	}
	else
	{
		camera.position.add(dir);
	}


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



	if (players.length > 1)
	{
		addGliders(players);
	}
	scene.add(gliderObject);
	/*
	Render the scene through the VREff	
	*/
	effect.render( scene, camera );

	requestAnimationFrame( update );
}

/*
Kick off animation loop
*/

function updateWrld() {
	scene.remove(gliderObject);
	scene.remove(hoopObject);

    for (var i=0; i<=100; i++) {
    	if (players[i] != null) {
    		gliderObject.position.x = players[i].xpos;
    		gliderObject.position.y = players[i].ypos;
    		gliderObject.position.z = players[i].zpos;
    		gliderObject.rotation.x = players[i].xrot;
    		gliderObject.rotation.y = players[i].yrot;
    		gliderObject.rotation.z = players[i].zrot;
    		gliderObject.rotation.w = players[i].wrot;
    		scene.add(gliderObject)
    	}
    	if (hoops[i] != null) {
    		hoopObject.position.x = hoops[i].xpos;
    		hoopObject.position.y = hoops[i].ypos;
    		hoopObject.position.z = hoops[i].zpos;
    		hoopObject.rotation.x = hoops[i].xrot;
    		hoopObject.rotation.y = hoops[i].yrot;
    		hoopObject.rotation.z = hoops[i].zrot;
    		hoopObject.rotation.w = hoops[i].wrot;
    		scene.add(hoopObject)
    	}
    }
}


/*
Listen for double click event to enter full-screen VR mode
*/

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



/*
Handle window resizes
*/
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	effect.setSize( window.innerWidth, window.innerHeight );
}

