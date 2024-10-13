<script>

  import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
  import { fade } from 'svelte/transition';

  import * as THREE from 'three'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import * as dat from 'dat.gui';
  import isMobile from 'ismobilejs';

  import { FlyControls } from './universeControls';
  import { AsteroidGeometry } from './AsteroidGeometry'
  import Nearby from './nearby'

  import { storeControlsEnabled, storeShowIntro, storeAnimationArray, storeShowStahle, storeShowEasteregg, storeData, storeSearchItem } from './store.js';
  import Hud from './Hud.svelte'
  import Loading from './Loading.svelte'
  import DisplayAsteroid from './DisplayAsteroid.svelte'
  import DisplayPlanet from './DisplayPlanet.svelte'
  import Intro from './Intro.svelte'
  import Information from './Information.svelte'
  import Search from './Search.svelte'
  import Instructions from './Instructions.svelte'
  import Easteregg from './Easteregg.svelte'
  import Connection from './connection'
  import { activateFullScreen } from './helpers'

  import settings from './settings'

  // Languages
  import en from './i18n/en.json'
  import de from './i18n/de.json'

  // --- DEBUG: This removes textures for planets and background sound and activates dat.gui
  const debug = false
  // ---

  // ----------------------- Add i18n
  addMessages('en', en)
  addMessages('de', de)

  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
  });

  var loadingCounter = 0
  let activateControls = false
  var animationArray = []
  var hideableObjects = []
  var timerHideableObjects
  let audioAmbient
  var controlMouse;
  let huds = []
  var activeAsteroid = null

  // ----------------------- Init and registerStores
  let showIntro = true
  let showEasteregg = false
  let showInstructions = false  
  let searchItem = null

  storeControlsEnabled.subscribe(value => activateControls = value);
  storeShowIntro.subscribe(value => {
    showIntro = value

    // Play Audio
    if(!showIntro)
    {
      //TODO: Aktivieren!
      // console.log("MUSIK DEAKTIVIERT!")
      audioAmbient = new Audio('./sound/background.mp3');
      if(!debug) audioAmbient.play();
      showInstructions = true
      setTimeout(() => showInstructions = false, 10000)
    }
  });
  storeAnimationArray.subscribe(value => animationArray = value)
  storeShowEasteregg.subscribe(value => showEasteregg = value)
  storeSearchItem.subscribe(value => searchItem = value)
  
  // ----------------------- Add dat.gui
  const gui = new dat.GUI({name: 'Debug'});
  var stats
  if(debug)
  {
    stats = new Stats()
    stats.showPanel( 0 )
    document.body.appendChild( stats.dom );
  }
  if(!debug) gui.hide()

  // ----------------------- Fetch data json
  loadingCounter++;
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      storeData.set(data)
      const canvas = document.querySelector('canvas.webgl')

      // Subscribe intro click on astesroid 8713
      storeShowStahle.subscribe(value => {
        if(value) 
        {
          const active = asteroids.find(x => x.userData.id === 9021)
          addConnections(active)
          active.add(sound)
          sound.play()
        }
      })

      // On this object user is able to click (asteroids and planets)
      const groupClickable = new THREE.Group();

      // Scene
      const scene = new THREE.Scene()
      const textureLoader = new THREE.TextureLoader();

      // Path Helper
      // const vectors = [
      //     [ 0, 525000000, 0 ],
      //     [ 0, 525000000, -8273000 ],
      //     [ 316134, 525000000, -187672734],
      //     [ -332602038, 260559965, -462261069 ],
      // ]
      // var pipeSpline = new THREE.CatmullRomCurve3(vectors.map(vector => new THREE.Vector3( vector[0], vector[1], vector[2] )))
      // var tubeGeometry = new THREE.TubeGeometry( pipeSpline, 1000, 2000, 100, false );
      // var m = new THREE.Mesh(tubeGeometry, new THREE.MeshBasicMaterial({color: 'red'}))
      // scene.add(m)

      // Generate loaders depending on debug or production
      const loaders = []
      if(debug)
        settings.planetTexturesDebug.forEach(tx => loaders.push(textureLoader.load(`./textures/planets/${tx}`)))
      else
        settings.planetTextures.forEach(tx => loaders.push(textureLoader.load(`./textures/planets/${tx}`)))

      // Load the one special planet
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
      
      // ----------------------- With nearby we detect nearest asteroids as well as which ones are far enough to hide
      const nearbyFactor = 100000000
      const nearbyAsteroids = new Nearby(data.solarsystem_r * 2, data.solarsystem_r * 2, data.solarsystem_r * 2, nearbyFactor);
      const nearbyPlanets = new Nearby(data.solarsystem_r * 2, data.solarsystem_r * 2, data.solarsystem_r * 2, data.solarsystem_r);
      const nearbyVisible = new Nearby(data.solarsystem_r * 2, data.solarsystem_r * 2, data.solarsystem_r * 2, nearbyFactor * (isMobile(window.navigator).any ? 1 : 3));

      // ----------------------- Load planets based on data.json
      const planets = []
      loadingCounter++
      const texturePromis = Promise.all(loaders, (resolve, reject) => {
        resolve(texturePromis);
      }).then(textures => {

        // Textures Loaded. Create Planets

        for(let i in data.planets)
        {
          let planet = data.planets[i]

          var materialPlanet;

          // Is Lava planet? Then other textures
          if(planet.id === 40 && !debug) materialPlanet = materialPlanetLava
          else materialPlanet = new THREE.MeshPhongMaterial({map: textures[i % textures.length]});     

          // Create Sphere
          const geometry = new THREE.SphereGeometry( planet.size, 64, 64 );
          const sphere = new THREE.Mesh( geometry, materialPlanet );

          // Add user data for ray tracing
          sphere.userData.type = 'planet'
          sphere.userData.id = planet.id
          sphere.userData.name = planet.name
          sphere.userData.recipients = planet.recipients
          sphere.userData.value = planet.value

          sphere.position.set(planet.x, planet.y, planet.z)
          planets.push(sphere)
          groupClickable.add(sphere)

          // Add Nearby (for the hud)
          var box = nearbyPlanets.createBox(
            planet.x, planet.y, planet.z,
            planet.size, planet.size, planet.size
          );
          var object = nearbyPlanets.createObject(sphere, box);
          nearbyPlanets.insert(object);
          planet.mesh = sphere

        }
        loadingCounter++
      })

      // ----------------------- Create Asteroids based on data.json
      const color = '#edc99d';
      const materialAsteroid = new THREE.MeshStandardMaterial({color:color, roughness: 0.8, metalness: 0.8});
      materialAsteroid.flatShading = true

      let asteroids = []
      var moonCount = 0
      loadingCounter++
      for(let i in data.asteroids)
      {
        let p = data.asteroids[i]

        // Generate Astroid
        // https://codepen.io/Divyz/pen/VPrZMy
        var geometry = new AsteroidGeometry(p.size, 1);
        var mesh = new THREE.Mesh( geometry, materialAsteroid ); 

        mesh.position.set(p.x, p.y, p.z)

        // Add Userdata
        mesh.userData.from = p['from']
        mesh.userData.type = 'asteroid'
        mesh.userData.name = p.name
        mesh.userData.id = p.id

        asteroids.push(mesh)

        // Add only every second "moon" (asteroids with one recipient) to the hideableObjects. So we still see the asteroid beld around a planet
        if(p.type == 'moon') moonCount++
        if(p.type == 'asteroid' && p.size < 900000) hideableObjects.push(mesh)
        if(p.type == 'moon' && moonCount % 2 == 0) hideableObjects.push(mesh)

        // Add Nearby
        var box = nearbyAsteroids.createBox(
          p.x, p.y, p.z,
          p.size, p.size, p.size
        );
        var object = nearbyAsteroids.createObject(mesh, box);
        nearbyAsteroids.insert(object);
        nearbyVisible.insert(object);
        p.mesh = mesh

      }
      loadingCounter = 0

      // ----------------------- Add light
      const light = new THREE.PointLight( 0xffffff, 1 );
      const ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 );
      light.position.y = data.solarsystem_r / 2
      scene.add( light );
      scene.add( ambientLight );

      // ----------------------- Add Easteregg
      if(!debug)
      {
        const eeLoader = new THREE.ObjectLoader();
        loadingCounter++
        eeLoader.load('./mesh/f35/lightning.obj', function(loadedObj, materials) {
          loadedObj.position.set(717387321, 300192394, 188333836)
          loadedObj.scale.set(200000, 200000, 200000)
          loadedObj.rotation.y = 1.5
          loadedObj.userData = {type: 'easteregg'}
          loadedObj.children.forEach(m => m.userData = loadedObj.userData)
          groupClickable.add(loadedObj)
          hideableObjects.push(loadedObj)

          // Add Nearby
          var box = nearbyVisible.createBox(
            loadedObj.position.x, loadedObj.position.y, loadedObj.position.z,
            200000, 200000, 200000
          );

          // Add to nearbylist
          var object = nearbyVisible.createObject(loadedObj, box); 
          nearbyVisible.insert(object);
          loadingCounter--
        })
      }

      // ----------------------- Add Asteroids to scene
      asteroids.forEach(p => groupClickable.add(p))
      scene.add(groupClickable)

      // ----------------------- Register Resize
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

      // ----------------------- Add Fullsize event
      document.addEventListener('dblclick', activateFullScreen)

      // ----------------------- Add Camera
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1000, data.solarsystem_r * 2)
      scene.add(camera)
      camera.position.y = data.solarsystem_r / 2

      // ----------------------- Add to dat.gui
      var guiCamera = gui.addFolder('camera')
      guiCamera.open();
      guiCamera.add(camera.position, 'x').listen();
      guiCamera.add(camera.position, 'y').listen();
      guiCamera.add(camera.position, 'z').listen();   
      var test = {'showall': () => {
        clearInterval(timerHideableObjects)
        hideableObjects.forEach(o => o.visible = true)

      }} 
      gui.add(test, "showall")

      // ----------------------- Load background texture
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

      // ----------------------- Renderer
      const renderer = new THREE.WebGLRenderer({
          canvas: canvas
      })
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // ----------------------- Detect if mobile (motion sensor) or mouse
      if(isMobile(window.navigator).any)
      {
        controlMouse = new FlyControls( camera, renderer.domElement, true );
      }
      else
      {
        controlMouse = new FlyControls( camera, renderer.domElement, false );
      }

      controlMouse.movementSpeed = 40000000;
      controlMouse.domElement = renderer.domElement;
      controlMouse.rollSpeed = Math.PI / 12;
      controlMouse.autoForward = false;
      controlMouse.dragToLook = false;

      // ----------------------- Add Audio
      const listener = new THREE.AudioListener();
      camera.add( listener );
      const sound = new THREE.PositionalAudio( listener );
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load( 'sound/asteroid.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setRefDistance( 6000000 );
      });    

      // ----------------------- Decide, which asteroids are far enough and hide them
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

      const addSearchItem = () => {
        if(!searchItem) return null

        var pos = searchItem.mesh.position.clone()
        pos.project(camera);

        pos.x = ( pos.x * sizes.width / 2 ) + sizes.width / 2;
        pos.y = - ( pos.y * sizes.height / 2 ) + sizes.height / 2;        

        let left = pos.x
        let top = pos.y
        if(pos.z >= 1)
        {
          left = left * -1
          top = top * -1
        }

        left = Math.max(left, 15)
        left = Math.min(left, sizes.width - 15)

        top = Math.max(top, 15)
        top = Math.min(top, sizes.height - 15)

        let distance = camera.position.distanceTo(searchItem.mesh.position)
        let label = searchItem.mesh.userData.name

        // If near, remove item
        if(distance  / 10000 < 800)
          storeSearchItem.set(null)

        return {
          top: top,
          left: left,
          distance: Math.round(distance / 10000),
          label: label,
          type: 'search'
        }
      }
      
      // ----------------------- Animate
      const clock = new THREE.Clock()

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

          // Nearby check
          const localhuds = []
          var nearresultAsteroids = nearbyAsteroids.query(camera.position.x, camera.position.y, camera.position.z);
          var rearresultPlanets = nearbyPlanets.query(camera.position.x, camera.position.y, camera.position.z);

          addNearbies(nearresultAsteroids, 6, 'asteroid', localhuds)
          addNearbies(rearresultPlanets, 10, 'planet', localhuds)

          huds = localhuds

          // Add Search Hud if any
          const searchHud = addSearchItem()
          if(searchHud) huds.push(searchHud)

          // Run all animations
          animationArray.forEach(a => {
            if(!a.tick(camera))
            {
              // Animation has finished. Remove
              animationArray.splice(animationArray.indexOf(a), 1)
              storeAnimationArray.set(animationArray)
            }
          })

          if(animationArray.length === 0 && activateControls)
          {
            controlMouse.update( delta )
          }

          // Render
          composer.render();

          if(stats) stats.update();

          // Call tick again on the next frame
          window.requestAnimationFrame(tick)
      }

      // ----------------------- Raycaster
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      canvas.addEventListener('click', e => {
        pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( groupClickable.children, true );
        
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
            sound.setVolume(8)
            setTimeout(() => addConnections(active), 0)
          }
          else if(active.userData.type == 'asteroid')
          {
            activeAsteroid = {
              name: active.userData.name,
              id: active.userData.id,
              type: 'asteroid'
            }
            active.add(sound)
            sound.play()
            sound.setVolume(1)
            setTimeout(() => addConnections(active), 0)
          }
          else if(active.userData.type == 'easteregg')
          {
            console.log("EASTER")
            audioAmbient.pause()
            storeShowEasteregg.set(true)

            let audioBonus = new Audio('./sound/t1.mp3');
            audioBonus.play();
          }
        }
        else 
        {
          activeAsteroid = null
          removeConnections()
          if(sound.parent) sound.stop()
        }

      }, false);

      // ----------------------- The rays from asteroids to planets
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

      // ----------------------- Nearbychecker
      timerHideableObjects = setInterval(() => {

        hideableObjects.forEach(o => o.visible = false)
        // hideableObjects.forEach(o => o.material = materialTest)

        let nearbyMeshes = [...nearbyVisible.query(camera.position.x, camera.position.y, camera.position.z).keys()]
        // Now calculate distance to each Object
        for(var i in nearbyMeshes)
        {
          const mesh = nearbyMeshes[i].id
          // mesh.material = materialAsteroid
          mesh.visible = true
        }      

      }, 500)

      // Everything loaded
      loadingCounter--
    });

</script>

<main>
  {#if loadingCounter > 0}
    <Loading />
  {/if}
  {#if showInstructions}
    <div transition:fade style='position:absolute;left:50%;transform: translateX(-50%);z-index: 1000'><Instructions /></div>
  {/if}
  {#if showIntro}
    <Intro />
  {/if}
  {#if !showIntro}
    <Information />
    <Search/>
  {/if}
  {#if showEasteregg}
    <Easteregg />
  {/if}
  {#if !showIntro && isMobile(window.navigator).any}
    <!-- <MobileControls controlMouse = {controlMouse} /> -->
  {/if}

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