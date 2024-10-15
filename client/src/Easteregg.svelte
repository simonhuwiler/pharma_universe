<script>
  import { _ } from 'svelte-i18n'
  import { storeShowEasteregg } from './store.js';

</script>
    
<div class='infobox easterbox'>
  <h2>{$_('easteregg.title')}</h2>
  <p>
    {@html $_('easteregg.text')}
  </p>
  <div class='buttonsSide'>
    <button class='tour' on:click={() => storeShowEasteregg.set(false)}>{$_('infobox.goon')}</button>
  </div>
</div>

<style>
  .easterbox
  {
    position: absolute;
    background-color: #131313;
    z-index: 1000;
    width: 500px;
    max-width: 100%;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    padding: 20px;
    border: 5px solid #131313;
    border-radius: 7px;

    font-family: "Lexend", sans-serif;
    font-size: 1.1em;
    font-weight: 200;
    color: white;   
  }
</style>