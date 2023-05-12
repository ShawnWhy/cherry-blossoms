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

//deerboy
let deerboy
let horns
let handanimation
//cannon
// console.log(CANNON)
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
//floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.position=new CANNON.Vec3(0, -20, 0)
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI *0.5
)
world.addBody(floorBody)

//flowerGeometry 
const randomMaterial = new THREE.MeshStandardMaterial({color:"#F3A56B"})
const randomMaterial2 = new THREE.MeshStandardMaterial({color:"red"})


//falling pedals 

const objectsToUpdate = []




 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Create the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0,0,1.5)
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
// Controls
// controls.target.set(0, 0, 0)
controls.enableDamping = true   



//  * Renderer
//  */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setClearColor( 'green',.5);

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Add a light to the scene
const light = new THREE.PointLight( 0xffffff, 1, 500 );
light.position.set( 2, 5, 4 );
scene.add( light );
let pedals = []
let flowers = []
      // Load the gltf file
      const loader = new GLTFLoader();
loader.load( 'deerboy.glb', function ( gltf ) {
  deerboy = gltf.scene;
  deerboy.scale.set(.1,.1,.1)
  console.log(deerboy);
  scene.add( deerboy );
  horns = deerboy.children[4];
  console.log('horns')
  console.log(horns)
  horns.material = randomMaterial
}, undefined, function ( error ) {
  console.error( error );
} );

let mainFlowerMesh 

loader.load("flower.glb", function(glb){
  mainFlowerMesh = glb.scene;

})


//raycaster 
const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    // console.log(mouse)
})
const raycaster = new THREE.Raycaster()



const createFlower = function(position){
console.log("CREATEFLOWER")
console.log(position)
  let flowerMesh;
  
  flowerMesh = SkeletonUtils.clone(mainFlowerMesh)
  console.log(flowerMesh)
  flowerMesh.scale.set(.03,.03,.03)
  flowerMesh.position.x=position.x;
    flowerMesh.position.y=position.y;
      flowerMesh.position.z=position.z;
  

   scene.add(flowerMesh)
    flowers.push(flowerMesh)
      
    // gsap.to( flowerMesh.scale,{duration:.3,y:5 ,x:5, z:5})

}
let hornIntersect





// Animate the scene
function animate() {
  raycaster.setFromCamera(mouse, camera)
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
// console.log(mouse)
  if(horns !=null){
  hornIntersect = raycaster.intersectObject(horns);
  // console.log(hornIntersect)
    if(hornIntersect.length>0){
      // console.log("intersect")
      // console.log(hornIntersect[0].point)
      createFlower(hornIntersect[0].point)
      horns.material=randomMaterial2
    }
  }
  

   controls.update()
}
animate();
