<script lang="ts">
  import type { H1BEntity, H1BRecord } from "../../common/types";
  import { mergeH1BRecords } from "../../common/utilities";

  export let entities: H1BEntity[] = [];

  let mergedRecord: H1BRecord | undefined;
  entities.forEach((entity) => {
    entity.records.forEach((record) => {
      if (!mergedRecord) {
        mergedRecord = record;
      } else {
        mergedRecord = mergeH1BRecords(mergedRecord, record);
      }
    });
  });
</script>

<div class="h1bIndicator">
  <div class="dts">DTS</div>
  <div class="h1bCounts">
    <div class="h1bCount approval">
      {mergedRecord.continuing_approval + mergedRecord.initial_approval}
    </div>
    <div class="h1bCount denial">
      {mergedRecord.continuing_denial + mergedRecord.initial_denial}
    </div>
  </div>
</div>

<style src="./H1BIndicator.less">
</style>
