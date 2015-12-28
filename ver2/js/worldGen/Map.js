//Namespace.
var map = {}

	map.heightmapArr = 0; //2D aray of heightmaps.
	map.heightCoeff = 6;	//Height multipler.
	//Array of vertices. Sized based on trial and error. Eep.
	map.vertexArr = 0;
	map.indexArr = 0;
	map.mesh = 0;
	//Geometry object which gets sent to mesh.
	map.geometry = new THREE.BufferGeometry();

	//Mesh mat.
	map.material = 0;
	//material = new THREE.MeshPhongMaterial( { color = 0x666600, specular = 0x666666, shininess = 2, shading = THREE.SmoothShading } );

	map.scale = 4;
	map.size = 4096;
	map.exponential = 2.0;

	//Map Generation Function.
	map.generateMap = function() {

		this.heightmapArr = generateFractal(this.size, 1, 2, seed);
		this.vertexArr = new Float32Array((this.size + 1) * (this.size + 1) * 3); 
		this.indexArr = new Uint16Array(this.size * this.size * 6); 

		var indexCounter = 0;

		// components of the position vector for each vertex are stored
		// contiguously in the buffer.
		for(var x = 0; x < this.heightmapArr.length; x++) 
		{
			for(var y = 0; y < this.heightmapArr.length; y++)
			{
					//position in a 1D array equal to that of the 2D array.sss
					var oneDimPos = (y + (x * (this.heightmapArr.length)));

					this.vertexArr[(oneDimPos*3) + 0 ] = x;	//X1
					this.vertexArr[(oneDimPos*3) + 1 ] = y;	//Y1
					this.vertexArr[(oneDimPos*3) + 2 ] = Math.pow((this.heightmapArr[x][y] * this.heightCoeff), this.exponential);	//Z1


				if(x  < this.heightmapArr.length-3 && y  < this.heightmapArr.length - 3)
				{

					//Test output to browser console
					//console.log("this.heightmapArr[" + x + "][" + y + "] = " + this.heightmapArr[x][y]
					    // + "1D Position = " + (y + (x * this.heightmapArr.length)));		


					//Top Triangle.
					this.indexArr[indexCounter++] = (oneDimPos); //X1

					this.indexArr[indexCounter++] = (oneDimPos+1);	//X2

					this.indexArr[indexCounter++] = (oneDimPos+1+this.size); //X3


					//Bottom Triangle.
					this.indexArr[indexCounter++] = (oneDimPos+1);	//X2

					this.indexArr[indexCounter++] = (oneDimPos+1+this.size+1); //X4

					this.indexArr[indexCounter++] = (oneDimPos+1+this.size); //X3

				}
			}
		}

		// itemSize = 3 because there are 3 values (components) per vertex
		this.geometry.addAttribute( 'position', new THREE.BufferAttribute(this.vertexArr, 3));
		//var indices = new Uint16Array(this.indicesArr, 0, 24);
		this.geometry.setIndex( new THREE.BufferAttribute( this.indexArr, 1 ) );		
		//this.geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

		//this.geometry.computeVertexNormals();
		this.geometry.center();

		this.material = new THREE.MeshPhongMaterial( { color : 0x999966, specular : 0x9999CC, shininess : 2, shading : THREE.FlatShading } );

		this.mesh = new THREE.Mesh(this.geometry, this.material); //Create mesh from geometry.


		this.mesh.scale.set( this.scale, this.scale, this.scale );
		this.mesh.rotateX(-(Math.PI/4));

		this.mesh.renderDepth = 1000.0; 
	}
