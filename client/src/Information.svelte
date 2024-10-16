<script>
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n'
  import { storeControlsEnabled } from './store.js';
  import { storeChapter } from './store.js';

  var showInfobox = false
</script>
    
<div class='information' on:click={() => {
  
  storeChapter.set(97)
  storeControlsEnabled.set(false)
  setTimeout(() => showInfobox = true, 2000)
  
}}>
  <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 208 512.58">
    <path fill="white" fill-rule="nonzero" d="M143.35 447.55H208v65.03H0v-65.03h63.78V242.78H0v-65.03h143.35v269.8zM81.39 114.09c-15.68-.11-29.09-5.62-40.36-16.76-11.26-11.11-16.76-24.65-16.76-40.48 0-15.55 5.5-28.95 16.76-40.09C52.3 5.63 65.71 0 81.39 0c15.42 0 28.82 5.63 40.1 16.76C132.88 27.9 138.5 41.3 138.5 56.85c0 10.46-2.67 20.12-7.9 28.69-5.23 8.71-12.08 15.7-20.64 20.79-8.59 5.09-18.12 7.65-28.57 7.76z"/></svg>
</div>

{#if showInfobox}
  <div class='slide' transition:fade={{ duration: 200 }}>
    <div class='content'>
      <h2>{$_('infobox.title')}</h2>
      <p>{@html $_('infobox.text1')}</p>
      <h2>{@html $_('infobox.title1')}</h2>
      <p>{@html $_('infobox.text2')}</p>
      <h2>{@html $_('infobox.title2')}</h2>
      <p>{@html $_('infobox.text3')}</p>
      <p>{@html $_('infobox.text4')}</p>

      <div class='buttonsSide'>
        <button class='tour' on:click={() => {
          showInfobox = false
          storeControlsEnabled.set(true)
          storeChapter.set(99)
        }}>{$_('infobox.goon')}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .information
  {
    z-index: 800;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 22px;
    height: 22px;
    background: #245050;
    border: 1px solid #419696;
    opacity: 1;
    border-radius: 4px;
    padding: 4px;
    cursor: pointer;
  }

  .information svg
  {
    position: relative;
    height: 100%;
    left: 6px;
  }

  .slide {
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
  }

  .slide .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    max-width: 100%;
    width: 1000px;
    font-family: "Lexend", sans-serif;
    font-size: 1.2em;
    font-weight: 200;
    color: white;
  }

  @media (max-width: 1100px) {
    .slide .content {
      font-size: 1em;
      padding: 10px;
      box-sizing: border-box;
      overflow-x: auto;
      max-height: 100vh;
    }
  }


</style>