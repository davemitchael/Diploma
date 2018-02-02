/*import * as $ from 'jquery/dist/jquery';
import * as THREE from 'three/build/three.module';
//import * as THREE from "../libs/three.module";

$(function () {

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    let scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor("#0e0e0e", 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: "#ffffff"});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow  = true;

    // rotate and position the plane
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x=15;
    plane.position.y=0;
    plane.position.z=0;

    // add the plane to the scene
    scene.add(plane);

    // create a cube
    const cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({color: "#ff0000"});
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x=-4;
    cube.position.y=3;
    cube.position.z=0;

    // add the cube to the scene
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({color: "#7777ff"});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x=20;
    sphere.position.y=0;
    sphere.position.z=2;
    sphere.castShadow=true;

    // add the sphere to the scene
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight("#0c0c0c");
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight("#ffffff");
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add( spotLight );


    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);

    // call the render function
    let step = 0;
    render();

    function render() {
        // rotate the cube around its axes
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;

        // bounce the sphere up and down
        sphere.position.x = 20+( 10*(Math.cos(step+=0.01)));
        sphere.position.y = 2 +( 10*Math.abs(Math.sin(step+=0.03)));

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
});*/

import * as BABYLON from 'babylonjs'

let canvas, engine, scene, camera, score = 0;
// noinspection JSAnnotator
let TOAD_MODEL;
let ENDINGS = [];
let ENEMIES = [];

document.addEventListener("DOMContentLoaded", function () {
    if(BABYLON.Engine.isSupported()){
        initScene();
        initGame();
    }
},false);

function initScene() {
    canvas = document.getElementById('renderCanvas');

    engine = new BABYLON.Engine(canvas, true);

    scene = new BABYLON.Scene(engine);

    camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10),scene);
    camera.setTarget(new BABYLON.Vector3(0,0,10));
    camera.attachControl(canvas);

    let light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5),scene);

    engine.runRenderLoop(function () {
        scene.render();
    })
}

function initGame() {
    let LANE_NUMBER = 3;
    let LANE_INTERVAL = 5;
    let LANES_POSITIONS = [];

    let createLane = function (id, position) {
        let lane = BABYLON.Mesh.CreateBox("lane" + id, 1, scene);
        lane.scaling.y = 0.1;
        lane.scaling.x = 3;
        lane.scaling.z = 800;
        lane.position.x = position;
        lane.position.z = lane.scaling.z / 2 - 200;
    };

    let createEnding = function (id, position) {
        const ending = BABYLON.Mesh.CreateGround(id, 3, 4, 1, scene);
        ending.position.x = position;
        ending.position.y = 0.1;
        ending.position.z = 1;
        const mat = new BABYLON.StandardMaterial("endingMat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
        ending.material = mat;
        return ending;
    };

    let currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER / 2);
    for (let i = 0; i < LANE_NUMBER; i++) {
        LANES_POSITIONS[i] = currentLanePosition;
        createLane(i, currentLanePosition);
        const e = createEnding(i, currentLanePosition);
        ENDINGS.push(e);
        currentLanePosition += LANE_INTERVAL;
    }

    // Adjust camera position
    camera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER / 2)];

    BABYLON.SceneLoader.ImportMesh("toad", "src/assets/", "toad.babylon", scene, function (meshes) {
        let m = meshes[0];
        m.isVisible = false;
        m.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        TOAD_MODEL = m;
    });

    let createEnemy = function () {
        let posZ = 100;

        let posX = LANES_POSITIONS[Math.floor(Math.random() * LANE_NUMBER)];

        let shroom = TOAD_MODEL.clone(TOAD_MODEL.name);
        shroom.id = TOAD_MODEL.name + (ENEMIES.length + 1);
        shroom.killed = false;
        shroom.isVisible = true;
        shroom.position = new BABYLON.Vector3(posX, shroom.position.y / 2, posZ);
        ENEMIES.push(shroom);

    };

    setInterval(createEnemy, 1000);
}






