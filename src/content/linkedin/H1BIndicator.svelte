<script>
  import H1BSummary from "./H1BSummary.svelte";

  export let entities = [];
</script>

<div class="h1bContainer">
  <div class="h1bIndicator">H1B</div>
  <div class="h1bSummary">
    <H1BSummary {entities} />
  </div>
</div>

<style>
  .h1bContainer {
    margin-top: 2px;
    position: relative;
  }

  .h1bSummary {
    display: none;
    position: absolute;
    top: 20px;
    left: 0;
    z-index: 1;
    width: 200px;
  }

  .h1bContainer:hover .h1bSummary {
    display: block;
  }

  .h1bIndicator {
    background-color: cyan;
    color: black;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    border-radius: 3px;
    text-align: center;
  }
</style>
