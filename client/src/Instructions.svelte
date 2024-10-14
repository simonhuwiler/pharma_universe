<script>
  import { _ } from 'svelte-i18n'
  import isMobile from 'ismobilejs';
</script>
    
<div class='instructions'>
  {#if isMobile(window.navigator).any}
    {@html $_('intro.instructionmobile')}
  {:else}
    {@html $_('intro.instructiondesktop')}
  {/if}
</div>

<style>
  .instructions
  {
    z-index: 1000;
    background-color: rgba(85, 85, 85, 0.8);
    color: rgb(228, 228, 228);
    padding: 5px;
    margin: 10px 0;
    line-height: 1.7em;
    font-size: 14px;
    width: 600px;
    max-width: 90vw;
    border-radius: 5px;
  }

  @media (min-width: 800px) {
    .instructions
    {
      font-size: 16px;
      line-height: 1.8em;
    }
  }   
</style>