<script>
  import { mergeH1BRecords } from "../../common/utilities";
  import H1BYear from "./H1BYear.svelte";

  export let entities = [];

  // combine records from different tax ids and naics
  // until we can come up with a nicer way to display this.
  const recordsMap = new Map();
  entities.forEach((entity) => {
    entity.records.forEach((record) => {
      let conformedRecord;
      if (recordsMap.has(record.year)) {
        conformedRecord = mergeH1BRecords(record, recordsMap.get(record.year));
      } else {
        conformedRecord = record;
      }
      recordsMap.set(record.year, conformedRecord);
    });
  });

  const allRecords = Array.from(recordsMap.values());
</script>

<div class="h1bSummary">
  {#each allRecords as record}
    <H1BYear {record} />
  {/each}
  <p class="feedback">
    If you believe that our data is inaccurate, please let us know with
    <a
      target="_blank"
      rel="noreferrer"
      href="https://forms.gle/FvVjBZrGzWjT3Lhk6">this Google Form</a
    >.
  </p>
</div>

<style>
  .h1bSummary {
    background-color: white;
    padding: 6px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }

  .feedback {
    font-size: 10px;
    color: #888;
  }
</style>
