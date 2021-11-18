// Source: https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html

import * as THREE from 'three'

class PathAnimation {
  constructor( camera, vectors, duration )
  {
    this.camera = camera
    this.duration = duration ? duration : 10

    this.pipeSpline = new THREE.CatmullRomCurve3(vectors.map(vector => new THREE.Vector3( vector[0], vector[1], vector[2] )))
    this.tubeGeometry = new THREE.TubeGeometry( this.pipeSpline, 10000, 2000, 100, true );

    this.direction = new THREE.Vector3();
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.position = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();
    this.pickt = 0;
    this.animationStart = Date.now();
    this.animationEnd = this.animationStart + this.duration * 1000;
  }

  // By https://github.com/sole/tween.js/blob/master/src/Tween.js
  quadraticInOut(k)
  {

    if ((k *= 2) < 1) {
      return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);

  }

  cubicInOut (k) {

    if ((k *= 2) < 1) {
      return 0.5 * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k + 2);

  }

  quarticInOut (k) {

    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k;
    }

    return - 0.5 * ((k -= 2) * k * k * k - 2);

  }

  tick()
  {

    const time = Date.now();

    var x = Math.min(100, 100 / (this.animationEnd - this.animationStart) * (time - this.animationStart))

    const t = this.quarticInOut(x / 100)
    if(t >= 1) return false
    else
    {
      this.tubeGeometry.parameters.path.getPointAt( t, this.position );
      
      this.binormal.subVectors( this.tubeGeometry.binormals[ this.pickt + 1 ], this.tubeGeometry.binormals[ this.pickt ] );

      this.tubeGeometry.parameters.path.getTangentAt( t, this.direction );

      this.normal.copy( this.binormal ).cross( this.direction );

      this.camera.position.copy( this.position );
      const lookNext = t + 30 / this.tubeGeometry.parameters.path.getLength() % 1
      if(lookNext < 1)
      {
        this.tubeGeometry.parameters.path.getPointAt( lookNext, this.lookAt );
        this.camera.matrix.lookAt( this.camera.position, this.lookAt, this.normal );
      }
      this.camera.quaternion.setFromRotationMatrix( this.camera.matrix );

      this.pickt = this.pickt + 1;
      return true
    }
  }
}

export { PathAnimation };
