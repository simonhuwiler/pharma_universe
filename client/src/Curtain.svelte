<script>
  export let open = false;
</script>

<div class="curtain-container {open ? 'open' : ''}">
  <div class="curtain left-curtain"></div>
  <div class="curtain right-curtain"></div>
</div>

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

  .left-curtain {
    left: 0;
    transform-origin: top left;
    clip-path: polygon(0 0, 100% 0, 45% 100%, 0 100%);
  }

  .right-curtain {
    right: 0;
    transform-origin: top right;
    clip-path: polygon(55% 0, 100% 0, 100% 100%, 0 100%);
  }

  .open .left-curtain {
    transform: translateX(-100%);
  }

  .open .right-curtain {
    transform: translateX(100%);
  } 
</style>

