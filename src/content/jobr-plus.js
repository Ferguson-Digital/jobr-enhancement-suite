import jQuery from 'jquery/dist/jquery.slim.js';
import browser from 'webextension-polyfill';

const defaultSettings = { shortcuts :
    [
        { job: 'FERG133', duration: '1', display_name: 'Meeting', task: '453' },
        { job: 'FERG129', duration: '8.0', display_name: 'Vacation', task: '600' },
        { job: 'FERG130', duration: '8.0', display_name: 'Sick', task: '601' },
        { job: 'FERG131', duration: '8.0', display_name: 'Closed', task: '602' },
    ],
    login: {
        u : '', // username
        p : ''  // password
    },
    commonTasks : [
        { id: '453', name: 'Meeting' },
        { id: '442', name: 'FrontEnd' },
        { id: '443', name: 'BackEnd' },
        { id: '407', name: 'ProjMgmt' }
    ],
    defaultDuration : '.5'
};

let settings;

async function initSettings() {
    browser.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && !!changes['settings']) {
            console.log('j-p.js: settings changed', changes);
            settings = changes['settings'].newValue || [];
            updateShortcutButtons();
        }
    });

    const results = await browser.storage.sync.get('settings');
    settings = results?.settings ?? defaultSettings;
    if (!results?.settings) {
        console.log('setting default settings');
        browser.storage.sync.set({settings});
    }

    console.log( settings );
    updateShortcutButtons();
}

initSettings();

function updateShortcutButtons() {
    if (!isShowingJobs) return;

console.log( "Buttons: ", settings.shortcuts );

    var quick_text = '<div id="manual-links">';
    for (var i = 0; i < settings.shortcuts.length; i++) {
        var e = settings.shortcuts[i];
        quick_text += '<a href="#" data-code="' + e.job + '"';
        if (e.duration) {
            quick_text += ' data-duration="' + e.duration + '"';
        }
        quick_text += ' data-task="' + (e.task ? e.task : '') + '"';
        quick_text += ' class="manual quick but_ton">' + (e.display_name ? e.display_name : e.job) + '</a>';
    }
    quick_text += '</div>';

    jQuery('#timecardtitle').hide();
    jQuery('#manual-links' ).remove();
    jQuery('#timecardtitle').after(quick_text);
    jQuery('#manual-links').off('click', '.manual', manual ).on('click', '.manual', manual );
    jQuery('body').css( { 'cursor' : 'pointer' } );
}

let isShowingJobs = false;

function showJobs() {
    jQuery(".infomain").html(jQuery('#popup_window').html());
    jQuery('.infomain').on('dblclick', '.jline', function(e) {
        e.preventDefault();
        console.log('click');
        console.log(jQuery(this).children('.jnum').first().text());
        let jobNum = jQuery(this).children('.jnum').first().text();
        selectJob(jobNum);

        return false;
    });

    isShowingJobs = true;
    updateShortcutButtons();
    return false;
}

function selectJob(jobNum) {
    // jQuery('#COST_TASK').val('422');
    jQuery('#COST_JOB_NUM').val(jobNum);
    /**
     * Took out `.val(.5)` from the line below because
     *  - More often than not it needs deleted and replaced with the correct time anyway
     *  - When editing an existing entry, it overwrites the time that was already entered
     */
    jQuery('#COST_HOURS').focus();
    jQuery('#timg').click();
}

function manual() {
    if (jQuery( this ).data( 'task' )) jQuery('#COST_TASK').val(jQuery( this ).data( 'task' ));
    jQuery('#COST_JOB_NUM').val(jQuery( this ).data( 'code' ));
    jQuery('#COST_HOURS').val(jQuery( this ).data( 'duration' ));
    jQuery('#COST_NOTE' ).focus();
    jQuery('#timg').click();
    return false;
}

