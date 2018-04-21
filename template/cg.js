function init() {
    var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1, -1.0);
    var scene = new THREE.Scene();
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(800, 800);
	document.getElementById("WebGL-output").appendChild(renderer.domElement);	
    scene.add( camera );
}