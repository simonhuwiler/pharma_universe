<script>
  // import { _ } from 'svelte-i18n'
  import { _, locale } from 'svelte-i18n';
  import isMobile from 'ismobilejs';
  import { storeControlsEnabled, storeShowIntro, storeAnimationArray, storeShowStahle } from './store.js';

  import { PathAnimation } from './pathanimation'

  let activeSlide = 0
  let fadeInSlide = 0

  let isPortrait = false;
  const checkPortrait = () => {
    if(isMobile(window.navigator).any && (window.innerHeight > window.innerWidth)) isPortrait = true
    else isPortrait = false
  }
  checkPortrait()

  window.addEventListener('resize', checkPortrait)

  const start = () => {
    storeControlsEnabled.set(true)
    storeShowIntro.set(false)
  }

  const flyAmgen = () => {
    activeSlide = 2
    storeAnimationArray.set([
        new PathAnimation([
          [ 0, 525000000, 0 ],
          [ 0, 525000000, -20273000 ],
          [ 60450255, 208149014, -206199116]
      ], 10)
    ])
    setTimeout(() => fadeInSlide = 2, 10000);
  }

  const flyStahel = () => {
    activeSlide = 3
    storeAnimationArray.set([
        new PathAnimation([
          [ 60450255, 208149014, -206199116],
          [ 67641984, 170453451, -228311716],
          [ 42165377, 126628580, -370199153],
          [-250308124, 405162225, -170651413],
          [ -104048951, 433045497, 179994316]
        ], 15)
    ])
    setTimeout(() => fadeInSlide = 3, 16000);
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
        <div class='infobox slide'>
          <h2>{$_('intro.chapter1_title')}</h2>
          <div class='i18n'>
            <img src='./images/german.png' alt='Deutsche Sprache wählen' on:click={ () => ($locale = 'de')}/>  
            <img src='./images/english.png' alt='Switch to english' on:click={ () => ($locale = 'en')}/>  
          </div>
          <p>
            {#if isPortrait}
              <b>{$_('intro.turnyoursmartphone')}</b>
            {/if}
            {@html $_('intro.chapter1')}
          </p>
          <div class='buttons'>
            <button class='fly' on:click={start}>{$_('intro.flydirectly')}</button>
            <button class='highlight' on:click={() => {activeSlide = 1}}>{$_('intro.starttour')}</button>
          </div>
        </div>
      {/if}

      <!-- CHAPTER 2 -->
      {#if activeSlide === 1}
        <div class='infobox slide'>
          <p>
            {@html $_('intro.chapter2')}
          </p>
          <div class='buttons'>
            <button class='highlight' on:click={flyAmgen}>{$_('intro.next')}</button>
          </div>
        </div>
      {/if}

      <!-- CHAPTER 3 -->
      {#if activeSlide === 2}

      <div class="infobox slide {fadeInSlide === 2 ? 'show' : 'hide'}">
        <!-- <button on:click={start}>Hello</button> -->
        <p>
          {@html $_('intro.chapter3')}
        </p>
        <div class='buttons'>
          <button class='highlight' on:click={flyStahel}>{$_('intro.next')}</button>
        </div>
      </div>
      {/if}
      
      <!-- CHAPTER 3 -->
      {#if activeSlide === 3}
      <div class="infobox slide {fadeInSlide === 3 ? 'show' : 'hide'}">
          <p>
            {$_('intro.chapter4')}
          </p>
          <div class='buttons'>
            <button class='highlight' on:click={showStahel}>{$_('intro.next')}</button>
          </div>
        </div>
      {/if}

      <!-- CHAPTER 4 -->
      {#if activeSlide === 4}
        <div class="infobox slide {fadeInSlide === 4 ? 'show' : 'hide'}">
          <p>
            {$_('intro.chapter5')}
          </p>
          <div class='buttons'>
            <button class='highlight' on:click={start}>{$_('intro.fly')}</button>
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
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
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

  </style>