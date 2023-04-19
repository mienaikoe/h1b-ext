<script>
  import CompanyDetails from "./CompanyDetails.svelte";
  import CompanyRecords from "./CompanyRecords.svelte";

  export let entities = [];

  const companyName = entities[0].company_name;
</script>

<div class="h1bSummary">
  <div class="header">{companyName} is <i>Down to Sponsor</i></div>
  <div class="details">
    <CompanyDetails {entities} />
  </div>
  <div class="records">
    <CompanyRecords {entities} />
  </div>
  <div class="actions">
    <div />
    <a
      class="report"
      target="_blank"
      rel="noreferrer"
      href="https://forms.gle/FvVjBZrGzWjT3Lhk6">Report an error</a
    >
  </div>
</div>

<style src="./H1BSummary.less"></style>
