<script>
  import { _ } from 'svelte-i18n'
  import isMobile from 'ismobilejs';
</script>
    
<div class='instructions'>
  {#if isMobile(window.navigator).any}
    {@html $_('messages.instructionmobile')}
  {:else}
    {@html $_('messages.instructiondesktop')}
  {/if}
</div>

<style>
  .instructions
  {
    z-index: 1000;
    background-color: #131313;
    color: rgb(228, 228, 228);
    padding: 5px;
    margin: 10px 0;
    width: 600px;
    max-width: 90vw;
    border-radius: 7px;
    font-family: "Lexend", sans-serif;
    font-size: 1.1em;
    line-height: 1.6em;
    font-weight: 200;
    color: white;    
  }

  @media (max-width: 800px) {
    .instructions
    {
      font-size: 16px;
      line-height: 1.6em;
    }
  }   
</style>