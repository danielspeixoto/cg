// var THREE = require('../libs/three')
function init() {
    var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1, -1.0);
    var scene = new THREE.Scene();
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(1500, 1500);
	document.getElementById("WebGL-output").appendChild(renderer.domElement);	
	scene.add( camera );

    var geometry = new THREE.Geometry();

    // Vertices
    geometry.vertices.push(new THREE.Vector3( -1, 0.0,  0)); 
    geometry.vertices.push(new THREE.Vector3( 1,  0.0,  0.0)); 
	geometry.vertices.push(new THREE.Vector3( 0.0, 0.5,  -0.5)); 
    
    geometry.vertices.push(new THREE.Vector3( -1,  0.0,  -1)); 
    // geometry.vertices.push(new THREE.Vector3( 0.5,  0.5, 0.5));
    // geometry.vertices.push(new THREE.Vector3( 0.5,  0.5, 0.5));
     
    // geometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5));
    
    
    geometry.faces.push(new THREE.Face3(0 ,1,2))
    geometry.faces.push(new THREE.Face3(0, 3,2))
    geometry.faces.push(new THREE.Face3(0, 3,1))
    geometry.faces.push(new THREE.Face3(1, 3,2))

    var boxMaterials = 	[ 
        new THREE.MeshBasicMaterial({
            vertexColors:THREE.VertexColors,
            wireframe: true,
            color:0xFF0000
        }),
        new THREE.MeshBasicMaterial({
            vertexColors:THREE.VertexColors,
            wireframe: true,
            color:0x00FF00
        }),

    ];

    var material = new THREE.MeshFaceMaterial(boxMaterials); 
	
	var mesh = new THREE.Mesh(geometry, material); 
	
	scene.add( mesh );	
		
    renderer.clear();
    renderer.render(scene, camera);

    loop();
	
	var delta = 0

	function loop() {
		delta += 0.01;
		camera.lookAt(mesh.position)
		camera.position.x = Math.sin(delta);
		camera.position.z = Math.cos(delta);
		camera.position.y = Math.cos(delta);
		renderer.render(scene, camera);
		requestAnimationFrame(loop)
	}

}