jQuery(function($) {
    new MutationObserver(function (mutations) {
        setTimeout( showJobs, 100 );
    }).observe(jQuery("#main")[0], { childList: true });

    // added back in because I'm not as confident as James that we don't need a master reset back door. ;)
    jQuery('body').on('click', '#prefs b', showJobs);

    // Auto-login
    setTimeout(function () {
        const login_button = $('#gobutton');
    	if (login_button && settings.login.u && settings.login.p) {
        	login_button.hide();
    		$("#initials").val(settings.login.u);
    		$("#paswd").val(settings.login.p);
    	}
        if (login_button && $("#initials").val() && $("#paswd").val()) {
            login_button.hide();
            login_button.trigger("click");
        }
    }, 100 );


    const styleEl = document.createElement('style');
    styleEl.innerHTML = '<style>' + css`
        /* Enable this if you have auto-login */
        #gobutton {
        /*	display: none; */
        }

        .mnwrp, #mainwrap {
            width: 1280px;
        }

        .infomain #jobslisting,
        .infomain #tasklisting {
            height: 485px;
            overflow-y: scroll;
            background-color: white;
            width: 345px;
            display: block;
            visibility: visible;
            opacity: 1;
            float: left;
        }


        .infomain #jobslisting .wrp {
            width:100%;
        }

        .infomain #tasklisting {
            width: 335px;
        }

        #popup_window {
            visibility: hidden;
            display: none;
            margin-left: -9999em;
        }


        #timecardtitle, #manual-links {
            padding: 1rem;
            cursor:pointer;
            line-height: 1.1;
            white-space: normal;
        }

        #rightlr {
            width: 480px;
        }

        .calwrap {
            width: 175px;
            float: left;
        }

        #rcontent {
            clear: none;
        }

        .timedivs {
            float: left;
            clear: right;
            margin-top: 0;
            margin-bottom: 10px;
            width: 275px;
        }

        #addtime {
            margin-top: -60px !important;
        }

        #addtime.timedivs textarea#COST_NOTE {
            height: 40px;
            width: 200px;
        }

        #timecard {
            clear: both;
            width: 460px;
            height: 360px;
        }

        #timentries {
            height: 270px;
            overflow-y: scroll;
        }

        .htot {
            font-size: 1.5em;
        }

        .htot a {
            display: none;
        }

        .timenthdr::after {
            content: 'Description:';
            font-weight: bold;
            display: block;
            float: left;
            margin-left: 15px;
        }

        .time_ent {
            border-top: none;
            border-bottom: 1px dotted #BABABA;
            background: transparent;
        }

        .time_ent:nth-child(even) {
            background: #EEE;
        }

        .time_ent:not(.imgbtn) {
            display: none;
        }

        .time_ent::after {
            display: block;
            float: right;
            text-align: left;
            width: 262px;
            overflow: hidden;
            text-overflow: ellipsis;
            position: static;
            padding: 0;
            margin: 0;
            background: transparent;
            border-style: none;
            box-shadow: none;
            white-space: nowrap;
            cursor: pointer;
            line-height: normal;
            visibility: visible;
        }

        .time_ent.edt::after {
            font-weight: bold;
        }


        #COST_JOB_NUM:focus,
        #COST_HOURS:focus,
        #COST_TASK:focus {
            background-color: #FFEEFF;
        }

        .jline:hover {
            background-color: #FFEEFF;

        }

        #prefs b {
            display: inline-block;
            border: 1px solid #440044;
            cursor: pointer;
        }

        .dayselected {
            background-color: #ffaaaa;
        }

        .but_ton.quick {
            text-decoration: none;
            color: black;
            margin-bottom: 4px;
            margin-left: 4px;
            font-size: .9em;
            padding: 2px 4px;
            display: inline-block;
            line-height: 1.5;
        }

        .but_ton.quick:hover {
            background-color: white;
        }
    ` + '</style>';

    document.body.append(styleEl);
});

function css(strings, ..._values) {
    // MAYBE TODO: interpolate values, if we ever need values in our CSS
    return strings.join().replace(/(?<!!important\s*);/g, ' !important;');
}