$( document ).bind( "mobileinit", function() {

            $.mobile.allowCrossDomainPages = true;
            $.support.cors = true;
            $.mobile.ajaxEnabled = true;
            $.mobile.phonegapNavigationEnabled = true ;
            $.mobile.pushStateEnabled = false;
            $.mobile.buttonMarkup.hoverDelay = 0 ;
            $.mobile.defaultPageTransition   = 'none';
            
        });  