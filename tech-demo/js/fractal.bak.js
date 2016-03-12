var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Map is an array. generateTerrainMap is added in the html class.
var map = 0;

//POWER OF 2.
map = generateTerrainMap(16, 1, 10);


var geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
var vertexPositions = [
	[-1.0, -1.0,  1.0],
	[ 1.0, -1.0,  1.0],
	[ 1.0,  1.0,  1.0],
	[ 1.0,  1.0,  1.0],
	[-1.0,  1.0,  1.0],
	[-1.0, -1.0,  1.0]
];
var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

// components of the position vector for each vertex are stored
// contiguously in the buffer.
for ( var i = 0; i < vertexPositions.length; i++ )
{
	vertices[ i*3 + 0 ] = vertexPositions[i][0];
	vertices[ i*3 + 1 ] = vertexPositions[i][1];
	vertices[ i*3 + 2 ] = vertexPositions[i][2];
}

// itemSize = 3 because there are 3 values (components) per vertex
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var mesh = new THREE.Mesh( geometry, material );

scene.add(mesh);

camera.position.z = 20;
camera.position.x = 0;
camera.position.y = 0;

var render = function () {
	requestAnimationFrame( render );

	mesh.rotation.x += 0.01;

	renderer.render(scene, camera);
};

render();