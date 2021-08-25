<script>
	// import './style.css'
  import { onMount } from 'svelte';
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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




    const r = 100
    const teilkreise = 10
    const n = 50

    var planets = []
    
    
    for(let i = 0; i < n - 1; i++)
    {
      // Create Sphere
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      const geometry = new THREE.SphereGeometry( 5, 32, 16 );
      const sphere = new THREE.Mesh( geometry, material );

      // console.log()
      let y = Math.floor(Math.floor((i + 1) / (n / teilkreise))) * (r / teilkreise) + (r / teilkreise) / 2
      let h = y <= (r / 2) ? y : r - y
      console.log(h, y)
      let r_new = Math.sqrt(2 * r * h - Math.pow(h, 2))

      let items = n / teilkreise

      let step = Math.PI * 2 / items
      let angle = (i % items) * step
      let x = r_new * Math.cos(angle)
      let z = r_new * Math.sin(angle)
      
      sphere.position.set(x, y, z)
      // console.log(r_new, x,y, z)
      planets.push(sphere)

    }

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
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
    camera.position.y = r / 2
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

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