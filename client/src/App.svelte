<script>
	// import './style.css'
  import { onMount } from 'svelte';
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
  import data from './data'

  onMount(async () => {
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

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

    var planets = []
    for(let i in data.planets)
    {
      let planet = data.planets[i]

      // Create Sphere
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      const geometry = new THREE.SphereGeometry( 12000, 32, 16 );
      const sphere = new THREE.Mesh( geometry, material );

      sphere.position.set(planet.x, planet.y, planet.z)
      planets.push(sphere)

    }


    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const geometry = new THREE.SphereGeometry( 2, 32, 16 );

    // for(let i in data.asteroids)
    // {
    //   // Create Sphere

    //   const sphere = new THREE.Mesh( geometry, material );

    //   let planet = data.asteroids[i]

    //   sphere.position.set(planet.x, planet.y, planet.z)
    //   // console.log(r_new, x,y, z)
    //   planets.push(sphere)

    // }

    
    console.log("ye2s")



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
    camera.position.y = 200//data.solarsystem_r / 2
    console.log(camera.position.y)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.target.set(data.planets[0].x, data.planets[0].y, data.planets[0].z);
    // const controls = new FirstPersonControls( camera, canvas );
    // controls.movementSpeed = 150;
    // controls.lookSpeed = 0.1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Animate
    const clock = new THREE.Clock()

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()

        // Update controls
        controls.update()

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