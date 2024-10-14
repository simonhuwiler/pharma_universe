<script>
  import { storeChapter } from "./store";
  import { _ } from "svelte-i18n";
</script>

<div class="buttonsBig">
  <button on:click={() => storeChapter.set(99)}>{$_("slide6.buttonfree")}</button>
  <button on:click={() => storeChapter.set(7)}>{$_("slide6.buttoncancer")}</button>
  <button on:click={() => storeChapter.set(8)}>{$_("slide6.buttonmarva")}</button>
  <button on:click={() =>  storeChapter.set(9)}>{$_("slide6.buttonunispital")}</button>
  <button on:click={() => storeChapter.set(10)}>{$_("slide6.buttonnovartis")}</button>
</div>

<style>


</style>