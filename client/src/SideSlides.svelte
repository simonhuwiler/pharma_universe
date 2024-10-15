<script>
  import { fade } from "svelte/transition";
  import { storeChapter } from "./store";
  import { _ } from "svelte-i18n";
  import ButtonList from "./ButtonList.svelte";
  export let chapter = 0;
</script>

{#if chapter == 3}
  <div class="sideslide" in:fade={{ duration: 200, delay: 2000}} out:fade={{ duration: 200 }}>
    <div class="content">
      {$_("slide3.text")}
      <div class="buttonsSide">
        <button on:click={() => storeChapter.set(4)}
          >{$_("slide3.button")}</button
        >
      </div>
    </div>
  </div>
{:else if chapter == 4}
  <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
    <div class="content">
      {$_("slide4.text")}
      <div class="buttonsSide">
        <button on:click={() => storeChapter.set(5)}
          >{$_("slide4.button")}</button
        >
      </div>
    </div>
  </div>
{:else if chapter == 5}
  <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
    <div class="content">
      {$_("slide5.text1")}
      <p>
        {$_("slide5.text2")}
      </p>
      <div class="buttonsSide">
        <button on:click={() => storeChapter.set(6)}
          >{$_("slide5.button")}</button
        >
      </div>
    </div>
  </div>

  {:else if chapter == 6}
  <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
    <div class="content">
      {$_("slide6.text1")}
      <p>
        {$_("slide6.text2")}
      </p>
      <ButtonList />
    </div>
  </div>

  {:else if chapter == 7}
    <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
      <div class="content">
        {$_("esmo.text1")}
        <p>
          {$_("esmo.text2")}
        </p>
        <ButtonList />
      </div>
    </div>

  {:else if chapter == 8}
    <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
      <div class="content">
        {$_("safa.text1")}
        <ButtonList />
      </div>
    </div>    

  {:else if chapter == 9}
    <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
      <div class="content">
        {$_("unispital.text1")}
        <ButtonList />
      </div>
    </div>  
    
  {:else if chapter == 10}
    <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
      <div class="content">
        {$_("novartis.text1")}
        <ButtonList />
      </div>
    </div>            
  {/if}

<style>
  .sideslide {
    position: absolute;
    background-color: #131313;
    z-index: 1000;
    width: 500px;
    max-width: 100vw;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    padding: 20px;
    border: 5px solid #131313;
    border-radius: 7px;
  }

  .sideslide .content {
    font-family: "Lexend", sans-serif;
    font-size: 1.1em;
    font-weight: 200;
    color: white;
  }

  /* Landscape */
  @media (max-width: 1100px) {
    .sideslide {
      padding: 10px;
      right: 0px;
      width: 400px;
      opacity: 0.9;
      max-height: 100vh;
    }

    .sideslide .content {
      font-size: 1em;
      overflow-y: scroll;
      max-height: 100vh;
      margin: 10px;
    }
  }  

  /* Portrait */
  @media (max-width: 800px) {
    .sideslide {
      bottom: 0;
      left: initial;
      top: initial;
      transform: initial;
      padding: 10px;
      margin: 0;
      box-sizing: border-box;
      opacity: 0.9;
    }

    .sideslide .content {
      margin: 0;
    }
    
  }

</style>
