<script lang="ts">
  export let label: string = "";
  export let value: string | number = "";
  let isPositive = label.includes("pprovals");
</script>

<div class="dts-companyRecord {isPositive ? 'dts-positive' : 'dts-negative'}">
  <div class="dts-label">{label}</div>
  <div class="dts-value">
    {value.toLocaleString()}
  </div>
</div>

<style src="./CompanyRecord.less"></style>
