<script>
    import { _ } from 'svelte-i18n'
    import { storeData, storeSearchItem, storeControlsEnabled } from './store.js';

    var showSearchbox = false
    var data = null
    var searchResults = []
    var moreThan10 = false
    storeData.subscribe(value => data = value);

    const inputChange = e => {
      let search = e.target.value
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
  <img src='./images/search.png' alt='Suchen' />
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
    <div class='buttons'>
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
    z-index: 1000;
    position: absolute;
    top: 50px;
    right: 10px;
  }

  .search img
  {
    width: 30px;
    opacity: 0.8;
    cursor: pointer;
  }

  .searchbox
  {
    z-index: 1000;
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
    width: 450px;
    max-width: 100vw;
  }

  @media (min-width: 800px) {
    .searchbox
    {
      top: 30%;
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