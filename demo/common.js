
	/*********************************
	 *
	 *	Frequently used JS functions
	 *
	 *********************************/

	var $ = function( el )
	{
		return document.getElementById( el ); 
	}

    /**
     *  See http://www.quirksmode.org/dom/getstyles.html     
     */         
    var getStyle = function( element, styleProp )
    {
		element = ( typeof element !== 'object' ) ? $( element ) : element;

        if ( typeof element.currentStyle !== 'undefined' )
    	{
    		var style = element.currentStyle[styleProp];
        }
    	else if ( window.getComputedStyle )
    	{
    		var style = document.defaultView.getComputedStyle( element,null ).getPropertyValue( styleProp );
        }
    	return style;
    }

	/**
	 *	Toggles the display of an element
	 *	@param element { str|object } an ID or a dom object reference
	 */
	var toggle = function( element )
	{
		element = ( typeof element !== 'object' ) ? $( element ) : element;
		element.style.display = ( getStyle( element, 'display')  == 'block' ) ? 'none' : 'block';
	}
