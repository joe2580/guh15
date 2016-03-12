//Namespace?
var map = {}
	
	map.vertexArr = 0;
	map.indexArr = 0;
	map.heightmapArr = 0;
	map.colourArr = 0;
	map.size = 129;	//Power of 2 + 1; (fractal generates a 2d array  bigger than the size it is given)
	map.material= 0;
	map.mesh = 0;
	map.wireframe = 0;
	map.geometry = new THREE.BufferGeometry();


map.generateMap = function() {
	this.heightmapArr = generateFractal(this.size - 1, 1, 2, 123); //123 = seed.

	//One cell for each coord of each vertex, i.e x1, y1, z1, x2, y2, z2, x3....
	this.vertexArr = new Float32Array( this.heightmapArr.length * this.heightmapArr.length * 3);
	this.colourArr = new Float32Array( this.heightmapArr.length * this.heightmapArr.length * 3); // three components per vertex.

	// components of the position vector for each vertex are stored
	// contiguously in the buffer.
	for (var x = 0; x < this.size; x++)
	{
		for (var y = 0; y < this.size; y++)
		{
			//Convert to 1D array, offset to allow diferent cells for each coord of a vertex.
			var position = ((x * this.size) + y) * 3;

			this.vertexArr[position] = x;
			this.vertexArr[position + 1] = y;
			this.vertexArr[position + 2] = this.heightmapArr[x][y] * 20;

			this.colourArr[(position)] = this.heightmapArr[x][y];
			this.colourArr[(position) + 1] = this.heightmapArr[x][y];
			this.colourArr[(position) + 2] = this.heightmapArr[x][y];
		}
	}

	this.indexArr = new Float32Array( this.vertexArr.length * 2 ); // three components per vertex, two triangles.

	//Size -1 to avoid going over the edge of the grid.
	for (var x = 0; x < this.size - 70; x++)
	{
		for (var y = 0; y < this.size - 70; y++)
		{
			var position = ((x * this.size) + y);

		// Top Triangle
			this.indexArr[ (position * 6) + 0 ] = position;
			this.indexArr[ (position*6) + 1 ] = (position + 1);
			this.indexArr[ (position*6) + 2 ] = (position ) + ((this.size));

			//Bottom Triangle
			this.indexArr[ (position * 6) + 3 ] = position + 1;
			this.indexArr[ (position*6) + 4 ] = (position + 1) + ((this.size));
			this.indexArr[ (position*6) + 5 ] = (position ) + ((this.size));
		}	
	}



	//Apply Index to Geometry.
	this.geometry.setIndex( new THREE.BufferAttribute(this.indexArr, 1 ) );

	//Apply vertex array to Geometery.
	this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.vertexArr, 3 ) );

	this.geometry.addAttribute( 'color', new THREE.BufferAttribute( this.colourArr, 3 ) );

		//this.geometry = new THREE.BoxGeometry( 10, 10, 10);
	//this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

	
	//Apply a basic material.
	this.material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors} );
	
	//this.material = new THREE.MeshPhongMaterial( { color : 0x999966, specular : 0x9999CC, shininess : 2, emissive : 0xffffff} );


/*
				this.geometry.computeBoundingSphere();

				this.material = new THREE.MeshPhongMaterial( {
					color: 0xaaaaaa,
					side: THREE.DoubleSide, vertexColors: THREE.VertexColors,
					emissive: 0xffffff
				} );
 */
				//this.material = new THREE.MeshBasicMaterial( { wireframe: true  } );

	//this.material = new THREE.MeshPhongMaterial( { color: 0x00ff00, vertexColors: THREE.VertexColors} );


	//Create mesh from Geometry.
	this.mesh = new THREE.Mesh( this.geometry, this.material );

	this.wireframe = new THREE.Mesh( this.geometry, new THREE.MeshBasicMaterial( { wireframe: true  } ));
}