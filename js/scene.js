let camera, renderer, scene

let teta, omega, r = 8

let planet, clouds

let spaceShipObject;

let garbage = [];

let noQuadrant = [];


let Quadrant1, Quadrant2, Quadrant3, Quadrant4;

Quadrant1 = [];
Quadrant2 = [];
Quadrant3 = [];
Quadrant4 = [];


function calculateQuadrant(Obj){
    if(Obj.position.x > 0 && Obj.position.y > 0)
        return "Quadrant1"
    else if(Obj.position.x > 0 && Obj.position.y < 0)
        return "Quadrant2"
    else if(Obj.position.x < 0 && Obj.position.y > 0)
        return "Quadrant3"
    else if(Obj.position.x < 0 && Obj.position.y < 0)
        return "Quadrant4"
}

function getObjectsInTheSameQuadrant(quadrant){
    switch (quadrant){
        case "Quadrant1":
            return Quadrant1;
        case "Quadrant2":
            return Quadrant2;
        case "Quadrant3":
            return Quadrant3;
        case "Quadrant4":
            return Quadrant4;
    }
}

function toQuadrants(){
    for(let obj of noQuadrant){
        let quad = calculateQuadrant(obj.object);
        switch (quad){
            case "Quadrant1":
                Quadrant1.push(obj);
                break;
            case "Quadrant2":
                Quadrant2.push(obj);
                break;
            case "Quadrant3":
                Quadrant3.push(obj);
                break;
            case "Quadrant4":
                Quadrant4.push(obj);
                break;
        }

    }
}


class spaceObject{
    constructor(object, radius) {
        this.object = object;
        this.radius = radius;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getGeometry(form){
    switch (form){
        case 0:
            return
    }
}

function createGarbage() {
    for (let i = 0; i < 20; i++) {
        let form = getRandomInt(4);
        let garbageTeta = Math.random() * Math.PI;
        let garbageOmega = Math.random() * 2 * Math.PI;
        let geometry;
        let radius;
        const material = new THREE.MeshPhongMaterial({color: 0xfc03c6});

        switch (form) {
            case 0:
                geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
                radius = Math.sqrt(3) / 2;
                break;
            case 1:
                geometry = new THREE.ConeGeometry(1, 1, 16, 16, false, 0, Math.PI * 2);
                radius = Math.sqrt(5) / 2;
                break;
        }

        let garbageObject = new THREE.Mesh(geometry, material);
        garbageObject.position.set(r* Math.sin(garbageTeta) *Math.sin(garbageOmega),
            r * Math.cos(garbageOmega),
            r * Math.cos(garbageTeta) * Math.sin(garbageOmega));
        let garbageModel = new spaceObject(garbageObject, radius);
        garbage.push(garbageModel);
        scene.add(garbageObject);
        noQuadrant.push(garbageModel);
    }
}

function getNorm(vector) {
    return math.norm(vector);
}

function getExternalProduct(vector1, vector2) {
    return math.cross(vector1, vector2);
}
function getDiff(vector1, vector2){
    let newVector = [];
    for (let i = 0; i < 3; i++)
        newVector.push(vector1[i] - vector2[i]);
    return newVector;
}

function getDistance(x0, x1, x2) {
    return getNorm(getExternalProduct(getDiff(x2, x1), getDiff(x1, x0))) / getNorm(getDiff(x2, x1))
}

function normalizeVector(vector) {
    let norm = getNorm(vector);
    let newVector = [];
    for (let i = 0; i < 3; i++)
        newVector.push(vector[i] / norm);
    return newVector
}

function getPoint(x1, x0, dist, vector) {
    let seno = dist / getNorm(getDiff(x1, x0))
    let angle = math.asin(seno);
    let cos = math.cos(angle);
    let d = getNorm(getDiff(x1, x0)) * cos
    let newPoint = []
    for (let i = 0; i < 3; i++)
        newPoint.push(x1[i] + d * vector[i]);
    return newPoint;
}

function inBetween(value0, value1, value2){
    return (value0 >= value1 && value0 <= value2) || (value0 <= value1 && value0 >= value2)
}

function hasColision(spaceObject1, spaceObject2, nextPos) {
   let pos0 = spaceObject2.object.position;
   let pos1 = spaceObject1.object.position;
   let x0 = [pos0.x, pos0.y, pos0.z];
   let x1 = [pos1.x, pos1.y, pos1.z];
   let x2 = nextPos;

   let d = getDistance(x0, x1, x2);
   if (d > (spaceObject1.radius + spaceObject2.radius)){
       return false;
   }

    let point = getPoint(x1, x0, d, normalizeVector(getDiff(x2, x1)));

   if (inBetween(point[0], x1[0], x2[0]) && inBetween(point[1], x1[1], x2[1]) && inBetween(point[2], x1[2], x2[2]))
       return true;

   return getNorm(getDiff(x2, x0)) <= (spaceObject2.radius + spaceObject1.radius);
}







let rocket;
function createSatellite(){
    'use strict';

    spaceShipObject = new THREE.Object3D();

    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshPhongMaterial();


    let sat1 = new THREE.Mesh(geometry,material);




    spaceShipObject.add(sat1);
    scene.add(spaceShipObject);

}

var shipBody, shipNose, engine1, engine2, engine3, engine4, shipVisor;
function createSpaceShip(){
    spaceShipObject = new THREE.Object3D();
    createShipBody(shipBody);
    createShipNose(shipNose);
    createShipFireEngine(engine1, 4, -4, 0);
    createShipFireEngine(engine2, -4, -4, 0);
    createShipFireEngine(engine3, 0, -4, 4);
    createShipFireEngine(engine4, 0, -4, -4);
    createVisor(shipVisor, 0, 2, 0);
    spaceShipObject.scale.set(0.15, 0.15, 0.15);
    scene.add(spaceShipObject);
    rocket = new spaceObject(spaceShipObject, Math.sqrt(3) / 2);

}

function createShipBody(obj){
    let geometry = new THREE.CylinderGeometry(4, 4, 8, 16, 16, false, 0, 2 * Math.PI);
    const material = new THREE.MeshToonMaterial( { color: 0x808080 } );
    obj = new THREE.Mesh(geometry, material);
    obj.position.set(0, 0, 0);
    shipBody = obj;
    spaceShipObject.add(obj);
}

function createShipNose(obj){
    let geometry = new THREE.CylinderGeometry(1, 4, 4, 16, 1, false, 0, 2 * Math.PI);
    const material = new THREE.MeshToonMaterial( { color: 0xff8c00 } );
    obj = new THREE.Mesh(geometry, material);
    obj.position.set(0, 6, 0);
    spaceShipObject.add(obj);
}

function createShipFireEngine(obj, x, y, z){
    let geometry = new THREE.CapsuleGeometry(1.5, 2.5, 16, 16);
    const material = new THREE.MeshToonMaterial( { color: 0x36454f} );
    obj = new THREE.Mesh(geometry, material);
    obj.position.set(x, y, z);
    spaceShipObject.add(obj);
}

function createVisor(obj, x, y, z){
    let geometry = new THREE.CylinderGeometry(4.01, 4.01, 2, 8, 4, false, 0, Math.PI * 0.35);
    const material = new THREE.MeshToonMaterial( { color: 0x1ca8ff} );
    obj = new THREE.Mesh(geometry, material);
    obj.position.set(x, y, z);
    obj.rotation.y = Math.PI * 0.08;
    spaceShipObject.add(obj);
}


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

    geometry = new THREE.SphereGeometry(5.025, 32, 32)
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
        bumpScale  :  0.3,
    });

    clouds = createClouds();
    let planetIn = new THREE.Mesh(geometry,material);

    //planet.add(clouds);
    scene.add(clouds)
    planet.add(planetIn);
    scene.add(planet)

}


