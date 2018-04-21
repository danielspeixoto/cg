function init() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
    renderer.setSize(window.innerHeight, window.innerHeight);
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    var gui = new dat.GUI();
    var options = {
        previousSize: -1,
        size: 50,
        wireframe: false,
        toggleWireframe: function () {
            this.wireframe = !this.wireframe;
        },
        increaseResolution: function () {
            this.size += 10;
        }
    }
    gui.add(options, 'toggleWireframe')
    gui.add(options, 'size', 5, 50).listen();

    var delta = 0
    var material = createMaterial(options.wireframe)
    var scene = createScene(createDrop(options.size), material)
    var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, -100)
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    function loop() {
        requestAnimationFrame(loop)

        if (options.size != options.previousSize) {
            console.log("resolution changed")
            options.previousSize = options.size
            renderer.clear()
            console.log(options.size)
            scene = createScene(createDrop(Math.round(options.size)), material)
            scene.add(camera)
            scene.add(light);
        }
        material.wireframe = options.wireframe

        delta += 0.005;
        camera.position.z = Math.cos(delta) * 20;
        camera.position.x = Math.sin(delta) * 20;
        camera.lookAt(scene.position)
        renderer.render(scene, camera);
    }

    loop();
}

function createMaterial(wireframe) {
    material = new THREE.MeshLambertMaterial({
        wireframe,
        color: 0x0000ff
    })

    return material
}

function createScene(geometry, material) {
    var scene = new THREE.Scene();

    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    mesh.position.z = 0

    return scene
}

function createDrop(size) {
    let geometry = new THREE.Geometry();
    console.log(geometry.vertices.length)

    for (let i = 0; i <= size; i++) {
        for (let j = 0; j <= size; j++) {
            var a = 2 * Math.PI *  (i / size)
            var b = Math.PI * (j / size)
            let x = 0.5 * ((1 - Math.cos(b)) * Math.sin(b) * Math.cos(a))
            let y = 0.5 * ((1 - Math.cos(b)) * Math.sin(b) * Math.sin(a))
            let z = Math.cos(b)
            geometry.vertices.push(new THREE.Vector3(x*4, y*4, z*4))
        }
    }

    for (let i = 0; i + size + 1 < geometry.vertices.length; i++) {

        geometry.faces.push(new THREE.Face3(i, i + size, i + size + 1));
        geometry.faces.push(new THREE.Face3(i, i + size + 1, i + 1));
    }

    return geometry
}