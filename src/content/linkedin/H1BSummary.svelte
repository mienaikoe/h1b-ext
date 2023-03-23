<script>
  import CompanyDetails from "./CompanyDetails.svelte";
  import CompanyRecords from "./CompanyRecords.svelte";

  export let entities = [];

  const companyName = entities[0].company_name;
</script>

<div class="h1bSummary">
  <div class="header">{companyName} is Down to Sponsor</div>
  <div class="details">
    <CompanyDetails {entities} />
  </div>
  <div class="records">
    <CompanyRecords {entities} />
  </div>
</div>

<style src="./H1BSummary.less"></style>