function checkColisionWithShip(){
    let spaceShipQuad = calculateQuadrant(rocket.object);
    let sameQuad = getObjectsInTheSameQuadrant(spaceShipQuad);
    for(let objs of sameQuad){
        if(hasColision(rocket, objs, [r* Math.sin(teta) *Math.sin(omega),
            r * Math.cos(omega),
            r * Math.cos(teta) * Math.sin(omega)])){
            scene.remove(objs.object);
        }
    }
}


//let shipSpeed =0.005;
let shipSpeed =0.01;
function animate(){

    renderer.render(scene,camera);
    planet.rotation.y += 0.001;
    clouds.rotation.y += 0.0014;
    let checkColision = false;

    if(arrowRightDown){
        checkColision = true;
        teta += shipSpeed;
    }
    if(arrowLeftDown){
        checkColision = true;
        teta -= shipSpeed;
    }
    if(arrowUpDown){
        checkColision = true;
        omega += shipSpeed;
    }
    if(arrowDownDown){
        checkColision = true;
        omega -= shipSpeed;
    }


    if(checkColision) {
        spaceShipObject.up.set(
            r * Math.sin(teta) * Math.sin(omega),
            r * Math.cos(omega),
            r * Math.cos(teta) * Math.sin(omega)).normalize();

        spaceShipObject.lookAt(planet.position);

        checkColisionWithShip();
    }


    spaceShipObject.position.set(r* Math.sin(teta) *Math.sin(omega),
    r * Math.cos(omega),
    r * Math.cos(teta) * Math.sin(omega));



    requestAnimationFrame(animate);
}



function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));

    const loader = new THREE.CubeTextureLoader();
    scene.background = loader.load([
        "galaxy/galaxy-X.png",
        "galaxy/galaxy-Y.png",
        "galaxy/galaxy-Z.png",
        "galaxy/galaxy+X.png",
        "galaxy/galaxy+Y.png",
        "galaxy/galaxy+Z.png",
    ]);

}


function createMainCamera() {

    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.z = 20;
    camera.position.y = 10;
    camera.lookAt(scene.position);
    //spaceShipObject.add(camera);
    scene.add(camera);
}

function createFollowCamera() {

    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.y = -20;
    camera.position.z = -20;
    camera.lookAt(scene.position);
    spaceShipObject.add(camera);
}


function render() {
    'use strict';
    renderer.render(scene, camera);
}


function createLight(){
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0,30,20);
    scene.add( directionalLight );
}


function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

let arrowLeftDown, arrowUpDown, arrowRightDown, arrowDownDown

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 49: //1
            createMainCamera();
            break;
        case 50: //2
            createFollowCamera();
            break;
        case 37: //leftArrow
            arrowLeftDown = true;
            break;
        case 38: //upArrow
            arrowUpDown = true;
            break;
        case 39: //rightArrow
            arrowRightDown = true;
            break;
        case 40: //downArrow
            arrowDownDown = true;
            break;
    }

}

function onKeyUp(e) {
    'use strict';

    switch (e.keyCode) {
        case 37: //leftArrow
            arrowLeftDown = false;
            break;
        case 38: //upArrow
            arrowUpDown = false;
            break;
        case 39: //rightArrow
            arrowRightDown = false;
            break;
        case 40: //downArrow
            arrowDownDown = false;
            break;
    }
}


let clock;

function init() {
    'use strict';
    //  ----------x0-------
    //
    //x1-------------------x2

    clock = new THREE.Clock();
    teta = Math.random();
    omega = Math.random();

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createLight();



    createPlanet();
    createSpaceShip();
    createGarbage();
    createMainCamera();


    toQuadrants(); // Puts the objects into his Quadrant
    render();
    animate();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}


