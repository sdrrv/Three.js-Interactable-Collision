let camera, renderer, scene

let planet, clouds


function createClouds(){
    let canvasResult, contextResult, imageMap, geometry, material, mesh;

    // create destination canvas
    canvasResult = document.createElement('canvas')
    canvasResult.width = 1024
    canvasResult.height = 512
    contextResult = canvasResult.getContext('2d')

    // load earthcloudmap
    imageMap = new Image();
    imageMap.addEventListener("load", function() {
        let canvasMap, contextMap, dataMap, imageTrans;
        // create dataMap ImageData for earthcloudmap
        canvasMap = document.createElement('canvas')
        canvasMap.width = imageMap.width
        canvasMap.height = imageMap.height
        contextMap = canvasMap.getContext('2d')
        contextMap.drawImage(imageMap, 0, 0)
        dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

        // load earthcloudmaptrans
        imageTrans = new Image();
        imageTrans.addEventListener("load", function() {
            // create dataTrans ImageData for earthcloudmaptrans
            let canvasTrans, contextTrans, dataTrans, dataResult;
            canvasTrans = document.createElement('canvas')
            canvasTrans.width = imageTrans.width
            canvasTrans.height = imageTrans.height
            contextTrans = canvasTrans.getContext('2d')
            contextTrans.drawImage(imageTrans, 0, 0)
            dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
            // merge dataMap + dataTrans into dataResult
            dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height)
            for (let y = 0, offset = 0, height = imageMap.height; y < height; y++) {
                for (let x = 0, width = imageMap.width; x < width; x++, offset += 4) {
                    dataResult.data[offset] = dataMap.data[offset]
                    dataResult.data[offset + 1] = dataMap.data[offset + 1]
                    dataResult.data[offset + 2] = dataMap.data[offset + 2]
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset]
                }
            }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0)
            material.map.needsUpdate = true;
        })
        imageTrans.src = 'planet/cloud2.jpg';
    }, false);
    imageMap.src = 'planet/cloud1.jpg';

    geometry = new THREE.SphereGeometry(5.02, 32, 32)
    material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
    })
    mesh = new THREE.Mesh(geometry, material);
    return mesh
}




function createPlanet(){
    let geometry = new THREE.SphereGeometry(5, 32, 32);

    planet = new THREE.Object3D();

    let smap = new THREE.TextureLoader().load('planet/earth.jpg');
    let bmap= new THREE.TextureLoader().load('planet/normalMap.jpg');
    let specmap = new THREE.TextureLoader().load('planet/specularTexture.jpg');


    let material = new THREE.MeshPhongMaterial({
        shininess  :  20,
        bumpMap    :  bmap,
        map        :  smap,
        specularMap: specmap,
        specular : new THREE.Color('grey'),
        bumpScale  :  0.5,
    });

    clouds = createClouds();
    let planetIn = new THREE.Mesh(geometry,material);

    //planet.add(clouds);
    scene.add(clouds)
    planet.add(planetIn);
    scene.add(planet)

}


function animate(){
    renderer.render(scene,camera);
    planet.rotation.y += 0.001;
    clouds.rotation.y -= 0.0001;




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