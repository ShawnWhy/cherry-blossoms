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
// Load the gltf file
const loader = new GLTFLoader();
//flower
let flowerTrigger = "on"
setInterval(() => {
  if(flowerTrigger=="off"){
    flowerTrigger="on"
  }
}, 500);


//create pedals 
let pedalCount = 0
let pedal1
let pedal2

loader.load("pedal1.glb", function(glb){
  pedal1 = glb.scene;

})

loader.load("pedal2.glb", function(glb){
  pedal2 = glb.scene;

})



const createPetal = (radius, position) =>
{
      let petalMesh;
      var rand = Math.floor(Math.random()*2)
      if(rand==1){
         petalMesh = pedal1.clone()
      }
      else{
        petalMesh = pedal2.clone()
      }

      
    // Three.js mesh
    
    petalMesh.scale.set(radius, radius, radius)
    // mesh.rotation.y=Math.PI*.5
    petalMesh.position.copy(position)
    scene.add(petalMesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(.02,.001,.04))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 0, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    // body.applyForce(new CANNON.Vec3(0, 0, -10), body.position)
    body.applyLocalForce(new CANNON.Vec3(.1, -.5, 0), body.position)

    // body.addEventListener('collide', playHitSound)

    world.addBody(body)
    body.linearDamping= .8

    // Save in objects
    objectsToUpdate.push({ petalMesh, body })
    console.log(objectsToUpdate);
}
//deerboy
let deerboy
let horns
let handanimation
//cannon
// console.log(CANNON)
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 1.82, 0)



const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
         friction: 10,
        restitution: 0,
        contactEquationRelaxation: 1000,
        
        frictionEquationStiffness: 1,
        linearDamping:1000,
    }
)
//floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.position=new CANNON.Vec3(0, -.5, 0)
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI *0.5
)
world.addBody(floorBody)
world.addContactMaterial(defaultContactMaterial)


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
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0,.5,1.5)
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
const ambientLight = new THREE.AmbientLight('orange', .5)
scene.add(ambientLight)
const light = new THREE.PointLight( 0xffffff, 1, 500 );
light.position.set( 2, 5, 4 );
scene.add( light );

const light2 = new THREE.PointLight( 'green', 1, 500 );
light2.position.set( -2, -5, 4 );
scene.add( light2 );
// let pedals = []
let flowers = []
let mixer;
let action;
let actionRev;

loader.load( 'deerboy2.glb', function ( gltf ) {
  console.log(gltf.animations)
  deerboy = gltf.scene;
  deerboy.scale.set(.1,.1,.1)
  // console.log(deerboy);
  scene.add( deerboy );
  horns = deerboy.children[4];
  console.log('horns')
  console.log(horns)
  // horns.material = randomMaterial

  mixer = new THREE.AnimationMixer(gltf.scene)
  action = mixer.clipAction(gltf.animations[7])
  // actionRev = mixer.clipAction(gltf.animations[8]) 
        // action.reset()
        // action.weight=1
        // actionRev.weight=0
        //   action.setEffectiveWeight(1)
        // action.clampWhenFinished = true
        action._interpolantSettings.endingStart=0
        action.timeScale=.1
        action.time = 0 
        action.setLoop( THREE.LoopOnce )
        // console.log(mixer)
          console.log(action._interpolantSettings
);


        // action.play()
        // action.paused()

}, undefined, function ( error ) {
  console.error( error );
} );

let mainFlowerMesh 
loader.load("flower.glb", function(glb){
  mainFlowerMesh = glb.scene;
})

window.addEventListener("click",(e)=>{
  e.stopPropagation()
  e.preventDefault()
  if(action !== null)
  {
    action.play();
  }


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



const createFlower = function(position, rotation){
console.log("CREATEFLOWER")
var random = Math.random()-.5
console.log(position)
  let flowerMesh;
  
  flowerMesh = SkeletonUtils.clone(mainFlowerMesh)
  console.log(flowerMesh)
  flowerMesh.scale.set(.001,.001,.001)
  flowerMesh.position.x=position.x;
    flowerMesh.position.y=position.y;
      flowerMesh.position.z=position.z;
      // flowerMesh.rotation.x=Math.PI*.5
      flowerMesh.rotation.y = rotation.y * -1 +random
      flowerMesh.rotation.x=rotation.x + Math.PI*.5 +random
      flowerMesh.rotation.z=rotation.z * -1 +random
  

   scene.add(flowerMesh)
    flowers.push(flowerMesh)
      
    gsap.to( flowerMesh.scale,{duration:.3,y:.005 ,x:.005, z:.005})

}
let hornIntersect

// Animate the scene
function animate() {
  let oldElapsedTime=null;
  const clock = new THREE.Clock()
  let previousTime = 0

const elapsedTime = clock.getElapsedTime()
const deltaTime = elapsedTime - oldElapsedTime
oldElapsedTime = elapsedTime
//raycaster needs to be refreshed every frame
  raycaster.setFromCamera(mouse, camera)
      if(mixer)
    {
        mixer.update(deltaTime)
    }



  requestAnimationFrame( animate );


  renderer.render( scene, camera );
// console.log(mouse)
  if(horns !=null){
  hornIntersect = raycaster.intersectObject(horns);
  // console.log(hornIntersect)
    if(hornIntersect.length>0){
      // console.log("intersect")
      // console.log(hornIntersect[0].point)
      if(flowerTrigger=="on"){
      createFlower(hornIntersect[0].point, camera.rotation)
      pedalCount++;
      if(pedalCount>=4){

        createPetal(0.007, hornIntersect[0].point)
        pedalCount=0

      }
      // console.log(camera.rotation)
      flowerTrigger="off";
      // horns.material=randomMaterial2
      }
    }
  }

  if(objectsToUpdate.length>0){
  for(let object of objectsToUpdate)
{     
    object.petalMesh.position.copy(object.body.position)
    object.petalMesh.quaternion.copy(object.body.quaternion)
    // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
}
  }


   controls.update()

     world.step(1 / 60, deltaTime, 3)

  

}
animate();
