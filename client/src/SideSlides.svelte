<script>
  import { fade } from "svelte/transition";
  import { storeChapter } from "./store";
  import { _ } from "svelte-i18n";
  export let chapter = 0;
</script>

{#if chapter == 3}
  <div class="sideslide" transition:fade={{ duration: 200 }}>
    <div class="content">
      {$_("slide3.text")}
      <div class="buttons">
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
      <div class="buttons">
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
      <div class="buttons">
        <button on:click={() => storeChapter.set(6)}
          >{$_("slide5.button")}</button
        >
      </div>
    </div>
  </div>

  {:else if chapter >= 6 && chapter <= 90}
  <div class="sideslide" in:fade={{ duration: 200, delay: 200 }} out:fade={{duration: 200}}>
    <div class="content">
      {$_("slide6.text1")}
      <p>
        {$_("slide6.text2")}
      </p>
      <div class="buttons">
        <button on:click={() => storeChapter.set(99)}>{$_("slide6.buttonfree")}</button>
        <button on:click={() => storeChapter.set(7)}>{$_("slide6.buttoncancer")}</button>
        <button on:click={() => storeChapter.set(8)}>{$_("slide6.buttonmarva")}</button>
        <!-- <button on:click={() => {}}>{$_("slide6.buttonzirkel")}</button> -->
        <button on:click={() =>  storeChapter.set(9)}>{$_("slide6.buttonunispital")}</button>
        <button on:click={() => storeChapter.set(10)}>{$_("slide6.buttonnovartis")}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .sideslide {
    position: absolute;
    background-color: #131313;
    z-index: 1000;
    width: 500px;
    max-width: 100%;
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

  .sideslide .buttons {
    margin-top: 20px; /* Add some space between text and buttons */
  }

  .sideslide .buttons button {
    background-color: rgb(19, 19, 19);
    border: 2px solid white;
    color: white;
    padding: 10px 20px;
    margin: 5px 0;
    border-radius: 25px; /* Rounded corners */
    cursor: pointer;
    font-size: 16px;
    font-family: "Lexend", sans-serif;
    font-weight: 300;
  }

  .sideslide .buttons button:hover {
    background-color: rgb(43, 43, 43);
    /* color: black; */
  }
</style>
