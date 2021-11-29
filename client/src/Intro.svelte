<script>
  import { _ } from 'svelte-i18n'
  import { addMessages, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
  import { storeControlsEnabled, storeShowIntro } from './store.js';

  const start = () => {
    storeControlsEnabled.set(true)
    storeShowIntro.set(false)
  }

</script>
  
    <div class='intro'>
      <div class='slide'>
        <h2>Hallo Reisender!</h2>
        <div class='i18n'>
          <img src='./images/german.png' alt='Deutsche Sprache wählen' on:click={ () => ($locale = 'de')}/>  
          <img src='./images/english.png' alt='Switch to english' on:click={ () => ($locale = 'en')}/>  
        </div>
        <p>
          Jedes Jahr zahlen Novartis, Roche und rund 60 andere Pharmafirmen eine Menge Geld an Ärzt:innen und Spitäler.
          Jetzt stell Dir vor, diese Welt der <a href='https://www.pharmagelder.ch' target='_blank'>Pharmagelder</a> wäre ein Universum: Wie würde es aussehen?
          Genau so: Pharmafirmen sind die Planeten, die Geldempfänger Asteroiden. Je mehr Geld sie erhalten, desto grösser sind sie. Je mehr Geld sie von einer Firma
          erhalten haben, desto näher sind sie am entsprechenden Planeten. Dürfen wir Dich im PharmaUniverse herumführen?
        </p>
        <div class='buttons'>
          <button class='fly' on:click={start}>direkt losfliegen</button>
          <button class='tour'>Tour starten</button>
        </div>

      </div>
    </div>
  
  <style>
    .intro
    {
      z-index: 1000;
    }
    .slide
    {
      font-family: 'Titillium Web', sans-serif;
      color: rgb(228, 228, 228);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 450px;
      max-width: 100vw;
      border-radius: 5px;
      padding: 15px 10px 5px 10px;
      background-color: rgba(60, 60, 60, 0.8);
      /* background-color: rgba(58, 58, 58, 0.432); */
      z-index: 3;
      line-height: 1.2em;
    }

    .i18n
    {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    .i18n img
    {
      width: 20px;
      cursor: pointer;
    }

    h2
    {
      font-weight: normal;
      font-size: 1.2em;
      padding: 0;
      margin: 0;
    }

    .buttons
    {
      text-align: right;
    }
    .buttons button
    {
      background-color: #313636;
      border: 1px solid white;
      color: white;
      padding: 12px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      cursor: pointer;
    }

    .tour
    {
      background-color: #245050 !important;
    }

    .buttons button:hover {
      background-color: #090b1d;
      color: white;
    }

    a
    {
      color: white;
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