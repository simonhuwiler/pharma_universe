<script>
	// import './style.css'
  import { onMount } from 'svelte';
  import * as THREE from 'three'
  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  // import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
	// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
  import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
  import { AsteroidGeometry } from './AsteroidGeometry'
  import data from './data'
  import settings from './settings'

  onMount(async () => {
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader();

    const r_factor = 1

    const materialMoon = new THREE.MeshPhongMaterial( {
      map: textureLoader.load( "./textures/planets/terrestrial1.png" )
    } );

    // Generate loaders
    const loaders = []
    for(let tx in settings.planetTextures)
    {
      loaders.push(textureLoader.load(`./textures/planets/${tx}`))
    }

    const texturePromis = Promise.all(loaders, (resolve, reject) => {
        resolve(texturePromis);
    }).then(result => {
      console.log("loaded", result)
        // result in array of textures
    }).catch(result => {
      console.log(result)
    });

    var planets = []
    for(let i in data.planets)
    {
      let planet = data.planets[i]

      // Create Sphere
      // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      const geometry = new THREE.SphereGeometry( planet.size, 32, 16 );
      const sphere = new THREE.Mesh( geometry, materialMoon );

      sphere.position.set(planet.x, planet.y, planet.z)
      planets.push(sphere)

    }


    var color = '#edc99d';
    // color = ColorLuminance(color,2+Math.random()*10);
    var material = new THREE.MeshStandardMaterial({color:color, roughness: 0.8, metalness: 1});
    material.flatShading = true    

    let asteroids = []
    var c = 0
    for(let i in data.asteroids)
    {

      // https://codepen.io/Divyz/pen/VPrZMy

      var size = 10
      var geometry = new AsteroidGeometry(size, 1);

      
      const mesh = new THREE.Mesh( geometry, material );
      let p = data.asteroids[i]
      mesh.position.set(p.x, p.y, p.z)
      var scale = 200000
      mesh.scale.set(scale, scale, scale)

      asteroids.push(mesh)

      c++
      if(c > 5000) break

    }

    asteroids.forEach(p => scene.add(p))
  
   

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
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1000, 1000000000)
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