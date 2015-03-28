
	app.controller.register( 'default', {
		
		initialize: function()
        {
            // Load email data
            app.model.ajax('emails.json', '', { callback: function( rsp )
                {
                    // Add email data to the model registry
                    app.model.set( 'email_data', rsp );

                    // Attach the email model to the email view
                    app.view.assign( 'email_list', 'email_data' );

                    // Display the email list
                    app.view.render( 'email_list', 'viewport' );
                }
            });
		},

        show_email: function( id )
        {
            var mails = app.model.get( 'email_data' ).emails;

            // Assign email as variable
            app.view.assign( 'full_email', [ 'mail_body', mails[id] ] );
            
            app.view.render( 'full_email', 'viewport' );
        },


        show_sent_email: function( id )
        {
            var mails = app.model.get( 'sent_emails_model' ).emails;

            // Assign email as variable
            app.view.assign( 'full_email', [ 'mail_body', mails[id] ] );
            
            app.view.render( 'full_email', 'viewport' );
        },

        		
        create_email: function( id )
        {
            toggle('viewport');
            toggle('send_form');
        },

        sent_emails_list: function()
        {
            // Attach the email model to the email view
            app.view.assign( 'sent_emails', 'sent_emails_model' );

            // Display the email list
            app.view.render( 'sent_emails', 'viewport' );
        }
	});


