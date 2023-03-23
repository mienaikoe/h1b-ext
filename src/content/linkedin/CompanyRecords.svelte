<script lang="ts">
  import type { H1BEntity, H1BRecord } from "../../common/types";
  import { mergeH1BRecords } from "../../common/utilities";
  import CompanyRecord from "./CompanyRecord.svelte";

  export let entities: H1BEntity[] = [];

  // combine records from different tax ids and naics
  // until we can come up with a nicer way to display this.
  let mergedRecord: H1BRecord;
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

<div class="dts-companyRecords">
  <CompanyRecord label="New Approvals" value={mergedRecord.initial_approval} />
  <CompanyRecord
    label="Cont. Approvals"
    value={mergedRecord.continuing_approval}
  />
  <CompanyRecord label="New Denials" value={mergedRecord.initial_denial} />
  <CompanyRecord label="Cont. Denials" value={mergedRecord.continuing_denial} />
</div>

<style src="./CompanyRecords.less"></style>
