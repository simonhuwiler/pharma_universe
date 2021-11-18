// Source: https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html

import * as THREE from 'three'

class PathAnimation {
  constructor( camera, vectors, speed )
  {
    this.camera = camera
    this.speed = speed ? speed : 10000
    this.speedCorrection = 1

    this.pipeSpline = new THREE.CatmullRomCurve3(vectors.map(vector => new THREE.Vector3( vector[0], vector[1], vector[2] )))
    this.tubeGeometry = new THREE.TubeGeometry( this.pipeSpline, 10000, 2000, 100, true );

    this.direction = new THREE.Vector3();
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.position = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();
    this.pickt = 0;
    this.animationStart = Date.now();
  }

  tick()
  {
    /* TWEEN
    https://sole.github.io/tween.js/examples/03_graphs.html
    https://github.com/sole/tween.js/blob/master/src/Tween.js
    function quadraticInOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}
    */

    const time = Date.now();

    var t = (time - this.animationStart) / this.speed
    if(t >= 1)   return false
    else
    {

      // reduce speed if near target
      var dumping = 1
      if(t >= 0.9)
      {
        dumping = 100 - 100 / 0.1 * (1 - t)
        // t = 
        // this.speedCorrection = 100 - this.speed / 100 * dumping
        this.speedCorrection = dumping / 100 + 1
        // console.log(this.speed - speedCorrection)
      }
      
      console.log(this.speedCorrection)
      // console.log(t, dumping)
      this.tubeGeometry.parameters.path.getPointAt( t, this.position );
      
      this.binormal.subVectors( this.tubeGeometry.binormals[ this.pickt + 1 ], this.tubeGeometry.binormals[ this.pickt ] );

      this.tubeGeometry.parameters.path.getTangentAt( t, this.direction );

      this.normal.copy( this.binormal ).cross( this.direction );

      this.camera.position.copy( this.position );

      this.tubeGeometry.parameters.path.getPointAt( ( t + 100 / this.tubeGeometry.parameters.path.getLength() ) % 1, this.lookAt );

      this.camera.matrix.lookAt( this.camera.position, this.lookAt, this.normal );
      this.camera.quaternion.setFromRotationMatrix( this.camera.matrix );

      this.pickt = this.pickt + 1;
      return true
    }
  }
}

export { PathAnimation };
