
	app.controller.register( 'comm', {
		
		initialize: function()
        {
            // Create a data store for the sent emails
            app.model.set( 'sent_emails_model', { 'emails': [] } );
		},
		
		send_email: function()
		{
            if( $('target').value == '' )
            {
                alert('Add at least one recipient!');
                return false;
            }
            
            if( $('subject').value == '' )
            {
                alert('Set a subject to the letter please!');
                return false;
            }
            
            if( $('message').value == '' )
            {
                alert('Write something, the letter is empty!');
                return false;
            }

            var email_data = {
                'sender': '&lt;'+$('target').value+'&gt;', 
                'address': $('target').value, 
                'subject': $('subject').value, 
                'sent_at': Math.floor( new Date().getTime()/1000 ), 
                'message': $('message').value
            }

            var sent_mails = app.model.get( 'sent_emails_model' );
            sent_mails.emails.push( email_data );              
            app.model.set( 'sent_emails_model', sent_mails );

            // Bye-bye data
            $('send_form').reset();
            
            // Show the default view
            toggle('viewport');
            toggle('send_form');
        }
	});
