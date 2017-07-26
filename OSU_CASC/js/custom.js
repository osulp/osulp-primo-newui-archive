(function () {
    "use strict";
    'use strict';


    var app = angular.module('viewCustom', ['angularLoad']);

// Add Clickable Logo
app.component('prmLogoAfter', {
    template: '<a href="cascades.library.oregonstate.edu"><img src="custom/OSU_CASC/img/library-logo.png" height="60px" border="0px" /></a>'
});    
    
    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/

})();

   
