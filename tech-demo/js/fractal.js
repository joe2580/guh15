var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Map is an array. generateTerrainMap is added in the html class.
var map = 0;
var heightCoeff = 25;

//POWER OF 2.
map = generateTerrainMap(512, 1, 18);

//Geometry object which gets sent to mesh.
var geometry = new THREE.BufferGeometry();

//Array of vertices.
var vertices = new Float32Array( map.length * 2 * 1000 ); // three components per vertex
	
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
			vertices[(oneDimPos*3*6) + 2 ] = map[x][y] * heightCoeff;	//Z1

			vertices[(oneDimPos*3*6) + 3 ] = x + 1;	//X2
			vertices[(oneDimPos*3*6) + 4 ] = y;	//Y2
			vertices[(oneDimPos*3*6) + 5 ] = map[x+1][y] * heightCoeff;	//Z2

			vertices[(oneDimPos*3*6) + 6 ] = x;	//X3
			vertices[(oneDimPos*3*6) + 7 ] = y + 1;	//Y3
			vertices[(oneDimPos*3*6) + 8 ] = map[x][y+1] * heightCoeff;	//Z3

			//Bottom Triangle.
			vertices[(oneDimPos*3*6) + 9 ] = x + 1;	//X2
			vertices[(oneDimPos*3*6) + 10 ] = y;	//Y2
			vertices[(oneDimPos*3*6) + 11 ] = map[x+1][y] * heightCoeff;	//Z2

			vertices[(oneDimPos*3*6) + 12 ] = x + 1;	//X4
			vertices[(oneDimPos*3*6) + 13 ] = y + 1;	//Y4
			vertices[(oneDimPos*3*6) + 14 ] = map[x+1][y+1] * heightCoeff;	//Z4

			vertices[(oneDimPos*3*6) + 15 ] = x;	//X1
			vertices[(oneDimPos*3*6) + 16 ] = y + 1;	//Y1
			vertices[(oneDimPos*3*6) + 17 ] = map[x][y+1] * heightCoeff;	//Z1
		}
	}
}

// itemSize = 3 because there are 3 values (components) per vertex
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

//Mesh mat.

var material = new THREE.MeshBasicMaterial( { wireframe: true  } );
//material.side = THREE.DoubleSide;	//Make Double Sided.
var mesh = new THREE.Mesh(geometry, material); //Create mesh from geometry.
scene.add(mesh);

/*
var material = new THREE.ShaderMaterial( {
	uniforms: {},
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
	derivatives: true
} );
*/

camera.position.z = 50;
camera.position.x = 50;
camera.position.y = 50;


var render = function () {
	requestAnimationFrame( render );
	mesh.rotation.x += 0.01;
	renderer.render(scene, camera);
};

render();