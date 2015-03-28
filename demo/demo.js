
/***************************************************************
 *    TEST MVC Application                                     *
 ***************************************************************/

var app = {};

window.onload = function()
{
    app = new FreeJS();

    // Load a library
    app.model.load('common.js');
    
    // Main view
    app.view.load('view.email_list.js?2');
    
    // Get the main controller
    app.controller.load( 'controller.default.js?2' );
    app.controller.load( 'controller.comm.js?2' );
    
    // Element bindings
    app.controller.toElement( 'logo', 'click', 'default/initialize' );
    app.controller.toElement( 'compose', 'click', 'default/create_email' );
    app.controller.toElement( 'cancel_mail', 'click', 'default/create_email' ); // alias
    app.controller.toElement( 'send_mail', 'click', 'comm/send_email' );
    app.controller.toElement( 'sent_mails', 'click', 'default/sent_emails_list' );
}
