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

        browser.storage.sync.set(settingsParsed);
        window.close();
    }

    function cancel() {
        window.close();
    }

    // This block happens reactively, so that it will validate JSON on any changes to the settingsJson string
    $: try {
        settingsParsed = JSON.parse(settingsJson);
        settingsJson = JSON.stringify(settingsParsed, null, 2);
        isValid = true;
    } catch (e) {
        settingsParsed = undefined;
        isValid = false;
    }

    async function loadSettings() {
        console.log('getting settings');
        settingsSaved = await browser.storage.sync.get(null)
        settingsJson = JSON.stringify(settingsSaved, null, 2);
    }

    loadSettings();

//    browser.storage.onChanged.addListener((_changes, areaName) => {
//       if (areaName === 'sync') loadSettings();
//    });
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
