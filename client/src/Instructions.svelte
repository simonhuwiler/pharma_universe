<script>
    import { _ } from 'svelte-i18n'
</script>
    
<div class='instructions'>
  {@html $_('intro.instructions')}
</div>

<style>
  .instructions
  {
    z-index: 1000;
    background-color: rgba(85, 85, 85, 0.8);
    color: rgb(228, 228, 228);
    padding: 5px;
    margin: 10px 0;
    line-height: 1.8em;
  }
</style>