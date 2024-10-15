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
  {#if type === 'asteroid'}
    <div 
      class='circle'
      style='top:{top - width / 2}px;left:{left - width / 2}px;width:{width}px;height:{width}px;'
    />
  {:else if type === 'search'}
    <div
      class='cross'
      style='top:{top}px;left:{left}px'
    />
  {/if}
  {#if ['asteroid', 'planet'].includes(type)}
    <div
      class='label {type}'
      style='top:{top + 10}px;left:{left - 80}px'
    >{label}</div>
  {:else}
    <div
      class='label {type}'
      style='top:{top + 20}px;left:{left - 80}px'
    >{distance}</div>
    {/if}
</hud>

<style>
  .circle
  {
    position: absolute;
    width: 0px;
    height: 0px;
    border-radius: 100px;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .cross {
    position: absolute;
    right: 32px;
    top: 32px;
    width: 32px;
    height: 32px;
    transform: translate(-50%, -50%);
  }

  .cross:before, .cross:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: rgba(122, 252, 0, .5);
  }

  .cross:after {
    transform: rotate(-90deg);
  }

  .circle.search
  {
    border: 2px solid rgba(122, 252, 0, 0.5);
  }

  .label
  {
    position: absolute;
    width: 160px;
    word-wrap: break-word;
    height: 50px;
    overflow: hidden;
    text-align: center;
    font-size: 0.9em;
    user-select: none;
  }
  
  .label.asteroid
  {
    color: rgba(255, 255, 255, 0.55);
  }

  .label.planet
  {
    color: rgba(2, 202, 216, 0.55);
  }

  .label.search
  {
    color: rgba(122, 252, 0, 0.76);
  }
</style>