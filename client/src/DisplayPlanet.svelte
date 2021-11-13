<script>
  import format from 'format-number'
  var myFormat = format({integerSeparator: "'"});

  export let id
  export let name
  export let value
  export let recipients

</script>
  
  <display>
    <div class='display'>

        {name}<br/>
        <table border=0 cellpadding=0 cellspacing=0>
          <tr>
            <td>Ausgegeben</td>
            <td>{myFormat(value)} CHF</td>
          </tr>
          <tr>
            <td>Anzahl Empfänger</td>
            <td>{myFormat(recipients)}</td>
          </tr>
        </table>
        <a href='https://www.pharmagelder.ch/pharma/{id}-Pharma.html' target='_blank'>Detaillierte Daten anzeigen</a>    
      
    </div>
  </display>
  
  <style>

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