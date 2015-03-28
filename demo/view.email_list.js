
    // Email list creation
    app.view.register('email_list', function( model )
    {
        var tpl = '<ul id="mail_list">'
        var emails = model.email_data.emails; 

        for( e in emails )
        {
            var date = new Date( emails[e].sent_at * 1000 );
            var date_str = '( ' + date.getHours() + ':' + date.getMinutes() + ' ) ' + date.toDateString(); 
            tpl += '<li><a href="#default/show_email:'+e+'"><span class="name">'+ emails[e].sender +'</span><span class="subject">'+ emails[e].subject +'</span><span class="date">'+ date_str +'</span></a></li>';
        }
        tpl += '</ul>';

        return tpl;
    });

    // Sent emails list
    app.view.register('sent_emails', function( model )
    {
        var tpl = '<ul id="mail_list">'
        console.log(model)
        var emails = model.sent_emails_model.emails; 

        for( e in emails )
        {
            var date = new Date( emails[e].sent_at * 1000 );
            var date_str = '( ' + date.getHours() + ':' + date.getMinutes() + ' ) ' + date.toDateString(); 
            tpl += '<li><a href="#default/show_sent_email:'+e+'"><span class="name">'+ emails[e].sender +'</span><span class="subject">'+ emails[e].subject +'</span><span class="date">'+ date_str +'</span></a></li>';
        }
        tpl += '</ul>';

        return tpl;
    });


    // Email message display
    app.view.register('full_email', function( model )
    {
        var tpl = '<table cellspacing=0>' +
                    '<tr><td>Sender</td><td>'+ model.mail_body.sender +'</td></tr>' +
                    '<tr><td>Address</td><td>'+ model.mail_body.address +'</td></tr>' +
                    '<tr><td>Subject</td><td>'+ model.mail_body.subject +'</td></tr>' +
                    '<tr><td>Message</td><td>'+ model.mail_body.message +'</td></tr>'
                  '</table>';
        return tpl;
    });


