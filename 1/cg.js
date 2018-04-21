function init() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
    renderer.setSize(window.innerHeight, window.innerHeight);
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    var gui = new dat.GUI();
    var options = {
        changed: true,
        size: 5,
        wireframe: false,
        faceGenerator: getUniform,
        toggleWireframe: function () {
            this.wireframe = !this.wireframe;
        },
        increaseResolution: function () {
            this.size += 10;
            changed = true
        },
        uniformColouring: function() {
            this.faceGenerator = getUniform
            changed = true
        },
        xyzColouring: function() {
            this.faceGenerator = getXYZ
            changed = true
        },
        angleColouring: function() {
            this.faceGenerator = getAngle
            changed = true
        }
    }
    gui.add(options, 'toggleWireframe')
    gui.add(options, 'xyzColouring')
    gui.add(options, 'angleColouring')
    gui.add(options, 'uniformColouring')
    gui.add(options, 'size', 5, 50).listen();

    var delta = 0
    var material = createMaterial(options.wireframe)
    var scene;
    var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, -100)
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    function loop() {
        requestAnimationFrame(loop)

        if (options.changed) {
            console.log("changed")
            options.previousSize = options.size
            renderer.clear()
            console.log(options.size)
            scene = createScene(createDrop(Math.round(options.size), options.faceGenerator), material)
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
    material = new THREE.MeshBasicMaterial({
        wireframe,
        vertexColors: THREE.VertexColors
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

function createDrop(size, faceGenerator) {
    let geometry = new THREE.Geometry();
    var xVar = -1
    var yVar = -1
    var zVar = -1
    var angles = []
    for (let i = 0; i <= size; i++) {
        for (let j = 0; j <= size; j++) {
            var a = 2 * Math.PI *  (i / size)
            var b = Math.PI * (j / size)
            let x = 0.5 * ((1 - Math.cos(b)) * Math.sin(b) * Math.cos(a)) * 4 
            if( x > xVar) {
                xVar = x;
            }
            let y = 0.5 * ((1 - Math.cos(b)) * Math.sin(b) * Math.sin(a)) * 4 
            if(y > yVar) {
                yVar = y
            }
            let z = Math.cos(b) * 4 
            if(z > zVar) {
                zVar = z
            }
            geometry.vertices.push(new THREE.Vector3(x, y, z))

            angles.push({
                a,
                b
            })
        }
    }
    var createFace = faceGenerator(geometry, angles,  xVar, yVar, zVar)
    for (let i = 0; i + size + 1 < geometry.vertices.length; i++) {
        geometry.faces.push(createFace(i, i + size, i + size + 1))
        geometry.faces.push(createFace(i, i + size + 1, i + 1))
    }

    return geometry
}

function getUniform(geometry, angles, xVar, yVar, zVar) {
    return UniformFaceGenerator(new THREE.Color(0,0,1))
}
function getXYZ(geometry, angles, xVar, yVar, zVar) {
    return CoordinatesFaceGenerator(geometry, xVar, yVar, zVar)
}
function getAngle(geometry, angles, xVar, yVar, zVar) {
    return AngleFaceGenerator(geometry, angles)
}

function UniformFaceGenerator(color) {
    return function createFace(a, b, c) {
        var face = new THREE.Face3(a, b, c)
        face.vertexColors[0] = color
        face.vertexColors[1] = color
        face.vertexColors[2] = color
        return face
    }
}

function AngleFaceGenerator(geometry, arr) {
    return FaceGenerator(geometry,
        colorRange(2 * Math.PI, Math.PI, 1),
        fromAngle(arr),
        )
}

function CoordinatesFaceGenerator(geometry, xVar, yVar, zVar) {
    return FaceGenerator(geometry, colorRangeAllowingNegativeValues(xVar, yVar, zVar), fromXYZ(geometry))
}

function FaceGenerator(geometry, ink, valueGetter) {
    return function createFace(a, b, c) {
        var face = new THREE.Face3(a, b, c)
        face.vertexColors[0] = paintVertice(a, ink, valueGetter)
        face.vertexColors[1] = paintVertice(b, ink, valueGetter)
        face.vertexColors[2] = paintVertice(c, ink, valueGetter)
        return face
    }
}

function paintVertice(vertice, ink, values) {
    vals = values(vertice)
    return ink(vals.x, vals.y, vals.z)
}

function colorRangeAllowingNegativeValues( xAmp, yAmp, zAmp) {
    
    return function (x, y, z) {
        var color = new THREE.Color(
            (x + xAmp)/(xAmp * 2),
            (y + yAmp)/(yAmp * 2),
            (z + zAmp)/(zAmp * 2)
        )
        return color
    }
}

function colorRange( xAmp, yAmp, zAmp) {
    
    return function (x, y, z) {
        var color = new THREE.Color(
            x/xAmp,
            y/yAmp,
            z/zAmp
        )
        return color
    }
}

function fromXYZ(geometry) {
    return function (vertice) {
        vertice = geometry.vertices[vertice]
        return {
            x: vertice.x,
            y: vertice.y,
            z: vertice.z
        }
    }
}

function fromAngle(arr) {
    return function (vertice) {
        vertice = arr[vertice]
        return {
            x: vertice.a,
            y: vertice.b,
            z: 0
        }
    }
}