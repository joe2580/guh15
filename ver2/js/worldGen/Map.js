//Namespace.
var map = {}

	map.heightmapArr = 0; //2D aray of heightmaps.
	map.heightCoeff = 6;	//Height multipler.
	//Array of vertices. Sized based on trial and error. Eep.
	map.vertexArr = 0;
	map.mesh = 0;
	//Geometry object which gets sent to mesh.
	map.geometry = new THREE.BufferGeometry();

	//Mesh mat.
	map.material = 0;
	//material = new THREE.MeshPhongMaterial( { color = 0x666600, specular = 0x666666, shininess = 2, shading = THREE.SmoothShading } );

	map.scale = 4;

	//Map Generation Function.
	map.generateMap = function() {

		this.heightmapArr = generateFractal(1024, 1, 8, seed);
		this.vertexArr = new Float32Array( this.heightmapArr.length *15000); //TODO = Calc this accurately.

		// components of the position vector for each vertex are stored
		// contiguously in the buffer.
		for(var x = 0; x < this.heightmapArr.length; x++) 
		{
			for(var y = 0; y < this.heightmapArr.length; y++)
			{
				if(x + 1 < this.heightmapArr.length && y + 1 < this.heightmapArr.length)
				{
					//position in a 1D array equal to that of the 2D array.sss
					var oneDimPos = (y + (x * this.heightmapArr.length));
					//Test output to browser console.
					//console.log("this.heightmapArr[" + x + "][" + y + "] = " + this.heightmapArr[x][y]
					    // + "1D Position = " + (y + (x * this.heightmapArr.length)));		

					var exponential = 2.6;
					//Top Triangle.
					this.vertexArr[(oneDimPos*3*6) + 0 ] = x;	//X1
					this.vertexArr[(oneDimPos*3*6) + 1 ] = y;	//Y1
					this.vertexArr[(oneDimPos*3*6) + 2 ] = Math.pow((this.heightmapArr[x][y] * this.heightCoeff), exponential);	//Z1

					this.vertexArr[(oneDimPos*3*6) + 3 ] = x + 1;	//X2
					this.vertexArr[(oneDimPos*3*6) + 4 ] = y;	//Y
					this.vertexArr[(oneDimPos*3*6) + 5 ] = Math.pow((this.heightmapArr[x+1][y] * this.heightCoeff), exponential);	//Z2

					this.vertexArr[(oneDimPos*3*6) + 6 ] = x;	//X3
					this.vertexArr[(oneDimPos*3*6) + 7 ] = y + 1;	//Y3
					this.vertexArr[(oneDimPos*3*6) + 8 ] = Math.pow((this.heightmapArr[x][y+1] * this.heightCoeff), exponential);	//Z3

					//Bottom Triangle.
					this.vertexArr[(oneDimPos*3*6) + 9 ] = x + 1;	//X2
					this.vertexArr[(oneDimPos*3*6) + 10 ] = y;	//Y2
					this.vertexArr[(oneDimPos*3*6) + 11 ] = Math.pow((this.heightmapArr[x+1][y] * this.heightCoeff), exponential);	//Z2

					this.vertexArr[(oneDimPos*3*6) + 12 ] = x + 1;	//X4
					this.vertexArr[(oneDimPos*3*6) + 13 ] = y + 1;	//Y4
					this.vertexArr[(oneDimPos*3*6) + 14 ] = Math.pow((this.heightmapArr[x+1][y+1] * this.heightCoeff), exponential);	//Z4

					this.vertexArr[(oneDimPos*3*6) + 15 ] = x;	//X1
					this.vertexArr[(oneDimPos*3*6) + 16 ] = y + 1;	//Y1
					this.vertexArr[(oneDimPos*3*6) + 17 ] = Math.pow((this.heightmapArr[x][y+1] * this.heightCoeff), exponential);	//Z1
				}
			}
		}

		// itemSize = 3 because there are 3 values (components) per vertex
		this.geometry.addAttribute( 'position', new THREE.BufferAttribute(this.vertexArr, 3));
		this.geometry.computeVertexNormals();
		this.geometry.center();

		this.material = new THREE.MeshPhongMaterial( { color : 0x999966, specular : 0x9999CC, shininess : 2, shading : THREE.SmoothShading } );

		this.mesh = new THREE.Mesh(this.geometry, this.material); //Create mesh from geometry.


		this.mesh.scale.set( this.scale, this.scale, this.scale );
		this.mesh.rotateX(-(Math.PI/4));

		this.mesh.renderDepth = 1000.0; 
	}
