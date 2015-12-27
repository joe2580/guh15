var geometry = new THREE.SphereGeometry(9000, 60, 40);  

//geometry = new THREE.BoxGeometry(10000, 10000, 10000);

// urls of the images, one per half axis
var urls = [
  'res/sky/blueSnow/pos-x.png',
  'res/sky/blueSnow/neg-x.png',
  'res/sky/blueSnow/pos-y.png',
  'res/sky/blueSnow/neg-y.png',
  'res/sky/blueSnow/pos-z.png',
  'res/sky/blueSnow/neg-z.png'
];

// wrap it up into the object that we need
cubemap = THREE.ImageUtils.loadTextureCube(urls);

// set the format, likely RGB unless you've gone crazy
cubemap.format = THREE.RGBFormat;

cubemap.minFilter = THREE.LinearFilter;
cubemap.anisotropy = 8;

var material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('res/sky.jpg'), fog: false} );


//material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('res/greenSky.jpg') } );

//material = new THREE.MeshBasicMaterial( {color: 0xffffff, envMap: cubemap} );

/*Create a three.js scene
*/
var scene = new THREE.Scene();

skyBox = new THREE.Mesh(geometry, material);  
//Flip so it's internally textured.
skyBox.scale.set(-1, 1, 1);  
skyBox.eulerOrder = 'XZY';  
skyBox.renderDepth = 1000.0;  
scene.add(skyBox);  



