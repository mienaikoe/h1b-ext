<script>
  import CompanyDetails from "./CompanyDetails.svelte";
  import CompanyRecords from "./CompanyRecords.svelte";

  export let entities = [];

  const companyName = entities[0].company_name;
</script>

<div class="h1bSummary">
  <div class="header">
    <div class="title">Down to Sponsor</div>
    <a
      class="report"
      target="_blank"
      rel="noreferrer"
      href="https://forms.gle/FvVjBZrGzWjT3Lhk6">Report an error</a
    >
  </div>
  <div class="details">
    <CompanyDetails {entities} />
  </div>
  <div class="records">
    <CompanyRecords {entities} />
  </div>
  <div class="actions">
    <div />
    <a
      href="https://docs.google.com/document/d/1oHrvlrUtcULBcPu_R_c-2sTykP4k0vmP6ANlO99mIKw/edit?usp=sharing"
      target="_blank"
      rel="noreferrer"
      class="action"
    >
      Privacy Policy
    </a>
  </div>
</div>

<style src="./H1BSummary.less"></style>
