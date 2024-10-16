import {
	EventDispatcher,
	Quaternion,
	Vector3
} from 'three';

const _changeEvent = { type: 'change' };

class FlyControls extends EventDispatcher {

	constructor( object, domElement, isMobileDevice ) {

		super();

		this.isMobileDevice = isMobileDevice ? isMobileDevice : false

		if ( domElement === undefined ) {

			console.warn( 'THREE.FlyControls: The second parameter "domElement" is now mandatory.' );
			domElement = document;

		}

		this.object = object;
		this.domElement = domElement;

		// API

		this.movementSpeed = 1.0;
		this.rollSpeed = 0.005;
    this.movementSpeedMultiplier = 1
    this.damping = 0
		this.allowMoving = false

		this.dragToLook = true;
		this.autoForward = false;

		// disable default target object behavior

		// internals

		const scope = this;

		const EPS = 0.000001;

		const lastQuaternion = new Quaternion();
		const lastPosition = new Vector3();

		this.tmpQuaternion = new Quaternion();

		this.mouseStatus = 0;

		this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
		this.moveVector = new Vector3( 0, 0, 0 );
		this.rotationVector = new Vector3( 0, 0, 0 );

		this.keydown = function ( event ) {

			if ( event.altKey ) {

				return;

			}

			switch ( event.code ) {
				case 'ShiftLeft':
				case 'ShiftRight': this.movementSpeedMultiplier = 3; break;

				case 'KeyW':
        case 'ArrowUp':
				case 'Space': {
                    this.moveState.forward = 1;
                    this.damping = 1
                    break;
                }
                case 'ArrowDown':
				case 'KeyS': {
                    this.moveState.back = 1;
                    this.damping = -1
                    break;
                }

				// case 'KeyA': this.moveState.left = 1; break;
				// case 'KeyD': this.moveState.right = 1; break;

				case 'KeyR': this.moveState.up = 1; break;
				case 'KeyF': this.moveState.down = 1; break;

				// case 'ArrowUp': this.moveState.pitchUp = 1; break;
				// case 'ArrowDown': this.moveState.pitchDown = 1; break;

				// case 'ArrowLeft': this.moveState.yawLeft = 1; break;
				// case 'ArrowRight': this.moveState.yawRight = 1; break;

                case 'ArrowLeft':
				case 'KeyA': this.moveState.rollLeft = 1; break;

                case 'ArrowRight':
				case 'KeyD': this.moveState.rollRight = 1; break;

			}

			this.updateMovementVector();
			this.updateRotationVector();

		};

		this.keyup = function ( event ) {

			switch ( event.code ) {

				case 'ShiftLeft':
				case 'ShiftRight': this.movementSpeedMultiplier = 1; break;

                case 'ArrowUp':
				case 'KeyW':
				case 'Space': this.moveState.forward = 0; break;

                case 'ArrowDown':
				case 'KeyS': this.moveState.back = 0; break;

				// case 'KeyA': this.moveState.left = 0; break;
				// case 'KeyD': this.moveState.right = 0; break;

				case 'KeyR': this.moveState.up = 0; break;
				case 'KeyF': this.moveState.down = 0; break;

				// case 'ArrowUp': this.moveState.pitchUp = 0; break;
				// case 'ArrowDown': this.moveState.pitchDown = 0; break;

				// case 'ArrowLeft': this.moveState.yawLeft = 0; break;
				// case 'ArrowRight': this.moveState.yawRight = 0; break;

                case 'ArrowLeft':
				case 'KeyA': this.moveState.rollLeft = 0; break;

                case 'ArrowRight':
				case 'KeyD': this.moveState.rollRight = 0; break;

			}

			this.updateMovementVector();
			this.updateRotationVector();

		};

		this.mousedown = function ( event ) {
			console.log("Mouse Down", event.button)
			if ( this.dragToLook ) {

				this.mouseStatus ++;

			} else {

				switch ( event.button ) {

					case 0: this.moveState.forward = 1; break;
					case 2: this.moveState.back = 1; break;

				}

				this.updateMovementVector();

			}

		};

		this.mousemove = function ( event ) {

			if ( ! this.dragToLook || this.mouseStatus > 0) {

				const container = this.getContainerDimensions();
				const halfWidth = container.size[ 0 ] / 2;
				const halfHeight = container.size[ 1 ] / 2;

				const x = 'pageX' in event ? event.pageX : event.touches[ 0 ].pageX;
				const y = 'pageY' in event ? event.pageY : event.touches[ 0 ].pageY;

				this.moveState.yawLeft = - ( ( x - container.offset[ 0 ] ) - halfWidth ) / halfWidth;
				this.moveState.pitchDown = ( ( y - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

				this.updateRotationVector();

			}

		};

		this.mouseup = function ( event ) {

			if ( this.dragToLook ) {

				this.mouseStatus --;

				this.moveState.yawLeft = this.moveState.pitchDown = 0;

			} else {

				switch ( event.button ) {

					case 0: this.moveState.forward = 0; break;
					case 2: this.moveState.back = 0; break;

				}

				this.updateMovementVector();

			}

			this.updateRotationVector();

		};

		this.touchStartFlyTimeout = null

		this.touchstart = function ( event ) {
			this.touchStartFlyTimeout = setTimeout(() => {
				this.moveState.forward = 1;
				this.damping = 1
				this.allowMoving = true
			}, 50)
		}

		this.touchend = function ( event ) {
			this.allowMoving = false
			this.moveState.forward = 0;
			
			if(this.touchStartFlyTimeout) clearTimeout(this.touchStartFlyTimeout)
		}

		this.update = function ( delta ) {

			const moveMult = delta * scope.movementSpeed * this.movementSpeedMultiplier;
			const rotMult = delta * scope.rollSpeed;

			scope.object.translateX( scope.moveVector.x * moveMult );
			scope.object.translateY( scope.moveVector.y * moveMult );
			scope.object.translateZ( scope.moveVector.z * moveMult );

			if(this.allowMoving)
			{
				scope.tmpQuaternion.set( scope.rotationVector.x * rotMult, scope.rotationVector.y * rotMult, scope.rotationVector.z * rotMult, 1 ).normalize();
				scope.object.quaternion.multiply( scope.tmpQuaternion );
			}

			if (
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS
			) {

				scope.dispatchEvent( _changeEvent );
				lastQuaternion.copy( scope.object.quaternion );
				lastPosition.copy( scope.object.position );

			}
            
      if(Math.abs(this.damping) > 0 && (!this.moveState.forward || !this.moveState.back))
        this.updateMovementVector()

		};

		this.updateMovementVector = function () {

			var forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;
            if(!this.moveState.forward && !this.moveState.back && (Math.abs(this.damping) > 0))
            {
                forward = this.damping
                if(Math.abs(forward) <= 0.05)
                {
                    forward = 0
                    this.damping = 0
                }
            }

			this.moveVector.x = ( - this.moveState.left + this.moveState.right );
			this.moveVector.y = ( - this.moveState.down + this.moveState.up );
			this.moveVector.z = ( - forward + this.moveState.back );

      if (!this.moveState.forward && !this.moveState.back && Math.abs(this.damping) > 0)
      {
        this.damping = this.damping > 0 ? this.damping - 0.05 : this.damping + 0.05
      }

			//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

		};

		this.updateRotationVector = function () {

			this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
			this.rotationVector.y = ( - this.moveState.yawRight + this.moveState.yawLeft );
			this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

			//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

		};

		this.getContainerDimensions = function () {

			if ( this.domElement != document ) {

				return {
					size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
					offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
				};

			} else {

				return {
					size: [ window.innerWidth, window.innerHeight ],
					offset: [ 0, 0 ]
				};

			}

		};

		this.dispose = function () {

			if(this.isMobileDevice)
			{
				this.domElement.removeEventListener( 'mousemove', _mousemove );
			}
			else
			{
				this.domElement.removeEventListener( 'touchmove', _mousemove );
				this.domElement.removeEventListener( 'touchstart', _touchstart );
				this.domElement.removeEventListener( 'touchend', _touchend );
			}

			this.domElement.removeEventListener( 'contextmenu', contextmenu );
			window.removeEventListener( 'keydown', _keydown );
			window.removeEventListener( 'keyup', _keyup );

		};

		var _mousemove, _mousedown, _mouseup, _touchstart, _touchend;
		_mousemove = this.mousemove.bind( this );
		_mousedown = this.mousedown.bind( this );
		_mouseup = this.mouseup.bind( this );
		_touchstart = this.touchstart.bind( this );
		_touchend = this.touchend.bind( this );
		
		const _keydown = this.keydown.bind( this );
		const _keyup = this.keyup.bind( this );

		this.domElement.addEventListener( 'contextmenu', contextmenu );

		if(this.isMobileDevice)
		{
			this.domElement.addEventListener( 'touchmove', _mousemove );
			this.domElement.addEventListener( 'touchstart', _touchstart );
			this.domElement.addEventListener( 'touchend', _touchend );
		}
		else
		{
			this.allowMoving = true
			this.domElement.addEventListener( 'mousemove', _mousemove );
			window.addEventListener( 'keydown', _keydown );
			window.addEventListener( 'keyup', _keyup );				
		}

		this.updateMovementVector();
		this.updateRotationVector();

	}

	setMoveState(axis, state)
	{
		if(axis == 'forward' && state)
		{
			this.moveState.forward = 1;
			this.damping = 1			
		}
		else if(axis == 'forward' && !state)
		{
			this.moveState.forward = 0;
		}
		else if(axis == 'back' && state)
		{
			this.moveState.back = 1;
			this.damping = -1		
		}
		else if(axis == 'back' && !state)
		{
			this.moveState.back = 0;
		}
		else if(axis == 'right' && state)
		{
			this.moveState.right = 1;
			this.damping = 0
			this.updateMovementVector()
		}
		else if(axis == 'right' && !state)
		{
			this.moveState.right = 0;
			this.updateMovementVector()
		}
		else if(axis == 'left' && state)
		{
			this.moveState.left = 1;
			this.damping = 0
			this.updateMovementVector()
		}
		else if(axis == 'left' && !state)
		{
			this.moveState.left = 0;
			this.updateMovementVector()
		}

	}

}

function contextmenu( event ) {

	event.preventDefault();

}


export { FlyControls };
