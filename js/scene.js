let camera, renderer, scene


function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));

}


function createMainCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.x = 30;
    camera.position.y = 30;
    camera.position.z = 30;
    camera.lookAt(scene.position);
}


function render() {
    'use strict';
    renderer.render(scene, camera);
}


function createLight(){
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add( directionalLight );
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createMainCamera();
    createLight();

    render();
}