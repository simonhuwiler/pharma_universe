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
      <div class="buttonsBig">
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
      <div class="buttonsBig">
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
      <div class="buttonsBig">
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

</style>
