<script lang="ts">
  import type { H1BEntity } from "../../common/types";
  import CompanyDetail from "./CompanyDetail.svelte";

  export let entities: H1BEntity[] = [];

  const firstEntity = entities[0];

  const companyName = firstEntity?.company_name;
  const legalName = firstEntity?.legal_company_name;
  const location = `${firstEntity?.location.city}, ${firstEntity?.location.state}`;
  const employeeCount = `~${firstEntity?.linkedin.employee_count}`;
</script>

<div class="dts-companyDetails">
  <CompanyDetail label="LinkedIn Name" value={companyName} />
  <CompanyDetail label="Location" value={location} />
  <CompanyDetail label="USCIS Legal Name" value={legalName} />
  <CompanyDetail label="Employee Count" value={employeeCount} />
</div>

<style src="./CompanyDetails.less"></style>
