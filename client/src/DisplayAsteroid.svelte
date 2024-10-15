b<script>
  import { _ } from 'svelte-i18n'
  import format from 'format-number'
  var myFormat = format({integerSeparator: "&thinsp;", suffix: ' CHF'});

  export let id
  export let name
  const states = {waiting: 0, ready: 1, nothing: 99, error: -1}

  var data = {
    state: states.nothing,
  }

  $: {
    if(id) 
    {
      data = {state: states.waiting}
      fetch(`https://api.pharmagelder.ch/recipient/id/${id}`)
        .then(request => request.json())
        .then(res => {

          // let totalSum = res.aggregation.reduce((sum, item) => sum + item.total, 0);
          const totalSum = Math.max(...res.aggregation.map(item => item.total));
          res.aggregation.forEach(a => {
            a.percentage = Math.max(1, 100 / totalSum * Math.round(a.total))
          })

          data = {
            state: states.ready,
            id: res.recipient.id,
            name: res.recipient.name + ', ' + res.recipient.location,
            aggregation: res.aggregation
          }

        })
      }
    }
</script>
  
  <display>
    <div class={data.state === states.nothing ? 'display hide' : 'display'}>
      {#if data.state === states.waiting}

        {name}<br/>
        <span class='info'>{$_('messages.waiting')}</span>

      {:else if data.state === states.ready} 

        {data.name}<br/>
        <table border=0 cellpadding=0 cellspacing=0>
          {#each data.aggregation as t}
          <tr>
            <td>{t.year}</td>
            <td><span class="bar" style='width:{t.percentage}%' /></td>
            <td>{@html myFormat(t.total)}</td>
          </tr>
          {/each}
        </table>
        <a href='https://www.pharmagelder.ch/recipient/{data.id}-Recipient.html' target='_blank'>{$_('data.detailinformation')}</a>    
      
      {:else if data.state === states.error}
        {$_('messages.errorfetch')}
      {/if}
      
    </div>
  </display>
  
  <style>

  .hide
  {
    display: none
  }

  .display
  {
    font-family: 'Titillium Web', sans-serif;
    color: white;
    position: absolute;
    background-color: #131313;
    z-index: 1000;
    width: 400px;
    max-width: 100vw;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    padding: 20px;
    border: 5px solid #131313;
    border-radius: 7px;
  }

  /* Landscape */
  @media (max-width: 1100px) {
    .display {
      padding: 10px;
      right: 0px;
      width: 400px;
      opacity: 0.9;
      max-height: 100vh;
      font-size: 0.8em;
    }    
  }

  /* Portrait */
  @media (max-width: 800px) {
    .display {
      bottom: 0;
      left: initial;
      top: initial;
      transform: initial;
      padding: 10px;
      margin: 0;
      box-sizing: border-box;
      opacity: 0.9;
      font-size: 0.8em;
    }
  }

  .info
  {
    font-size: 0.8em;
  }

  table
  {
    width: 100%;
    border: 0;
    margin: 5px 0;
    font-variant-numeric: tabular-nums;
  }

  tr, td
  {
    padding: 0;
    margin: 0;
    line-height: 1.2;
  }

  /* table tr:last-child td
  {
    border-top: 1px solid grey;
  } */
  
  tr td:nth-child(1)
  {
    min-width: 45px;
  }
  
  tr td:nth-child(2)
  {
    width: 100%;
  }

  tr td:nth-child(3)
  {
    text-align: right;
    white-space: nowrap;
    padding-left: 5px;
  }

  .bar
  {
    display: block;
    height: 10px;
    background-color: #00d0ff;
  }

  a
  {
    background: url('./images/link.png') no-repeat left;
    padding-left: 18px;
    background-size: 15px 15px;
    font-size: 0.8em;
  }

  a, a:visited, a:active
  {
    color: rgb(228, 228, 228);
  }

  a:hover
  {
    color: rgb(255, 255, 255);
  }
</style>