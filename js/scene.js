let camera, renderer, scene

let planet

function createPlanet(){
    let geometry = new THREE.SphereGeometry(5, 32, 32);

    planet = new THREE.Object3D();

    //const material = new THREE.MeshBasicMaterial();
    //material.map= new THREE.TextureLoader().load('planet/earth.jpg');

    let smap = new THREE.TextureLoader().load('planet/earth.jpg');
    let bmap= new THREE.TextureLoader().load('planet/normalMap.jpg');
    let specmap = new THREE.TextureLoader().load('planet/specularTexture.jpg');
    //material.bumpMap = new THREE.TextureLoader().load('planet/normalMap.jpg');
    //material.bumpScale = 0.05;

    //material.specularMap =  new THREE.TextureLoader().load('planet/specularTexture.jpg');
    //material.specular  = new THREE.Color('grey');


    let material = new THREE.MeshPhongMaterial({
        shininess  :  20,
        bumpMap    :  bmap,
        map        :  smap,
        specularMap: specmap,
        specular : new THREE.Color('grey'),
        bumpScale  :  0.5,
    });



    let planetIn = new THREE.Mesh(geometry,material);



    planet.add(planetIn);
    scene.add(planet)

}



function animate(){
    renderer.render(scene,camera);
    planet.rotation.y += 0.001;




    requestAnimationFrame(animate);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
   // scene.add(new THREE.AxesHelper(10));

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