//Setup three.js WebGL renderer

//var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000000 );

var renderer = new THREE.WebGLRenderer( { antialias: true } );

var playerPos = new THREE.Vector3(0, 0, -100);
var playerDir = new THREE.Vector3(0, 0, -1);

renderer.setSize( window.innerWidth, window.innerHeight );

//Append the canvas element created by the renderer to document body element.
document.body.appendChild( renderer.domElement );

//Apply VR headset orientation and positional to camera.
var updateCamera = new UpdateCamera( camera ); 

//Apply VR stereo rendering to renderer
var renderCamera = new RenderCamera( renderer );
renderCamera.setSize( window.innerWidth, window.innerHeight );

map.generateMap();
scene.add(map.mesh);

//Lights
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
dirLight.castShadow = true;
dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*map.exponential;

var d = 300;
dirLight.shadowCameraLeft = -d;
dirLight.shadowCameraRight = d;
dirLight.shadowCameraTop = d;
dirLight.shadowCameraBottom = -d;
dirLight.shadowCameraFar = 3500;
dirLight.shadowBias = -0.0001;
dirLight.shadowDarkness = 0.35;

scene.add( dirLight );


//Fog
scene.fog = new THREE.FogExp2(0xCCCCFF,0.0004);
//scene.fog.color.setHSL( 0.51, 0.6, 0.6 );

camLookAt = scene.position;

var keyboard = new THREEx.KeyboardState();
window.addEventListener("keydown", inputHandler.onKeyDown, true);


//Request animation frame loop function
function update() {
	//Update VR headset position and apply to camera.
	//updateCamera.update();

	camera.position.copy(playerPos);
	//Update camera and move player.
	camera.lookAt(playerPos.add(playerDir));
	
	//Render the scene through the VREffect.
	renderCamera.render(scene, camera);
	requestAnimationFrame( update );
}

/*
Kick off animation loop
*/
update();


//Listen for double click event to enter full-screen VR mode
document.body.addEventListener( 'dblclick', function() {
renderCamera.setFullScreen( true );
});


window.addEventListener( 'resize', updateCamera.onWindowResize, false );