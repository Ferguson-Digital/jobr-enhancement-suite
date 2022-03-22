<script>
    import browser from 'webextension-polyfill';
    
    let shortcutsJson/*  = JSON.stringify([
        { job: 'FERG133', duration: '1', display_name: 'Meeting', task: '453' },
        { job: 'FERG129', duration: '8.0', display_name: 'Vacation', task: '600' },
        { job: 'FERG130', duration: '8.0', display_name: 'Sick', task: '601' },
        { job: 'FERG131', duration: '8.0', display_name: 'Closed', task: '602' },
    ], null, 2); */
    
    let isValid = false;
    let shortcutsParsed;
    let shortcutsSaved;
    
    function save() {
        if (!isValid) {
            alert('invalid JSON');
            return false;
        }
        
        browser.storage.sync.set({shortcuts: shortcutsParsed});
        window.close();
    }
    
    function cancel() {
        // shortcutsJson = JSON.stringify(shortcutsSaved, null, 2);
        // browser.storage.sync.clear();
        window.close();
    }
    
    $: try {
        shortcutsParsed = JSON.parse(shortcutsJson);
        isValid = true;
    } catch (e) {
        shortcutsParsed = undefined;
        isValid = false;
    }
    
    browser.storage.sync.get('shortcuts').then(({shortcuts}) => {
        shortcutsSaved = shortcuts ?? {};
        shortcutsJson = JSON.stringify(shortcuts, null, 2);
    });
    
    browser.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && typeof changes['shortcuts'] !== 'undefined') {
            console.log('shortcuts changed', changes);
            shortcutsSaved = changes['shortcuts'].newValue;
            shortcutsJson = JSON.stringify(shortcutsSaved, null, 2);
        }
    });
</script>

<form on:submit|preventDefault={save}>
    <textarea bind:value={shortcutsJson}></textarea>
    <button disabled={!isValid} type="submit">Save</button>
    <button type="button" on:click={cancel}>Cancel</button>
</form>

<style>
    textarea {
        width: 24rem;
        height: 16rem;
    }
</style>