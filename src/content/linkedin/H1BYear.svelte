<script>
  export let record;
</script>

<div class="h1bYear">
  <h3>{record.year}</h3>
  <table>
    <tbody>
      <tr>
        <td>Initial Approval</td>
        <td>{record.initial_approval}</td>
      </tr>
      <tr>
        <td>Initial Denial</td>
        <td>{record.initial_denial}</td>
      </tr>
      <tr>
        <td>Continuing Approval</td>
        <td>{record.continuing_approval}</td>
      </tr>
      <tr>
        <td>Continuing Denial</td>
        <td>{record.continuing_denial}</td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  h3 {
    font-size: 18px;
  }

  table {
    font-size: 12px;
  }

  td {
    padding-right: 8px;
  }
</style>
