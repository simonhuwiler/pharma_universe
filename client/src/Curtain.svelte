<script>
  export let start = 'closed'
  export let open = false;

  // Trigger closing a bit later, otherwise when component is added it will not trigger
  let openInternal = !open
  setTimeout(() => openInternal = open, 1)

</script>

{#if start === 'closed'}
<div class="curtain-container {open ? 'open' : 'closed'}">
  <div class="curtain left-curtain-start-closed"></div>
  <div class="curtain right-curtain-start-closed"></div>
</div>
{:else}
<div class="curtain-container {openInternal ? 'open' : 'closed'}">
  <div class="curtain left-curtain-start-open"></div>
  <div class="curtain right-curtain-start-open"></div>
</div>
{/if}


<style>
  .curtain-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 900;
  }

  .curtain {
    position: absolute;
    width: 70%;
    height: 100%;
    background-color: rgb(19, 19, 19);
    top: 0;
    transition: transform 2s ease-in-out;
  }

  .left-curtain-start-closed {
    left: 0;
    transform-origin: top left;
    clip-path: polygon(0 0, 100% 0, 45% 100%, 0 100%);
  }  

  .left-curtain-start-open {
    left: 0;
    transform-origin: top left;
    clip-path: polygon(0 0, 100% 0, 45% 100%, 0 100%);
    transform: translateX(-100%);
  }    

  .right-curtain-start-closed {
    right: 0;
    transform-origin: top right;
    clip-path: polygon(55% 0, 100% 0, 100% 100%, 0 100%);
  }

  .right-curtain-start-open {
    right: 0;
    transform-origin: top right;
    clip-path: polygon(55% 0, 100% 0, 100% 100%, 0 100%);
    transform: translateX(100%);
  }  

  .open .left-curtain-start-closed, .open .left-curtain-start-open {
    transform: translateX(-100%);
  }

  .open .right-curtain-start-closed, .open .right-curtain-start-open {
    transform: translateX(100%);
  } 

  .closed .left-curtain-start-closed, .closed .left-curtain-start-open {
    transform: translateX(0);
  }

  .closed .right-curtain-start-closed, .closed .right-curtain-start-open {
    transform: translateX(0);
  }   
</style>

