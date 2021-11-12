<script>
  export let top
  export let left
  export let distance
  export let label
  export let type


  const maxWidth = 180
  $: width = Math.max(maxWidth / 100 * distance, 10)
</script>

<hud>
  {#if type == 'asteroid'}
    <div 
      class='circle'
      style='top:{top - width / 2}px;left:{left - width / 2}px;width:{width}px;height:{width}px;'
    />
  {/if}
    <div
      class='label {type}'
      style='top:{top + 10}px;left:{left - 80}px'
    >{label}</div>
</hud>

<style>
  .circle
  {
    position: absolute;
    width: 0px;
    height: 0px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 100px;
  }

  .label
  {
    position: absolute;
    width: 160px;
    height: 15px;
    overflow: hidden;
    text-align: center;
    font-size: 0.9em;
  }
  
  .label.asteroid
  {
    color: rgba(255, 255, 255, 0.35);
  }

  .label.planet
  {
    color: rgba(2, 202, 216, 0.35);
  }
</style>