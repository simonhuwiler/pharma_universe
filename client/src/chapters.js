import { storeCamera, storeChapter, storeActivateRaysInIntro, storeControlsEnabled, storeControlButtonsEnabled, storeShowInstructions, storeData } from './store.js';
import isMobile from 'ismobilejs';
import * as THREE from 'three'
import { gsap } from "gsap";

let camera = null
let audioAmbient
let data
storeCamera.subscribe(value => camera = value)
storeData.subscribe(value => data = value)

const freeFly = () => {
  storeControlsEnabled.set(true)
  storeControlButtonsEnabled.set(true)
  if(isMobile(window.navigator).any) activateFullScreen()
  
  // Start Audio
  //TODO: Aktivieren!
  audioAmbient = new Audio('./sound/background.mp3');
  audioAmbient.play();
  storeShowInstructions.set(true)
  setTimeout(() => storeShowInstructions.set(false), 10000)    

}

const getRotation = (target) => {
  const currentRotation = camera.rotation.clone()
  camera.lookAt(target)

  const targetRotation = camera.rotation.clone()

  camera.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z)

  return targetRotation
}

function calculatePointOnLine(startPoint, finalPoint, distance) {

  let direction = new THREE.Vector3();
  direction.subVectors(startPoint, finalPoint);

  // Step 2: Normalize the direction vector
  direction.normalize();

  // Step 3: Scale the direction vector by the distance
  direction.multiplyScalar(distance);

  // Step 4: Calculate the point by subtracting the scaled direction from finalPoint
  let resultPoint = new THREE.Vector3();
  resultPoint.copy(finalPoint).add(direction);

  return resultPoint;
}


const flyToObject = (asteroidPosition, distance) => {

  const newPoint = calculatePointOnLine(camera.position, asteroidPosition, distance)

  const newRotation = getRotation(asteroidPosition)

  const tl = gsap.timeline()
  tl.to(camera.rotation, {
    x: newRotation.x,
    y: newRotation.y,
    z: newRotation.z,
    duration: 0.5,
    ease: "power1.inout"
  })

  tl.to(camera.position, {
    x: newPoint.x,
    y: newPoint.y,
    z: newPoint.z,
    duration: 5,
    ease: "power4.inout"
  })    
}


const flyToAsteroid = ( id ) => {
  const asteroid = data.asteroids.find(block => block.id === id)
  const asteroidPosition = new THREE.Vector3( asteroid.x, asteroid.y, asteroid.z )
  const distance = 50000000

  flyToObject(asteroidPosition, distance)

}

const flyToPlanet = ( id ) => {
  const asteroid = data.planets.find(block => block.id === id)
  const asteroidPosition = new THREE.Vector3( asteroid.x, asteroid.y, asteroid.z )
  const distance = 100000000

  flyToObject(asteroidPosition, distance)


}

const zoomToAbbvie = () => {
  gsap.to(camera.position, {
    x: 290333072,
    y: 20817780,
    z: -15328038,
    duration: 2.5,
    ease: "power1.inout"
  })
}

const flyToEular = () => {
  const tl = gsap.timeline()
  tl.to(camera.rotation, {
    x: 1.29,
    y: 0.49,
    z: -2.11,
    duration: 1,
    ease: "power1.inout"
  })
  
  tl.to(camera.position, {
    x: 116519208,
    y: 347526404,
    z: -95443061,
    duration: 4,
    ease: "power4.inout"
  })

}

const activateRays = () => {
  storeActivateRaysInIntro.set(true)
}

const easteregg = () => {
  console.log("EASTER")
  audioAmbient.pause()
  storeShowEasteregg.set(true)

  let audioBonus = new Audio('./sound/t1.mp3');
  audioBonus.play();  
}

storeChapter.subscribe(value => {

  const chapters = {
    4: zoomToAbbvie,
    5: flyToEular,
    6: activateRays,
    7: () => flyToAsteroid(9021),
    8: () => flyToAsteroid(5348),
    9: () => flyToAsteroid(8936), // Uni Zürich
    10: () => flyToPlanet(40), // Novartis
    98: easteregg,
    99: freeFly,
  }

  if(value in chapters){
    chapters[value]()
  }
})