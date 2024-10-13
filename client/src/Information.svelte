<script>
    import { _ } from 'svelte-i18n'
    import { storeControlsEnabled } from './store.js';

    var showInfobox = false
</script>
    
<div class='information' on:click={() => {
  showInfobox = true
  storeControlsEnabled.set(false)
}}>
  <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 208 512.58">
    <path fill="white" fill-rule="nonzero" d="M143.35 447.55H208v65.03H0v-65.03h63.78V242.78H0v-65.03h143.35v269.8zM81.39 114.09c-15.68-.11-29.09-5.62-40.36-16.76-11.26-11.11-16.76-24.65-16.76-40.48 0-15.55 5.5-28.95 16.76-40.09C52.3 5.63 65.71 0 81.39 0c15.42 0 28.82 5.63 40.1 16.76C132.88 27.9 138.5 41.3 138.5 56.85c0 10.46-2.67 20.12-7.9 28.69-5.23 8.71-12.08 15.7-20.64 20.79-8.59 5.09-18.12 7.65-28.57 7.76z"/></svg>
</div>

{#if showInfobox}
  <div class='infobox informationbox'>
    <h2>{$_('infobox.title')}</h2>
    <p>
      {@html $_('infobox.text')}
    </p>
    <div class='buttons'>
      <button class='tour' on:click={() => {
        showInfobox = false
        storeControlsEnabled.set(true)
      }}>{$_('infobox.goon')}</button>
    </div>
  </div>
{/if}

<style>
  .information
  {
    z-index: 1000;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 22px;
    height: 22px;
    background: #245050;
    border: 1px solid #419696;
    opacity: 1;
    padding: 4px;
    cursor: pointer;
  }

  .information svg
  {
    position: relative;
    height: 100%;
    left: 6px;
  }

  .informationbox
  {
    z-index: 1000;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    max-width: 100vw;
    border: 1px solid #419696;

  }
</style>