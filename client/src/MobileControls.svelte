<script>
  export let controlMouse = null
</script>

<div class='button up' on:touchstart={() => controlMouse.setMoveState('forward', true)} on:touchend={() => controlMouse.setMoveState('forward', false)} ><span/></div>
<div class='button down' on:touchstart={() => controlMouse.setMoveState('back', true)} on:touchend={() => controlMouse.setMoveState('back', false)}><span/></div>
<div class='button left' on:touchstart={() => controlMouse.setMoveState('left', true)} on:touchend={() => controlMouse.setMoveState('left', false)}><span/></div>
<div class='button right' on:touchstart={() => controlMouse.setMoveState('right', true)} on:touchend={() => controlMouse.setMoveState('right', false)}><span/></div>

<style>
  .button {
    position: absolute;
    z-index: 1000;
    width: 50px;
    height: 50px;
    background: #245050;
    border: 1px solid #419696;
    opacity: 1;
    border-radius: 2px;
  }

  .button span
  {
    position: absolute;
    width: 0px;
    height: 0px;
    left: 10px;
    top: 12px;
    -webkit-transform:rotate(360deg);
    border-style: solid;
  }

  .up
  {
    left: 10px;
    bottom: 70px;
  }

  .up span
  {
    border-width: 0 15px 26.0px 15px;
    border-color: transparent transparent #55cfcf transparent;    
  }

  .down
  {
    left: 10px;
    bottom: 10px;
  }

  .down span
  {
    border-width: 26.0px 15px 0 15px;
    border-color: #55cfcf transparent transparent transparent;
  }

  .right
  {
    right: 10px;
    bottom: 10px;
  }

  .right span
  {
    left: 12px;
    border-width: 15px 0 15px 26.0px;
    border-color: transparent transparent transparent #55cfcf;
  }  


  .left
  {
    right: 70px;
    bottom: 10px;
  }

  .left span
  {
    left: 12px;
    border-width: 15px 26.0px 15px 0;
    border-color: transparent #55cfcf transparent transparent;
  }    

</style>