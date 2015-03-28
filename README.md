# About

This is a project I started to create an MVC stlye framework back in 2010. Little later after development I learned about Backbone.js and abandoned the development, because it looked more robust and community driven and I lacked the time anyways. By posting this I only want to release it for achiveal purposes. 

# Features

* No 3rd party dependencies
* Separate model handling
* On demand script loading 
* Controllers

# Usage

```javascript
// Initialize MyJS MVC
app.model = new Model();
app.view = new View( app.model );
app.controller = new Controller();  

// Create model (it can be an array or an object as well)
app.model.set( 'header', 'Hello world!' );

// Create a view (add rendering logic)
app.view.register('list', function( data )
{
	var tpl = '<h1>' + data.header + '</h1>';
	return tpl;
});

// Add a controller
app.controller.register( 'hello_world', function()
{
	// Connect the model to the template
	app.view.assign( 'list', 'header' );

	// Render the template into the element with the id: "dst" 
	app.view.render( 'list', 'dst' ); 
});

// Attach the controller to a button with an event
app.controller.toElement( $('my_button'), 'click', 'hello_world' );
```

# Demo

I developed a simple email application interface, see it in the demo folder