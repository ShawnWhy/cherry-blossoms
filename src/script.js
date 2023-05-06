import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { LoopOnce, SphereGeometry, TextureLoader, Vector3 } from 'three'
import $ from "./Jquery"
import gsap from "gsap"
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { Cylinder, GridBroadphase } from 'cannon'
import CANNON from 'cannon'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
const textureLoader = new THREE.TextureLoader()
const canvas = document.querySelector('canvas.webgl')

const raycaster = new THREE.Raycaster()

//cannon
// console.log(CANNON)
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true


// Create the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,-1)
const controls = new OrbitControls(camera, canvas)
// Controls
// controls.target.set(0, 0, 0)
controls.enableDamping = true   

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add a light to the scene
const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, 0, 0 );
scene.add( light );
let pedalFlower
      // Load the gltf file
      const loader = new GLTFLoader();
      loader.load( 'pedal.glb', function ( gltf ) {
        pedalFlower = gltf.scene;
        pedalFlower.scale.set(.1,.1,.1)

        scene.add( pedalFlower );
      }, undefined, function ( error ) {
        console.error( error );
      } );

      // Animate the scene
      function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
         controls.update()
      }
      animate();
    