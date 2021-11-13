<script>
  export let id
  export let name
  const states = {waiting: 0, ready: 1, nothing: 99, error: -1}

  var data = {state: states.nothing}

  $: {
    if(id) 
    {
      data = {state: states.waiting}
      fetch(`https://api.pharmagelder.ch/recipient/id/${id}`)
        .then(request => request.json())
        .then(res => {

          const pharmas = []

          for(let year in res.transactions)
          {
            for(let t in res.transactions[year][1])
            {
              let trans = res.transactions[year][1][t]
              let pharma = pharmas.filter(p => p.name === trans.pharma_name)
              if(pharma.length == 0)
                pharmas.push({'name': trans.pharma_name, 'value': Math.round(trans.value)})
              else
                pharma[0].value = pharma[0].value + Math.round(trans.value)
            }
          }

          // Add Total
          const t = pharmas.reduce((a, b) => {return {'value': (a.value + b.value)}})
          pharmas.push({'name': 'Total', 'value': Math.round(t.value)})

          data = {
            state: states.ready,
            id: res.recipient.id,
            name: res.recipient.name + ', ' + res.recipient.location,
            transactions: pharmas

          }

        })
      }
    }
</script>
  
  <display>
    <div class={data.state === states.nothing ? 'display hide' : 'display'}>
      {#if data.state === states.waiting}

        {name}<br/>
        <span class='info'>Raumstation wird angefragt...</span>

      {:else if data.state === states.ready} 

        {data.name}<br/>
        <table border=0 cellpadding=0 cellspacing=0>
          {#each data.transactions as t}
          <tr>
            <td>{t.name}</td>
            <td>{t.value} CHF</td>
          </tr>
          {/each}
        </table>
        <a href='https://www.pharmagelder.ch/recipient/{data.id}-Recipient.html' target='_blank'>Detaillierte Daten anzeigen</a>    
      
      {:else if data.state === states.error}
        :( Raumstation konnte nicht gefunden werden. Vielleicht wurde sie von einem schwarzen Loch verschluckt.
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
      color: rgb(228, 228, 228);
      position: absolute;
      top: 5px;
      left: 5px;
      width: 250px;
      border-radius: 2px;
      padding: 2px 5px;
      background-color: rgba(210, 225, 226, 0.432);
      z-index: 3;
      line-height: 1.1em;
    }

    .info
    {
      font-size: 0.8em;
    }

    table
    {
      font-size: 0.8em;
      width: 100%;
      border: 0;
      margin: 5px 0;
    }

    tr, td
    {
      padding: 0;
      margin: 0;
      line-height: 1.2;
    }

    table tr:last-child td
    {
      border-top: 1px solid grey;
    }

    tr td:nth-child(2)
    {
      text-align: right;
    }

    a
    {
      background: url('../images/link.png') no-repeat left;
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