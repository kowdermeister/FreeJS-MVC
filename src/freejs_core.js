
/*************************************************
 *
 * 	Project name: MyJS MVC
 *  An MVC Framework for JavaScript
 *
 *  Author: Tibor Szász | http://tibor.szasz.hu
 *
 *  License: LGPL 
 *
 *  / plese notify me if you contribute 
 *	  anything to this project /
 *
 *  Depencencies: Library independent
 *
 * 	"Code is poetry" :)
 *
 *************************************************/

(function(env)
{
	var FreeJS = {};

	FreeJS.options = {
		"version": 0.2,
		"scan_anchors": true,
		"current_hash": ""
	};

	/**
	 *	BASE: A basic object with handy methods
	 */
	var BaseMVC = function()
	{
		var that = this;
	
		this.store = {};
		
		this.set = function( key, value )
		{
			that.store[ key ] = value;
		}

		this.get = function( key )
		{
			return that.store[ key ];
		}

		this.load = function( url, callback )
		{
			/**
			 *  Based on the jQeury solution
			 */
			var head = document.documentElement;
			var script = document.createElement('script');   
			var done = false;

			script.src = url;

			script.onload = script.onreadystatechange = function()
			{
				if( !done && ( !this.readyState || this.readyState === "loaded" || this.readyState === "complete" ))
				{
					done = true;
					if( callback ){ callback(); }
	
					// IE Memory leak bugfix
					script.onload = script.onreadystatechange = null;
					if( head && script.parentNode )
					{
						head.removeChild( script );
					}
				}
			}
			head.insertBefore( script, head.firstChild );
			return undefined;
		}
	}

    /**
     *  AJAX Functionality
     *   - optimized for JSON, which is faster than XML     
     */         
    var XHR = function( url, query, opts )
    {
        // Default options
        this.options = {
            method: 'POST',
            evalJSON: true,
            callback: function(){}
        }

        for( key in opts )
        {
            this.options[ key ] = opts[ key ];  
        }

        var request = false;
        
        if ( window.XMLHttpRequest )
        {
            request = new XMLHttpRequest();
        } 
        else if ( window.ActiveXObject )
        { 
            try { request = new ActiveXObject("Msxml2.XMLHTTP"); } 
            catch (e)
            {
                try{ request = new ActiveXObject("Microsoft.XMLHTTP"); } 
                catch (e){ new Error('AJAX Request object creation error in FreeJS core (P1)'); }
            }
        }
        if ( !request )
        {  
            new Error('AJAX Request object error in FreeJS core (P2)'); 
            return false;
        }
        request.open( this.options.method, url, true );
        
        var pass = this;
        request.onreadystatechange = function()
        { 
            if ( request.readyState == 4 ) 
            {
                if ( request.status == 200 )
                { 
                    if( pass.options.callback )
                    {
                        var rsp = request.responseText;
                        
                        if( pass.options.evalJSON )
                        {   
                            rsp = eval( '(' + rsp + ')' ); 
                        }
                        pass.options.callback( rsp );
                    } 
                }
                else 
                { 
                    new Error('AJAX Request failed (P3), response code: ' + request.status ); 
                }
            }
        }                          
        if( this.options.method == 'POST' )
        {
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
        request.send( query );

        return request;
    }

	/**
	 *  MODEL: Data storage
	 */
	var Model = function(){};
	Model.prototype = new BaseMVC();
	
	Model.prototype.ajax = function( url, query, opts )
    {
        var req = new XHR( url, query, opts );
        return req;
    }


	/**
	 *  VIEW: Data presentation, GUI building, etc
	 */
	var View = function( model ){
		this._model = model;
		this.assigns = {};
		this.assigned_values = [];
	}

	View.prototype = new BaseMVC();
	
	View.prototype.register = function( tpl_name, tpl )
	{
		this.set( tpl_name, tpl );
	}

    /**
     *  Assigns a model or a key/value pair to the registered view
     *  @param model_element { mixed: string | array }
     *      - string: model name to assign
     *      - array: key, value to assign. it will be represented as a model               
     */
	View.prototype.assign = function( tpl_name, model_element )
	{
        if( typeof model_element == 'string' )
        {
    		if( typeof this.assigns[ tpl_name ] !== 'undefined' )
    		{
    			this.assigns[ tpl_name ].push( model_element );
    		}
    		else
    		{
    			this.assigns[ tpl_name ] = [ model_element ];
    		}
        } 
        else 
        {
            // Variable assignment support
            this.assigned_values.push( model_element );
        }
	}

	View.prototype.render = function( tpl_name, destination )
	{
		var tpl_fn = this.get( tpl_name );
		var tpl_str = '';
		var data = {};

		// Assign variables 
		for( i=0; i < this.assigned_values.length; i++ )
		{
			data[ this.assigned_values[i][0] ] = this.assigned_values[ i ][1];
		}
	
		if( tpl_name in this.assigns )
		{
			// Assign models
			var assigns = this.assigns[ tpl_name ];

			for( i=0; i < assigns.length; i++ )
			{
				data[ assigns[i] ] = this._model.get( assigns[ i ] );
			}

		}
		tpl_str = tpl_fn( data );

		if( typeof destination !== 'undefined' )
		{
			$( destination ).innerHTML = tpl_str;
		} 
		else 
		{
			return tpl_str;
		}
	}

   	View.prototype.ajax = function( url, query, callback )
    {
        var opts = {
            callback: callback,
            evalJSON: false
        }
        var req = new XHR( url, query, opts );
        return req;
    }



	/**
	 *  CONTROLLER: Fires methods, connects views with models
	 */
	var Controller = function()
	{
		// This array logs the URL hashes that triggers controllers
		this.hashes = [];
	}
	Controller.prototype = new BaseMVC();

	/**
	 *  Maybe event handling should go here as a third parameter
	 *  or binding controller to elements...
	 */
	Controller.prototype.register = function( ctrl_name, methods )
	{
		methods.initialize();
		this.set( ctrl_name, methods );
	}

	/**
	 *  Invokes the desired controller's method
	 */
	Controller.prototype.call = function( ctrl_name, method )
	{
		var args = [];
		for( var i in arguments )
		{
			if( i > 1 ) args.push( arguments[i] );
		}
		this.get( ctrl_name )[ method ]( args );
	}


	Controller.prototype.toElement = function( element, event_name, controller_method )
	{
		var pass = this;
		var args = [];
		var element = ( typeof element == 'string' ) ? document.getElementById( element ) : element;
		var ctrl = ( controller_method.indexOf('/') > -1 ) ? controller_method.split('/') : controller_method;  

		for( var i in arguments )
		{
			if( i > 2 ) args.push( arguments[i] );
		}
		element.addEventListener( event_name, function()
		{
		    // if array
			if( typeof ctrl == 'object' ) 
            {
                pass.call( ctrl[0], ctrl[1], args );
            }
            else // else no method was given, so call initialize
            {
                pass.call( ctrl, 'initialize', args );
            }

		}, false );
	}


	FreeJS.parseHash = function()
	{
		var hashObj = {};
		var hashStr = document.location.href;

		if( hashStr.indexOf('#') > -1 )
		{
			var hash = hashStr.split('#');
			hashObj.raw = hash[1];

			if( hashStr.indexOf(':') > -1 )
			{
				var args = '';
				var base = hash[1].split(':',1)[0];
				for( i=hash[1].indexOf(':')+1; i<hash[1].length; i++ )
				{
					args += hash[1][i];
				}
				hashObj.arguments = args.split(':');
				hashObj.controller = base.split('/')[0];
				hashObj.method = base.split('/')[1];
			}
			else
			{
				hashObj.arguments = [];
				hashObj.controller = args[0].split('/')[0];
				hashObj.method = args[0].split('/')[1];
			}
		}
		return hashObj;
	}


	FreeJS.initialize = function()
	{
		return function()
		{
			var pass = this;

			/**
			 *	Hashmark watcher timer
			 */
			this.timer = setInterval( function()
			{
				if( document.location.href.indexOf('#') > 0 )
				{
					var hash = FreeJS.parseHash();
					if( pass.current_hash !== hash.raw )
					{
						pass.current_hash = hash.raw;
						var controller = pass.controller.get( hash.controller );
						controller[ hash.method ].apply( controller, hash.arguments );
					}
				}
			},100 );

			for( var o in FreeJS.options )
			{
				this[o] = FreeJS.options[o];
			}
			this.model = new Model();
			this.view = new View( this.model );
			this.controller = new Controller();
		};
	};

	/**
	 * 	Copy FreeJS to the global environment
	 */
	env.FreeJS = FreeJS.initialize();

})(window);













