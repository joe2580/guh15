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

var vertices = new Float32Array( map.length * 2 * 3 ); // three components per vertex
	



// components of the position vector for each vertex are stored
// contiguously in the buffer.
for(var x = 0; x < map.length; x++) {
	for(var y = 0; y < map.length; y++)
{

	int 1dPos = (y + (x * map.length));
	//Test output to browser console.
	console.log("map[" + x + "][" + y + "] = " + map[x][y]
	     + "1D Position: " + (y + (x * map.length)));



	vertices[(1dPos*3*4) + 0 ] = vertexPositions[i][0];	//X
	vertices[(1dPos*3*4) + 1 ] = vertexPositions[i][1];	//Y
	vertices[(1dPos*3*4) + 2 ] = vertexPositions[i][2];	//Z

	vertices[(1dPos*3*4) + 3 ] = vertexPositions[i][0];	//X
	vertices[(1dPos*3*4) + 4 ] = vertexPositions[i][1];	//Y
	vertices[(1dPos*3*4) + 5 ] = vertexPositions[i][2];	//Z

	vertices[(1dPos*3*4) + 6 ] = vertexPositions[i][0];	//X
	vertices[(1dPos*3*4) + 7 ] = vertexPositions[i][1];	//Y
	vertices[(1dPos*3*4) + 8 ] = vertexPositions[i][2];	//Z

	vertices[(1dPos*3*4) + 9 ] = vertexPositions[i][0];	//X
	vertices[(1dPos*3*4) + 10 ] = vertexPositions[i][1];	//Y
	vertices[(1dPos*3*4) + 11 ] = vertexPositions[i][2];	//Z
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