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
let arch
let DotCount 
let addAnimationTrigger = "off"

loader.load("arch.glb", function(glb){
  arch = glb.scene;
  console.log("arch")
  console.log(arch)
  arch.scale.set(.7,.7,.7)
  arch.rotation.x = Math.PI*0.5
  arch.position.z = -.1
  scene.add(arch)

  DotCount = arch.children[0].geometry.getAttribute('position')
  console.log(DotCount.count)

})

    // let vertex = new THREE.Vector3();
    // vertex.fromBufferAttribute( DotCount, randomLeaf );
    // leaveMass.localToWorld( vertex );

loader.load("pedal1.glb", function(glb){
  pedal1 = glb.scene;

})

loader.load("pedal2.glb", function(glb){
  pedal2 = glb.scene;

})

const deleteFlowers = function(){
let count = flowers.length;

for(let i=0; i<flowers.length; i++){
  setTimeout(() => {
    scene.remove(flowers[i])
    // flowers.shift()
    if(DotCount!==null&&arch!==null&&i<DotCount.count){
    let vertex = new THREE.Vector3();
    vertex.fromBufferAttribute( DotCount, i);
    arch. localToWorld( vertex );
    console.log("vertex " + vertex)
    createArchPetal(.01, vertex)
    count --
    if(count<=0){
      flowers = []

    }
    
  }


  }, 10*i);

}




}

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
    world.gravity.x = .5;
   world.gravity.z = .5;

    setTimeout(() => {
      world.gravity.x = 0
      world.gravity.z = 0

    }, 1000);

    // body.addEventListener('collide', playHitSound)

    world.addBody(body)
    body.linearDamping= .8

    // Save in objects
    objectsToUpdate.push({ petalMesh, body })
    console.log(objectsToUpdate);
}


//create arch petals

const createArchPetal = (radius, position) =>
{
      let petalMesh;
      var rand = Math.floor(Math.random()*2)
      if(rand==1){
         petalMesh = pedal1.clone()
      }
      else{
        petalMesh = pedal2.clone()
      }

      
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
    world.gravity.x = .5;
   world.gravity.z = .5;

    setTimeout(() => {
      world.gravity.x = 0
      world.gravity.z = 0

    }, 1000);

    // body.addEventListener('collide', playHitSound)
    setTimeout(() => {
     world.addBody(body)
    body.linearDamping= .8

    // Save in objects
    objectsToUpdate.push({ petalMesh, body })
      
    }, 50);

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
floorBody.position=new CANNON.Vec3(0, -.55, 0)
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
camera.position.set(0,.5,2.0)
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

renderer.setClearColor( '#fcd303',.5);

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

loader.load( 'deerboy.glb', function ( gltf ) {
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
  // revAction = mixer.clipAction(gltf.animations[8])

  // actionRev = mixer.clipAction(gltf.animations[8]) 
        // action.reset()
        // action.weight=1
        // actionRev.weight=0
        //   action.setEffectiveWeight(1)
        // action.clampWhenFinished = true
        // action._interpolantSettings.endingStart=0
        action.timeScale=.1
        action.time = 0
        action.setLoop( THREE.LoopOnce )
        // revAction.timeScale=.1
        



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
  if(flowers.length>0){

    deleteFlowers()
  }
  //turns the animation on and also triggers the blossom array
  if(action !== null&&addAnimationTrigger=="off")
  {
    action.play();
    addAnimationTrigger="on";
    
  }
  else{
    // action.pause();
    addAnimationTrigger="off";

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





  renderer.render( scene, camera );


  requestAnimationFrame( animate );
 


 if(mixer)
{
// mixer.update(deltaTime)

        mixer.update(deltaTime)
          if(action.time<3.3&&addAnimationTrigger=="on"){
         action.time+=.08

  }
  else if(action.time>=0&&addAnimationTrigger=="off"){
    action.time-=.08

  }
  else{
    // action.time=0
  }
}
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
