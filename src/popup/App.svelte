<script>
    const quickButtons = JSON.stringify([
        { job: 'FERG133', duration: '1', display_name: 'Meeting', task: '453' },
        { job: 'FERG129', duration: '8.0', display_name: 'Vacation', task: '600' },
        { job: 'FERG130', duration: '8.0', display_name: 'Sick', task: '601' },
        { job: 'FERG131', duration: '8.0', display_name: 'Closed', task: '602' },
    ], null, 2);
</script>

<form>
    <textarea>{quickButtons}</textarea>
    <button type="submit">Save</button>
</form>