<script>
    import { _ } from 'svelte-i18n'
    import * as THREE from 'three'
    import { storeData, storeSearchItem, storeControlsEnabled } from './store.js';

    var showSearchbox = false
    var data = null
    var searchResults = []
    var moreThan10 = false
    storeData.subscribe(value => data = value);

    const inputChange = e => {
      let search = e.target.value

      if(search == 'easteregg')
      {
        showSearchbox = false
        storeControlsEnabled.set(true)

        storeSearchItem.set({
          mesh: {
            userData: {name: 'Easter Egg'},
            position: new THREE.Vector3(520553212, 563734939, -703080680)
          }
        })
        return
      }

      if(search.length > 0)
      {
        // Search Planets
        const filteredPlanets = data.planets.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        const filteredAsteroids = data.asteroids.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        let filtered = filteredPlanets.concat(filteredAsteroids)

        // Sort
        filtered.sort((a, b) => a.name > b.name ? 1 : -1)

        moreThan10 = filtered.length > 10
        filtered = filtered.slice(0, 10)
        searchResults = filtered

      }
      else searchResults = []
    }
</script>
    
<div class='search' on:click={() => {
    showSearchbox = true
    storeControlsEnabled.set(false)
  }}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88">
    <defs><style>.cls-1{fill-rule:evenodd;}</style></defs>
    <path class="cls-1" fill='white' d="M42.31,0A42.31,42.31,0,0,1,77.52,65.75l8.56,8.56.09-.09a5.38,5.38,0,0,1,7.59,0l27.55,27.55a5.39,5.39,0,0,1,0,7.59l-12,12a5.39,5.39,0,0,1-7.59,0L74.22,93.76a5.38,5.38,0,0,1,0-7.59l.09-.09-8.56-8.56A42.31,42.31,0,1,1,42.31,0Zm0,9.5A32.81,32.81,0,1,1,9.5,42.31,32.81,32.81,0,0,1,42.31,9.5Z"/>
  </svg>
</div>

{#if showSearchbox}
  <div class='infobox searchbox'>
    <h2>{$_('search.title')}</h2>
    <p>
      <input type='text' placeholder={$_('search.placeholder')} on:input={inputChange} autofocus={true}/>
    </p>
    {#if searchResults.length == 0}
      <span>{$_('search.nothingfound')}</span>
    {:else}
      <ul>
        {#each searchResults as item}
          <li on:click={() => {
            showSearchbox = false
            storeSearchItem.set(item)
            searchResults = []
            moreThan10 = false
            storeControlsEnabled.set(true)
          }}>{item.name}</li>
        {/each}
      </ul>
    {/if}
    {#if moreThan10}
      <span>{$_('search.morethan10')}</span>
    {/if}
    <div class="buttonsSide">
      <button class='tour' on:click={() => {
        showSearchbox = false
        searchResults = []
        moreThan10 = false
        storeControlsEnabled.set(true)
      }}>{$_('infobox.goon')}</button>
    </div>
  </div>
{/if}

<style>
  .search
  {
    z-index: 800;
    position: absolute;
    top: 50px;
    right: 10px;
    width: 22px;
    height: 22px;
    background: #245050;
    border: 1px solid #419696;
    border-radius: 4px;
    opacity: 1;
    padding: 4px;    
    cursor: pointer;
  }

  .search svg
  {
    width: 100%;
  }  

  .searchbox
  {
    position: absolute;
    background-color: #131313;
    z-index: 1000;
    width: 500px;
    max-width: 100%;
    top: 40%;
    right: 10px;
    padding: 20px;
    border: 5px solid #131313;
    border-radius: 7px;

    font-family: "Lexend", sans-serif;
    font-size: 1.1em;
    font-weight: 200;
    color: white;    
  }

  /* Landscape */
  @media (max-width: 1100px) {
    .searchbox {
      top: 10px;
      font-size: 1em;
      overflow-y: scroll;
      max-height: 100vh;
      margin: 10px;
      box-sizing: border-box;
    }
  }  

  @media (max-width: 800px) {
    .searchbox {
      font-size: 1em;
      padding: 10px;
      margin: 0px;
      box-sizing: border-box;
      overflow-x: scroll;
      max-height: 100vh;
      bottom: 0;
      top: initial;
      right: initial;
    }
  }  

  .searchbox input
  {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border-radius: 0;
    border: 1px solid grey;
    background-color: rgb(196, 196, 196);
  }

  span
  {
    font-style: italic;
  }

  ul
  {
    padding: 0 0 5px 0;
    margin: 0;
  }

  ul li
  {
    list-style-type: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  li:hover
  {
    text-decoration: underline;;
  }
</style>