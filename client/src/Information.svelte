<script>
    import { _ } from 'svelte-i18n'
    import { storeControlsEnabled } from './store.js';

    var showInfobox = false
</script>
    
<div class='information' on:click={() => {
  showInfobox = true
  storeControlsEnabled.set(false)
}}>
  <img src='./images/information.png' alt='Information' />
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
  }

  .information img
  {
    width: 30px;
    opacity: 0.8;
    cursor: pointer;
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
  }
</style>