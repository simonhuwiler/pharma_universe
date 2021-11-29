<script>
  import { _ } from 'svelte-i18n'
  import { addMessages, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
  import { storeControlsEnabled, storeShowIntro, storeAnimationArray, storeShowStahle } from './store.js';

  import { PathAnimation } from './pathanimation'

  let activeSlide = 0
  let fadeInSlide = 0

  const start = () => {
    storeControlsEnabled.set(true)
    storeShowIntro.set(false)
  }

  const flyAmgen = () => {
    activeSlide = 2
    storeAnimationArray.set([
        new PathAnimation([
        [ 0, 525000000, 0 ],
        [ 0, 525000000, -8273000 ],
        [ 0, 525000000, -30273000 ],
        [ -4086556, 520594467, -36747020],
        [ -336270502, 261863738, -451570032 ],
      ], 15)
    ])
    setTimeout(() => fadeInSlide = 2, 15000);
  }

  const flyStahel = () => {
    activeSlide = 3
    storeAnimationArray.set([
        new PathAnimation([
          [ -336270502, 261863738, -451570032 ],
          [ -343923798, 255902837, -461127186 ],
          [ -360043166, 243347991, -481256456 ],
          [ -330754967, 224872917, -583446403 ],
          [ -334367442, 349627471, -684292795 ],
          [ -104191398, 282550489, -76827530 ]
        ], 15)
    ])
    setTimeout(() => fadeInSlide = 3, 15000);
  }

  const showStahel = () => {
    activeSlide = 4
    storeShowStahle.set(true)
    setTimeout(() => fadeInSlide = 4, 2000);
  }

</script>
  
    <div class='intro'>

      <!-- CHAPTER 1-->
      {#if activeSlide === 0}
        <div class='slide'>
          <h2>{$_('intro.chapter1_title')}</h2>
          <div class='i18n'>
            <img src='./images/german.png' alt='Deutsche Sprache wählen' on:click={ () => ($locale = 'de')}/>  
            <img src='./images/english.png' alt='Switch to english' on:click={ () => ($locale = 'en')}/>  
          </div>
          <p>
            {@html $_('intro.chapter1')}
          </p>
          <div class='buttons'>
            <button class='fly' on:click={start}>{$_('intro.flydirectly')}</button>
            <button class='tour' on:click={() => {activeSlide = 1}}>{$_('intro.starttour')}</button>
          </div>
        </div>
      {/if}

      <!-- CHAPTER 2 -->
      {#if activeSlide === 1}
        <div class='slide'>
          <p>
            {@html $_('intro.chapter2')}
          </p>
          <div class='buttons'>
            <button class='tour' on:click={flyAmgen}>{$_('intro.next')}</button>
          </div>
        </div>
      {/if}

      <!-- CHAPTER 3 -->
      {#if activeSlide === 2}

      <div class="slide {fadeInSlide === 2 ? 'show' : 'hide'}">
        <p>
          {@html $_('intro.chapter3')}
        </p>
        <div class='buttons'>
          <button class='tour' on:click={flyStahel}>{$_('intro.next')}</button>
        </div>
      </div>
      {/if}

      <!-- CHAPTER 3 -->
      {#if activeSlide === 3}
        <div class="slide {fadeInSlide === 3 ? 'show' : 'hide'}">
          <p>
            {$_('intro.chapter4')}
          </p>
          <div class='buttons'>
            <button class='tour' on:click={showStahel}>{$_('intro.next')}</button>
          </div>
        </div>
      {/if}

      <!-- CHAPTER 4 -->
      {#if activeSlide === 4}
        <div class="slide {fadeInSlide === 4 ? 'show' : 'hide'}">
          <p>
            {$_('intro.chapter5')}
          </p>
          <div class='buttons'>
            <button class='tour' on:click={start}>{$_('intro.fly')}</button>
          </div>
        </div>
      {/if}


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

    .show
    {
      opacity: 1;
      transition: opacity 0.3s;
    }

    .hide
    {
      opacity: 0;
      transition: opacity 0.3s;
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

    .tour:hover
    {
      background-color: #102222 !important;
    }

    .buttons button:hover {
      background-color: #090b1d;
      color: white;
    }
  </style>