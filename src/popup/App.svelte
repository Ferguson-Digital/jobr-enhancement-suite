<script>
    import browser from 'webextension-polyfill';

    let settingsJson;

    let isValid = false;
    let settingsParsed;
    let settingsSaved;

    function save() {
        if (!isValid) {
            alert('invalid JSON');
            return false;
        }

        browser.storage.sync.set({settings: settingsParsed});
        window.close();
    }

    function cancel() {
        window.close();
    }

    // This block happens reactively, so that it will validate JSON on any changes to the settingsJson string
    $: try {
        settingsParsed = JSON.parse(settingsJson);
        isValid = true;
    } catch (e) {
        settingsParsed = undefined;
        isValid = false;
    }

    browser.storage.sync.get('settings').then(({settings}) => {
        settingsSaved = settings ?? {};
        settingsJson = JSON.stringify(settings, null, 2);
    });

    browser.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && typeof changes['settings'] !== 'undefined') {
            console.log('a.sv: settings changed', changes);
            settingsSaved = changes['settings'].newValue;
            settingsJson = JSON.stringify(settingsSaved, null, 2);
        }
    });
</script>

<form on:submit|preventDefault={save}>
    <textarea bind:value={settingsJson}></textarea>

    <div>
        <button disabled={!isValid} type="submit">Save</button>
        <button type="button" on:click={cancel}>Cancel</button>
    </div>
</form>

<style>
    textarea {
        width: 24rem;
        height: 32rem;
    }
</style>