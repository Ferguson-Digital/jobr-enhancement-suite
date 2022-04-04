<script>
    import browser from 'webextension-polyfill';
    
    let shortcutsJson;
    
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
        window.close();
    }
    
    // This block happens reactively, so that it will validate JSON on any changes to the shortcutsJson string
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
    
    <div>
        <button disabled={!isValid} type="submit">Save</button>
        <button type="button" on:click={cancel}>Cancel</button>
    </div>
</form>

<style>
    textarea {
        width: 24rem;
        height: 16rem;
    }
</style>