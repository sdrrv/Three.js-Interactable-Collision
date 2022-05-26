let camera, renderer, scene

let planet

function createPlanet(){
    const geometry = new THREE.SphereGeometry(1,100,100,0,360,0,180);
    const material = new THREE.MeshNormalMaterial({color: 0x5bba1a});
    planet = new THREE.Mesh(geometry,material);

    scene.add(planet)

}



function animate(){
    renderer.render(scene,camera);




    requestAnimationFrame(animate);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
       "galaxy/galaxy+X.png",
        "galaxy/galaxy-X.png",
        "galaxy/galaxy+Y.png",
        "galaxy/galaxy-Y.png",
        "galaxy/galaxy+Z.png",
        "galaxy/galaxy-Z.png",
    ]);


    scene.background = texture;

}


function createMainCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;
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


    createPlanet();


    render();
    animate();
}