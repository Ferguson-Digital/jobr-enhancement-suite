// add your common job codes in here
var quick_list = [
	{ job: 'BB012', duration: '', display_name: 'Board & Brush', task: '' },
	{ job: 'FERG006', duration: '0.5', display_name: 'Meeting', task: '453' },
	{ job: 'FERG006', duration: '8.0', display_name: 'Sick', task: '601' },
	{ job: 'FERG006', duration: '8.0', display_name: 'Vacation', task: '600' },
	{ job: '', duration: '0.5', display_name: 'PR Reporting', task: '500' },
	{ job: '', duration: '0.5', display_name: 'Backend Development', task: '443' },
	{ job: '', duration: '0.5', display_name: 'Frontend Development', task: '442' },
	{ job: '', duration: '0.5', display_name: 'Professional development', task: '606' },
	{ job: '', duration: '0.5', display_name: 'Software Documentation', task: '506' },
];

var task_list = ['453', '601', '600', '500', '443', '442', '606', '506'];

function updateTextLinks() {
	var quick_text = '<div id="manual-links">';
	for ( var i = 0; i < quick_list.length; i++ )
	{
		var e = quick_list[i];
		quick_text += '<a href="#" data-code="' + e.job + '"';
		if ( e.duration )
		{
			quick_text += ' data-duration="' + e.duration + '"';
		}
		quick_text += ' data-task="' + ( e.task ? e.task : '422' ) + '"';
		quick_text += ' class="manual quick but_ton">' + ( e.display_name ? e.display_name : e.job ) + '</a>';
	}
	quick_text += '</div>';

	jQuery( '#timecardtitle' ).hide();
	jQuery( '#manual-links' ).remove();
	jQuery( '#timecardtitle' ).after( quick_text );
	jQuery( '#manual-links' ).off( 'click', '.manual', manual ).on( 'click', '.manual', manual );
	jQuery( 'body' ).css( { 'cursor': 'pointer' } );
}

function showJobs() {
	jQuery( ".infomain" ).html( jQuery( '#popup_window' ).html() );
	jQuery( '.infomain' ).on( 'dblclick', '.jline', function ( e ) {
		e.preventDefault();
		console.log( 'click' );
		console.log( jQuery( this ).children( '.jnum' ).first().text() );
		let jobNum = jQuery( this ).children( '.jnum' ).first().text();
		selectJob( jobNum );

		return false;
	} );

	updateTextLinks();
	return false;
}

function filterTasks() {
	const taskElement = jQuery( '#tasklisting > .wrp' ).children( '.jline' ).children( '.tname' );
	const taskParentElement = jQuery( '#tasklisting > .wrp' ).children( '.jline' )

	for ( var i = 0; i < taskElement.length; i++ )
	{
		if ( !task_list.includes( taskElement[i].getAttribute( 'data' ) ) )
		{
			// console.log(taskParentElement[i])
			// taskElement[i].remove()
			// jQuery(this).remove()
			jQuery( taskParentElement[i] ).remove();
			// console.log(taskParentElement[i])
		}
	}

}

function selectJob( jobNum ) {
	jQuery( '#COST_TASK' ).val( '422' );
	jQuery( '#COST_JOB_NUM' ).val( jobNum );
	jQuery( '#COST_HOURS' ).val( .5 ).focus();
	jQuery( '#timg' ).click();
	filterTasks()
}

function manual() {
	jQuery( '#COST_TASK' ).val( jQuery( this ).data( 'task' ) );
	jQuery( '#COST_JOB_NUM' ).val( jQuery( this ).data( 'code' ) );
	jQuery( '#COST_HOURS' ).val( jQuery( this ).data( 'duration' ) );
	jQuery( '#COST_NOTE' ).focus();
	jQuery( '#timg' ).click();
	filterTasks()
	return false;
}

jQuery( document ).ready( function () {
	new MutationObserver( function ( mutations ) {
		setTimeout( showJobs, 100 );
	} ).observe( jQuery( "#main" )[0], { childList: true } );



	var taskObserver = new MutationObserver( function ( mutations ) {
		setTimeout( filterTasks, 500 );
	} );

	function addObserverIfTaskListAvailable() {
		var taskList = jQuery( "#tasklisting" )[0];
		if ( !taskList )
		{
			// The node we need does not exist yet.
			// Wait 500ms and try again
			window.setTimeout( addObserverIfTaskListAvailable, 500 );
			return;
		}

		taskObserver.observe( jQuery( "#tasklisting" )[0], { childList: true } );
	}
	addObserverIfTaskListAvailable();


	// added back in because I'm not as confident as James that we don't need a master reset back door. ;)
	jQuery( 'body' ).on( 'click', '#prefs b', showJobs );

	// your username and password:
	var username = "";
	var password = "";

	setTimeout( function () {
		var login_button = jQuery( '#gobutton' );
		if ( login_button )
		{
			jQuery( "#initials" ).val( username );
			jQuery( "#paswd" ).val( password );
			login_button.trigger( "click" );
		}
	}, 100 );

} );