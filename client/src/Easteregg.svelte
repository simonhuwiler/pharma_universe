<script>
    import { _ } from 'svelte-i18n'
  import { storeShowEasteregg } from './store.js';

</script>
    
<div class='infobox easterbox'>
  <h2>{$_('easteregg.title')}</h2>
  <p>
    {@html $_('easteregg.text')}
  </p>
  <div class='buttons'>
    <button class='tour' on:click={() => storeShowEasteregg.set(false)}>{$_('infobox.goon')}</button>
  </div>
</div>

<style>
  .easterbox
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