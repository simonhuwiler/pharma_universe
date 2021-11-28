<script>

	// import './style.css'
  import { onMount } from 'svelte';
  import { addMessages, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

  import * as THREE from 'three'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import * as dat from 'dat.gui';

  import { FlyControls } from './universeControls';
  import { PathAnimation } from './pathanimation'
  import { AsteroidGeometry } from './AsteroidGeometry'
  import Nearby from './nearby'

  import Hud from './Hud.svelte'
  import DisplayAsteroid from './DisplayAsteroid.svelte'
  import DisplayPlanet from './DisplayPlanet.svelte'
  import Connection from './connection'

  import data from './data'
  import settings from './settings'

  // Languages
  import en from './i18n/en.json'
  import de from './i18n/de.json'

  addMessages('en', en)
  addMessages('de', de)

  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
  });
  

  // --- DEBUG
  const debug = true
  // ---
  
  let huds = []
  var activeAsteroid = null

  // Add Gui
  const gui = new dat.GUI({name: 'My GUI'});
  if(!debug) gui.hide()

  onMount(async () => {
    const canvas = document.querySelector('canvas.webgl')

    const groupClickable = new THREE.Group();

    // Scene
    const scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader();

    // Generate loaders
    const loaders = []
    if(debug)
      settings.planetTexturesDebug.forEach(tx => loaders.push(textureLoader.load(`./textures/planets/${tx}`)))
    else
      settings.planetTextures.forEach(tx => loaders.push(textureLoader.load(`./textures/planets/${tx}`)))

    // Load Special Planet
    var materialPlanetLava = null
    if(!debug)
    {
      materialPlanetLava = new THREE.MeshPhongMaterial({map: textureLoader.load(`./textures/lava/l00kFoivOUCl2OUtQVZVZQ_4K_Albedo.jpg`)});
      materialPlanetLava.metalnessMap = textureLoader.load(`./textures/lava/l00kFoivOUCl2OUtQVZVZQ_4K_Metalness.jpg`)
      materialPlanetLava.normalMap = textureLoader.load(`./textures/lava/l00kFoivOUCl2OUtQVZVZQ_4K_Normal.jpg`)
      materialPlanetLava.roughnessMap = textureLoader.load(`./textures/lava/l00kFoivOUCl2OUtQVZVZQ_4K_Roughness.jpg`)
      materialPlanetLava.emissiveMap = textureLoader.load(`./textures/lava/l00kFoivOUCl2OUtQVZVZQ_4K_Emissive.jpg`)
      materialPlanetLava.displacementMap = textureLoader.load(`./textures/lava/l00kFoivOUCl2OUtQVZVZQ_4K_Displacement.jpg`)
      materialPlanetLava.aoMap = textureLoader.load(`./textures/lava/l00kFoivOUCl2OUtQVZVZQ_4K_AO.jpg`)
    }
    
    const nearbyFactor = 100000000
    const nearbyAsteroids = new Nearby(data.solarsystem_r * 2, data.solarsystem_r * 2, data.solarsystem_r * 2, nearbyFactor);
    const nearbyPlanets = new Nearby(data.solarsystem_r * 2, data.solarsystem_r * 2, data.solarsystem_r * 2, data.solarsystem_r);
    const planets = []
    const texturePromis = Promise.all(loaders, (resolve, reject) => {
      resolve(texturePromis);
    }).then(textures => {

      // Textures Loaded. Create Planets
      console.log("Load Planets")


      for(let i in data.planets)
      {
        let planet = data.planets[i]

        var materialPlanet;
        // Create Material
        if(planet.id === 40 && !debug)
        {
          // Lava planet
          materialPlanet = materialPlanetLava
        }
        else
        {
          // materialPlanet = new THREE.MeshPhongMaterial({map: textures[0]});
          materialPlanet = new THREE.MeshPhongMaterial({map: textures[i % textures.length]});     
        }  

        // Create Sphere
        const geometry = new THREE.SphereGeometry( planet.size, 64, 64 );
        const sphere = new THREE.Mesh( geometry, materialPlanet );

        sphere.userData.type = 'planet'
        sphere.userData.id = planet.id
        sphere.userData.name = planet.name
        sphere.userData.recipients = planet.recipients
        sphere.userData.value = planet.value

        sphere.position.set(planet.x, planet.y, planet.z)
        planets.push(sphere)
        groupClickable.add(sphere)

        // Add Nearby
        var box = nearbyPlanets.createBox(
          planet.x, planet.y, planet.z,
          planet.size, planet.size, planet.size
        );
        var object = nearbyPlanets.createObject(sphere, box);
        nearbyPlanets.insert(object);

      }
    })

    var color = '#edc99d';
    var material = new THREE.MeshStandardMaterial({color:color, roughness: 0.8, metalness: 1});
    // var material = new THREE.MeshPhongMaterial({color:color, roughness: 0.8, metalness: 1});
    material.flatShading = true

    let asteroids = []
    for(let i in data.asteroids)
    {
      let p = data.asteroids[i]

      // Generate Astroid
      // https://codepen.io/Divyz/pen/VPrZMy
      var geometry = new AsteroidGeometry(p.size, 1);
      var mesh = new THREE.Mesh( geometry, material ); 

      mesh.position.set(p.x, p.y, p.z)

      // Add Userdata
      mesh.userData.from = p['from']
      mesh.userData.type = 'asteroid'
      mesh.userData.name = p.name
      mesh.userData.id = p.id

      asteroids.push(mesh)

      // Add Nearby
      var box = nearbyAsteroids.createBox(
        p.x, p.y, p.z,
        p.size, p.size, p.size
      );
      var object = nearbyAsteroids.createObject(mesh, box);
      nearbyAsteroids.insert(object);      

    }

    asteroids.forEach(p => groupClickable.add(p))

    scene.add(groupClickable)

    const light = new THREE.PointLight( 0xffffff, 1 );
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 );
    light.position.y = data.solarsystem_r / 2
    scene.add( light );
    scene.add( ambientLight );

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

    document.addEventListener('dblclick', () => {
      var elem = document.querySelector('main')
       if (elem.requestFullscreen) {
          elem.requestFullscreen();
       } else if (elem.mozRequestFullScreen) {
          /* Firefox */
          elem.mozRequestFullScreen();
       } else if (elem.webkitRequestFullscreen) {
          /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen();
       } else if (elem.msRequestFullscreen) {
          /* IE/Edge */
          elem.msRequestFullscreen();
       }
       elem.style.width = '100%';
       elem.style.height = '100%';      
    })

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1000, data.solarsystem_r * 2)
    scene.add(camera)
    camera.position.y = data.solarsystem_r / 2

    // Add to Debug Gui
    var guiCamera = gui.addFolder('camera')
    guiCamera.open();
    const guiDataCamera = {x: 0, y: 0, z: 0}
    guiCamera.add(camera.position, 'x').listen();
    guiCamera.add(camera.position, 'y').listen();
    guiCamera.add(camera.position, 'z').listen();    

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      // https://opengameart.org/content/space-skybox-0
      './textures/skybox/1.png',
      './textures/skybox/3.png',
      './textures/skybox/5.png',
      './textures/skybox/6.png',
      './textures/skybox/2.png',
      './textures/skybox/4.png',
    ]);
    scene.background = texture;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    let controls = new FlyControls( camera, renderer.domElement );
    controls.movementSpeed = 40000000;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 12;
    controls.autoForward = false;
    controls.dragToLook = false;

    // Add Audio
    const listener = new THREE.AudioListener();
    camera.add( listener );
    const sound = new THREE.PositionalAudio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/asteroid.mp3', function( buffer ) {
      sound.setBuffer( buffer );
	    sound.setLoop(true);
      sound.setRefDistance( 6000000 );
    });    

    // Animate
    const clock = new THREE.Clock()
    const animationArray = []

    var currentTime = 0;

    // ANIMATION TEST _________________
    // view-source: https://threejs.org/examples/#webgl_geometry_extrude_splines

    const anim = new PathAnimation(camera, [
      [ 474002736, 131250000, 183629638 ],
      [ -446655920, 306250000, 591468026 ],
      [ 75628313, 656250000, -816159479 ],
    ])

    // animationArray.push(anim)

    const addNearbies = (nearbyMeshes, max, type, results) => {

      // Get all nearby Object
      var nearbyMeshes = [...nearbyMeshes.keys()]

      // Now calculate distance to each Object
      for(var i in nearbyMeshes)
      {
        const mesh = nearbyMeshes[i].id
        mesh.userData.distance = camera.position.distanceTo(mesh.position)
      }

      // Now sort by distance
      nearbyMeshes.sort((a, b) => a.id.userData.distance > b.id.userData.distance ? 1 : -1)

      var i = 0;
      for(let m in nearbyMeshes)
      {
        i++
        const mesh = nearbyMeshes[m].id
        var pos = mesh.position.clone()
        pos.project(camera);
        if(pos.z >= 1) continue

        pos.x = ( pos.x * sizes.width / 2 ) + sizes.width / 2;
        pos.y = - ( pos.y * sizes.height / 2 ) + sizes.height / 2;

        if(pos.x < 0 || pos.x > sizes.width || pos.y < 0 || pos.y >= sizes.height) continue

        results.push({
          top: pos.y,
          left: pos.x,
          distance: Math.max(100 - Math.round(100 / nearbyFactor * mesh.userData.distance), 0),
          label: mesh.userData.name,
          type: type
        });
        if(i >= max) break
      }
    }

    const tick = () =>
    {
        const delta = clock.getDelta();
        camera.updateWorldMatrix()
        // Rotate Planets
        planets.forEach(p => p.rotation.y += 0.02 * delta)

        // Leave Universe?
        if(Math.max(Math.abs(camera.position.x), Math.abs(camera.position.y), Math.abs(camera.position.z)) > data.solarsystem_r)
        {
          console.log("Leaving Universe!")
        }

        

        // Nearby
        const localhuds = []
        var nearresultAsteroids = nearbyAsteroids.query(camera.position.x, camera.position.y, camera.position.z);
        var rearresultPlanets = nearbyPlanets.query(camera.position.x, camera.position.y, camera.position.z);

        addNearbies(nearresultAsteroids, 6, 'asteroid', localhuds)
        addNearbies(rearresultPlanets, 10, 'planet', localhuds)

        huds = localhuds

        // Run all animations
        animationArray.forEach(a => {
          if(!a.tick())
          {
            // Animation has finished. Remove
            animationArray.splice(animationArray.indexOf(a), 1)
          }
        })

        if(animationArray.length === 0) controls.update( delta )

        // Render
        composer.render();

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }


    // Raycaster
    const raycaster = new THREE.Raycaster();
		const pointer = new THREE.Vector2();
    canvas.addEventListener('click', e => {
      pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
      raycaster.setFromCamera( pointer, camera );
      const intersects = raycaster.intersectObjects( groupClickable.children );
      
      if(intersects.length > 0)
      {
        let active = intersects[0].object

        if(active.userData.type == 'planet')
        {
          activeAsteroid = {
            name: active.userData.name,
            id: active.userData.id,
            value: active.userData.value,
            recipients: active.userData.recipients,
            type: 'planet'
          }
          active.add(sound)
          sound.play()
        }
        else
        {
          activeAsteroid = {
            name: active.userData.name,
            id: active.userData.id,
            type: 'asteroid'
          }
          active.add(sound)
          sound.play()
        }

        setTimeout(() => addConnections(active), 0)
        
      }
      else 
      {
        activeAsteroid = null
        removeConnections()
          if(sound.parent) sound.stop()
      }

    }, false);

    function addConnections(active)
    {
      removeConnections()

      if(active.userData.type == 'planet') var planets = data.asteroids.filter(p => p.from.includes(active.userData.id))
      else var planets = data.planets.filter(p => active.userData.from.includes(p.id))

      const source = active.position

      // Add it badgeSize to reduce lag
      const badgeSize = 50
      const connectionTimer = setInterval(() => {
        planets.forEach((p, i) => {
          if(i >= badgeSize) return false
          addConnection(source, new THREE.Vector3(p.x, p.y, p.z), p[' '])
        })

        planets.splice(0, badgeSize)

        if(planets.length <= 0)
          clearInterval(connectionTimer)

      }, 50)

    }

    // Create Composer
    const composer = new EffectComposer( renderer )
    composer.addPass(new RenderPass( scene, camera ))

    // Create Connections
    var connections = []

    const addConnection = (p1, p2) => {
      const c = new Connection(scene, camera, composer, p1, p2)
      connections.push(c)
      c.update(0)
    }

    const removeConnections = () => {
      connections.forEach(c => c.remove())
      connections = []
    }

    tick()

	});





</script>

<main>
  <!-- <button on:click={ () => ($locale = 'en') } style='position: absolute; right: 0; bottom: 0;z-index:99999'> Click here to change to spanish </button> -->
  <div class='infoboxes'>
    {#if activeAsteroid}
      {#if activeAsteroid.type == 'asteroid' && debug === false}

        <DisplayAsteroid 
          name={activeAsteroid.name}
          id={activeAsteroid.id}
        />

      {:else if activeAsteroid.type === 'planet'}

        <DisplayPlanet 
          name={activeAsteroid.name}
          id={activeAsteroid.id}
          value={activeAsteroid.value}
          recipients={activeAsteroid.recipients}
        />

      {/if}
    {/if}
  </div>

  <div class='hud'>    
    {#each huds as h}
      <Hud
      top={h.top}
      left={h.left}
      distance={h.distance}
      label={h.label}
      type={h.type}  
    />
    {/each}
  </div>

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
    z-index: 1;
    overflow: hidden;
	}

  .hud
  {
    position: absolute;
    width: 100%;
    pointer-events: none;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }

  .infoboxes
  {
    z-index: 3;
  }

</style>