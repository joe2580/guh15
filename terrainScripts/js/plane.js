var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var geometry = new THREE.Geometry();
geometry.vertices.push(
	new THREE.Vector3( -10,  10, 0 ),
	new THREE.Vector3( -10, -10, 0 ),
	new THREE.Vector3(  10, -10, 0 ),
	new THREE.Vector3(  10, 10, 0 )
);
geometry.faces.push( new THREE.Face3( 0, 1, 2),
					 new THREE.Face3(0, 2, 3));

geometry.computeBoundingSphere();
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);

camera.position.z = 20;
camera.position.x = 0;
camera.position.y = 0;

var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};

render();
