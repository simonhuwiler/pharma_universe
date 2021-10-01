<script>
	// import './style.css'
  import { onMount } from 'svelte';
  import * as THREE from 'three'
  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  // import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
	// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
  import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
  import data from './data'

  onMount(async () => {
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader();

    // Object
    // const geometry = new THREE.BoxGeometry(1, 1, 1)

    // const geometry = new THREE.BufferGeometry()

    // const count = 500;
    // const positionArray = new Float32Array(count * 3 * 3)

    // for(let i = 0; i < count * 3 * 3; i++)
    // {
    //     positionArray[i] = (Math.random() - 0.5) * 4
    // }

    // const positionsAttribute = new THREE.BufferAttribute(positionArray, 3)

    // geometry.setAttribute('position', positionsAttribute)


    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    // const mesh = new THREE.Mesh(geometry, material)
    // scene.add(mesh)

    const r_factor = 1

    const materialMoon = new THREE.MeshPhongMaterial( {
      map: textureLoader.load( "./textures/moon_1024.jpg" )
    } );

    var planets = []
    for(let i in data.planets)
    {
      let planet = data.planets[i]

      // Create Sphere
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      const geometry = new THREE.SphereGeometry( planet.size, 32, 16 );
      const sphere = new THREE.Mesh( geometry, materialMoon );

      sphere.position.set(planet.x, planet.y, planet.z)
      planets.push(sphere)

    }


    const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    const geometry = new THREE.SphereGeometry( 200000, 32, 16 );

    const oLoader = new OBJLoader();
    // Loader Promise https://redstapler.co/load-multiple-model-three-js-promise/
    oLoader.load('./meshes/asteroid1/10464_Asteroid_v1_Iterations-2.obj', function ( object ) {
      object = object//.children[1]
      console.log(object)


      function ColorLuminance(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
          hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
          c = parseInt(hex.substr(i*2,2), 16);
          c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
          rgb += ("00"+c).substr(c.length);
        }

        return rgb;
        }


      function createRock(size,spreadX,maxWidth,maxHeight,maxDepth){
        var geometry = new THREE.DodecahedronGeometry(size, 1);

        var vertices = geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i=i+3) {
            //a vertex' position is (vertices[i],vertices[i+1],vertices[i+2])
            
            vertices[i] += (0-Math.random()*(size/4));
            vertices[i + 1]  += (0-Math.random()*(size/4));
            vertices[i + 2] += (0-Math.random()*(size/4));
        }

        // geometry.attributes.forEach(function(v){
        //   v.x += (0-Math.random()*(size/4));
        //   v.y += (0-Math.random()*(size/4));
        //   v.z += (0-Math.random()*(size/4));
        // })
        var color = '#111111';
        color = ColorLuminance(color,2+Math.random()*10);
        console.log(color);
        let texture = new THREE.MeshStandardMaterial({color:color,
                                              shading: THREE.FlatShading,
                                          //   shininess: 0.5,
                                                  roughness: 0.8,
                                                  metalness: 1
                                              });

        let cube = new THREE.Mesh(geometry, texture);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.scale.set(1+Math.random()*0.4,1+Math.random()*0.8,1+Math.random()*0.4);
        //cube.rotation.y = Math.PI/4;
        //cube.rotation.x = Math.PI/4;
        var x = spreadX/2-Math.random()*spreadX;
        var centeredness = 1-(Math.abs(x)/(maxWidth/2));
        var y = (maxHeight/2-Math.random()*maxHeight)*centeredness
        var z = (maxDepth/2-Math.random()*maxDepth)*centeredness
        cube.position.set(x,y,z)
        cube.r = {};
        cube.r.x = Math.random() * 0.005;
        cube.r.y = Math.random() * 0.005;
        cube.r.z = Math.random() * 0.005;
        return cube;
      };      


      let asteroids = []
      for(let i in data.asteroids)
      {
        // Create Sphere

        // const sphere = new THREE.Mesh( geometry, material );

        let planet = data.asteroids[i]

        var maxWidth = 1000;
        var maxHeight = 200;
        var maxDepth = 200;
        let sphere = createRock(5+Math.random()*50,200,maxWidth,300,400)

        // sphere.scale.set(100)
        sphere.position.set(planet.x, planet.y, planet.z)
        // console.log(r_new, x,y, z)
        asteroids.push(sphere)

      }

      // const mergedGeometry = BufferGeometryUtils.mergeGeometries(asteroids, false);
      asteroids.forEach(p => scene.add(p))
      // scene.add(mergedGeometry)
      console.log("ye2s")
    });
    

    // let dirLight = new THREE.DirectionalLight( 0xffffff );
    const light = new THREE.PointLight( 0xffffff, 1 );
    //dirLight.position.set( 0, data.solarsystem_r / 2, 0 ).normalize();
    light.position.y = data.solarsystem_r / 2
    scene.add( light );

    planets.forEach(p => scene.add(p))


    // Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000000000)
    scene.add(camera)
    camera.position.y = data.solarsystem_r / 2

    const loader = new THREE.CubeTextureLoader();
    // https://opengameart.org/content/ulukais-space-skyboxes
    const texture = loader.load([
      // './textures/skybox/corona_ft.png',
      // './textures/skybox/corona_bk.png',
      // './textures/skybox/corona_up.png',
      // './textures/skybox/corona_dn.png',
      // './textures/skybox/corona_rt.png',
      // './textures/skybox/corona_lf.png',
      
      // https://opengameart.org/content/space-skybox-0
      './textures/skybox/1.png',
      './textures/skybox/3.png',
      './textures/skybox/5.png',
      './textures/skybox/6.png',
      './textures/skybox/2.png',
      './textures/skybox/4.png',
      
      // './textures/skybox/2.png',
      // './textures/skybox/3.png',
      // './textures/skybox/4.png',
      // './textures/skybox/5.png',
      // './textures/skybox/6.png',
      
      // './textures/skybox/redeclipse_ft.png',
      // './textures/skybox/redeclipse_bk.png',
      // './textures/skybox/redeclipse_up.png',
      // './textures/skybox/redeclipse_dn.png',
      // './textures/skybox/redeclipse_rt.png',
      // './textures/skybox/redeclipse_lf.png',
      
    ]);
    scene.background = texture;

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true
    // controls.target.set(data.planets[0].x, data.planets[0].y, data.planets[0].z);
    // const controls = new FirstPersonControls( camera, canvas );
    // controls.movementSpeed = 150;
    // controls.lookSpeed = 0.1;
    // let controls = new PointerLockControls( camera, document.body );
    // scene.add( controls.getObject() );
    // controls.lock();





    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    let controls = new FlyControls( camera, renderer.domElement );
    controls.movementSpeed = 10000000;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 12;
    controls.autoForward = false;
    controls.dragToLook = false;

    // Animate
    const clock = new THREE.Clock()
    renderer.render(scene, camera)

    const tick = () =>
    {
        // const elapsedTime = clock.getElapsedTime()

        // Update controls
        // controls.update()
        // controls.update( clock.getDelta() );

        const delta = clock.getDelta();
        // controls.movementSpeed = 0.33 * 1;
        controls.update( delta );

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
	});

</script>

<main>
	<canvas class="webgl"></canvas>
</main>

<style>
	.webgl {
		width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
	}

</style>