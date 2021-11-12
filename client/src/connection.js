import * as THREE from 'three'
import { LightningStrike } from 'three/examples/jsm/geometries/LightningStrike.js';
import { RenderPass } from 'three/examples//jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples//jsm/postprocessing/OutlinePass.js';

class Connection {
    constructor(scene, camera, composer, p1, p2) {

      this.scene = scene
      this.camera = camera
      this.composer = composer


      this.lightningColor = new THREE.Color( 0x00d0ff );
      this.outlineColor = new THREE.Color( 0xf00add4 );
  
      this.lightningMaterial = new THREE.MeshBasicMaterial( { color: this.lightningColor } );
      this.lightningMaterial.transparent = true
      this.lightningMaterial.opacity = 0.6
      this.camera = camera
  
      let rayParams = {
  
        sourceOffset: new THREE.Vector3(),
        destOffset: new THREE.Vector3(),
        radius0: 50000,
        radius1: 50000,
        minRadius: 50000,
        maxIterations: 6,
        isEternal: true,
  
        propagationTimeFactor: 0.99,
        vanishingTimeFactor: 0.95,
        subrayPeriod: 0.5,
        subrayDutyCycle: 0,
        maxSubrayRecursion: 4,
        ramification: 3,
        recursionProbability: 0,
  
        roughness: 1,
        straightness: 0.95
  
      };
  
      this.outlineMeshArray = [];

      // Create Ray
      this.lightningStrike = new LightningStrike( rayParams );
      this.lightningStrikeMesh = new THREE.Mesh( this.lightningStrike, this.lightningMaterial );

      // this.outlineMeshArray.length = 0;
      // this.outlineMeshArray.push( this.lightningStrikeMesh );

      scene.add( this.lightningStrikeMesh );
      
      // Create Outline
      // this.outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera, this.outlineMeshArray );
      // this.outlinePass.edgeStrength = 2.5;
      // this.outlinePass.edgeGlow = 1.7;
      // this.outlinePass.edgeThickness = 0.8;
      // this.outlinePass.visibleEdgeColor = this.outlineColor;
      // this.outlinePass.hiddenEdgeColor.set( 0 );
      // this.composer.addPass( this.outlinePass );

      // Add Direction
      this.lightningStrike.rayParameters.sourceOffset.copy( p1 );
      this.lightningStrike.rayParameters.destOffset.copy( p2 );      

    }

    update(currentTime)
    {
      this.lightningStrike.update( currentTime );
    }

    remove()
    {
      this.composer.removePass(this.outlinePass)
      this.composer.removePass(this.rayPass)
      this.scene.remove(this.lightningStrikeMesh)
    }
}

export default Connection
