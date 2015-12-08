var geometry = new THREE.SphereGeometry(3000, 60, 40);  
var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('res/sky.jpg') } );
/*
Create a three.js scene
*/
var scene = new THREE.Scene();

skyBox = new THREE.Mesh(geometry, material);  
//Flip so it's internally textured.
skyBox.scale.set(-1, 1, 1);  
skyBox.eulerOrder = 'XZY';  
skyBox.renderDepth = 1000.0;  
scene.add(skyBox);  



