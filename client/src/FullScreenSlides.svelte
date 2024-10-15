<script>
  import { fade } from 'svelte/transition';
  import { storeChapter } from './store'
  import { activateFullScreen } from './helpers'
  import { _, locale } from 'svelte-i18n';
  export let chapter = 0

  let textOption = 0

  const nextChapter = (option) => {
    storeChapter.set(2)
    textOption = option
  }

</script>

<div class="slide">

  {#if chapter == 1}
    <div class="content" in:fade={{ duration: 1000 }} out:fade={{ duration: 200 }}>

      <div class='i18n'>
        <img src='./images/german_w.png' alt='Deutsche Sprache wählen' on:click={ () => ($locale = 'de')}/>  
        <img src='./images/english_w.png' alt='Switch to english' on:click={ () => ($locale = 'en')}/>  
      </div>

      {$_('slide1.text')}

      <div class='buttonsFullscreen'>
        <button on:click={() => nextChapter(0)}>{$_('slide1.button1')}</button>
        <button on:click={() => {
          nextChapter(1)
          if(isMobile(window.navigator).any) activateFullScreen()
        }}>{$_('slide1.button2')}</button>
      </div>
      <div style='padding: 40px 0 0 0'>
        <span class='smalllink' on:click={() => storeChapter.set(99)}>{$_('slide1.skip')}</span>
      </div>
    </div>
  {/if}
  
  {#if chapter == 2}
    <div class="content" transition:fade={{ duration: 200 }}>
      <p>
        {#if textOption == 0}
          {$_('slide2.option1')}
        {:else}
          {$_('slide2.option2')}
        {/if}
      </p>

      <p>
        {$_('slide2.text')}
      </p>

      <div class='buttonsFullscreen'>
        <button on:click={() => storeChapter.set(3)}>{$_('slide2.button')}</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .i18n
  {
    text-align: right;
    padding-bottom: 30px;
  }

  .i18n img
  {
    width: 35px;
    cursor: pointer;
  }

  .smalllink
  {
    font-size: 0.8em;
    text-decoration: underline;
    color: rgb(201, 201, 201);
    cursor: pointer;
  }

  .slide {
    position: fixed;
    background-color: rgb(19, 19, 19);
    z-index: 1000;
    width: 100vw;
    height: 100vh;
  }

  .slide .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    max-width: 100%;
    width: 1000px;
    /* text-align: center; */
    font-family: "Lexend", sans-serif;
    font-size: 1.5em;
    font-weight: 200;
    color: white;
    padding: 10px;
  }

  @media (max-width: 1100px) {
    .slide .content {
      font-size: 1.3em;
      padding: 10px;
      box-sizing: border-box;
      max-height: 100%;
      overflow-y: scroll;
    }

    .smalllink
    {
      font-size: 0.8em;
    }
  }

  .slide .buttonsFullscreen {
    margin-top: 40px;
  }

</style>