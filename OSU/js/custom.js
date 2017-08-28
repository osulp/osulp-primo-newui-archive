(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);
   
// add chat widget to header    
app.component('prmSearchBookmarkFilterAfter', {
    bindings: {},
    template: '<div class="chat"><a ng-href="http://answers.library.oregonstate.edu/widget_standalone.php?hash=848ad121b384a3768c03838752654abb" target="_blank">Live Chat</a></div>'
}); 

// show/hide borrowing institutions    
app.component('prmAlmaMoreInstAfter', {
    controller: 'institutionToggleController',
    template: '<md-button class="md-raised" ng-click="toggleLibs()">\n\t\t\t{{ showLibs ? \'Hide Libraries &laquo;\' : \'Show Libraries &raquo;\' }}\n\t\t\t</md-button>'
}).controller('institutionToggleController', ['$scope', function ($scope) {
    this.$onInit = function () {
        $scope.showLibs = false;
        $scope.button = angular.element(document.querySelector('prm-alma-more-inst-after'));
        $scope.tabs = angular.element(document.querySelector('prm-alma-more-inst md-tabs'));
        $scope.tabs.addClass('hide');
        $scope.button.after($scope.tabs);
        $scope.toggleLibs = function () {
            $scope.showLibs = !$scope.showLibs;
            if ($scope.tabs.hasClass('hide')) $scope.tabs.removeClass('hide');else $scope.tabs.addClass('hide');
        };
    };
}]);

// add Google Scholar and Worldcat search in facet pane   
app.component('prmFacetExactAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope) {

        console.log($scope.$parent.$ctrl.facetGroup.name);
        if ($scope.$parent.$ctrl.facetGroup.name == "tlevel") {
            this.class = "WC_show";
        } else {
            this.class = "WC_hide";
        }

        try {
            this.query = this.parentCtrl.facetService.$location.$$search.query.split(",")[2];
        } catch (e) {
            this.query = "";
        }
    },
    template: '<div class="{{$ctrl.class}}"><div aria-label="Search in Worldcat" class="section-title md-button md-primoExplore-theme md-ink-ripple layout-fill" style="" ><div class="layout-align-start-center layout-row"><h3 class="section-title-header"><span title="External Search" translate="External Search"></span></h3></div><div class="md-ripple-container"></div></div><div aria-hidden="false" class="section-content animate-max-height-variable" style=""><div class="md-chips md-chips-wrap"><div aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="Search Worldcat" ><a href="https://www.worldcat.org/search?qt=worldcat_org_all&q={{$ctrl.query}}" target="_blank"><img src="https://cdn.rawgit.com/Alliance-PCJWG/primo-explore-worldcat-button/7ee112df/img/worldcat-logo.png" width="22" height="22" alt="worldcat-logo" style="vertical-align:middle;"> Search Worldcat</a></strong></div></div><div aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="Search Google Scholar" ><a href="https://scholar.google.com/scholar?q={{$ctrl.query}}" target="_blank"> <img src="custom/OSU/img/gscholar.png" width="22" height="22" alt="google-scholar-logo" style="vertical-align:middle;"> Google Scholar</a></strong></div></div></div></div>'
});   
    
// add oaDOI api search for resources outside of iframe    
app.component('prmFullViewServiceContainerAfter', {
  bindings: { parentCtrl: '<' },
    controller: function controller($scope, $http, $q, $element) {
        this.$onInit = function() {
            $scope.oaDisplay=false; /* default hides template */      
            var section=$scope.$parent.$ctrl.service.scrollId;
            var obj=$scope.$ctrl.parentCtrl.item.pnx.addata;
            if (obj.hasOwnProperty("doi")){
                var doi=obj.doi[0];           
                console.log("doi:"+doi)
                if (doi && section=="getit_link1_0"){
                    var url="https://api.oadoi.org/"+doi;
                    var promise = this.asyncGreet(url);
                    promise.then(function(oalink) {
                        console.log(oalink);                    
                        if(oalink===null){
                            $scope.oaDisplay=false;                        
                            console.log("it's false");
                            $scope.oaClass="ng-hide";                        
                        }
                        else{
                            $scope.oalink=oalink;
                            $scope.oaDisplay=true;
                            $element.children().removeClass("ng-hide"); /* initially set by $scope.oaDisplay=false */
                            $scope.oaClass="ng-show";
                        }
                    }, function(reason) {
                        console.log(reason);
                    }, function(update) {
                        console.log(update);
                    });
                }
                else{$scope.oaDisplay=false;                
                }            
            }
            else{
                $scope.oaClass="ng-hide";
            }
        };
        this.asyncGreet=function (url) {
          var deferred = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: { "X-From-ExL-API-Gateway": undefined }
            }).then(function successCallback(response, $scope) {
                console.log("it worked");
                console.log(response);
                var oalink=response.data.results[0].free_fulltext_url;
                console.log(oalink);
                ///return oalink;
                deferred.notify=oalink                    
                deferred.resolve(oalink);
            }, function errorCallback(response) {
                console.log(response);
                console.log("it didn't work");
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });                
            return deferred.promise;
        }
    },
  template: '<div style="height:50px;background-color:white;padding:15px;" ng-show="{{oaDisplay}}" class="{{oaClass}}"><img src="custom/LCC/img/oa_50.png" style="float:left;height:22px;width:22px;margin-right:10px"><p >Full text available via: <a href="{{oalink}}" target="_blank" style="font-weight:600;font-size:15px;color;#2c85d4;">Open Access</a></p></div>'
});    
   
// force users to login despite services page they come from    
app.component('prmAuthenticationAfter', {
    bindings: { parentCtrl: '<' },
    controller: function($location) {
        this.$onInit = function() {
            if (($location.search().isSerivcesPage || $location.search().isServicesPage) && !this.parentCtrl.isLoggedIn) {
                this.parentCtrl.loginService.handleLoginClick();
            }
        };
    }
});  
  
})();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-35760875-20');
  ga('send', 'pageview');
  ga('set', 'anonymizeIp', true);


/* In Progress 
    
// report a problem - not working yet   
angular
  .module('reportProblem', [])
  .component('prmActionListAfter', {
    template: `
    <div class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">
        <span class="margin-right-small">{{ message }}</span>
        <a ng-href="{{ link }}">
            <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme md-ink-ripple" type="button" aria-label="Report a Problem" style="color: #5c92bd;">
                <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>
                <span style="text-transform: none;">{{ button }}</span>
                <div class="md-ripple-container"></div>
            </button>
        </a>
    </div>
    `,
    controller: ['$scope', '$location', 'reportProblemOptions',
      function ($scope, $location, reportProblemOptions) {
        $scope.message = reportProblemOptions.message
        $scope.button = reportProblemOptions.button
        $scope.link = reportProblemOptions.base + $location.search().docid
      }]
  })
 
app.constant('reportProblemOptions', {
  message: "See something that doesn't look right?",
  button: "Report a Problem",
  base: ""
})

// OSU branding - header    
app.component('prmshowPrimoExploreAfter', {
    bindings: {},
    templateUrl: 'custom/OSU/html/osu-header.html'
});   
        
    
function add_custom_header(header_container)
{
	console.log("... in add_custom_header function");
	var header_container = angular.element(document.getElementsByClassName('custom-header'));
	if(header_container.length == 0)
	{
		var custom_header_html = '<div id="header"><div id="osu-top-hat" class="new container-fluid"><a href="http://www.oregonstate.edu"><img src="http://oregonstate.edu/themes/osu/drupal8-osuhomepage/logo.svg" alt="Oregon State University "></a> </div><h1><a href="http://library.oregonstate.edu">Libraries</a></h1><div id="mobile-icon-menu"><a href="#" id="toggle-mobile-menu" class="m-icon-link"><i class="icon-reorder"></i></a></div><div id="page-wrapper" class="container-fluid"><div id="main-menu" role="navigation"><div class="region region-nav"><div id="block-nice-menus-1" class="block block-nice-menus"><div class="menu-container" id="desktop-menu"><ul class="nice-menu nice-menu-down nice-menu-main-menu" id="nice-menu-1"><li class="menuparent"><span title="" class="menu-top-level">Borrow &amp; Request</span><ul class="menu-dropdown fade"><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/reserves" title="">Course Reserves</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/ill" title="">Interlibrary Loan</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/purchase-request" title="">Purchase Request</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/borrowing-policies" title="">Borrowing Policies</a></li></ul></li><li class="menuparent"><span title="" class="menu-top-level">Help</span><ul class="menu-dropdown fade"><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/reference" title="">Ask a Librarian</a></li><li class="menu-dropdown-item"><a href="//guides.library.oregonstate.edu/" title="">Research Guides</a></li><li class="menu-dropdown-item"><a href="//diy.library.oregonstate.edu/" title="">Library DIY</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/graduate-students" title="">Workshops</a></li></ul></li><li class="menuparent"><span title="" class="menu-top-level">Meet &amp; Study Here</span><ul class="menu-dropdown fade"><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/reserve-room" title="">Reserve a Room</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/floormaps" title="">Floor Maps</a></li></ul></li><li class="menuparent"><span title="" class="menu-top-level">Tech &amp; Print</span><ul class="menu-dropdown fade"><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/loanable-equipment" title="">Loanable Equipment</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/copy-print-scan" title="">Copy, Print, Scan</a></li><li class="menu-dropdown-item"><a href="http://guides.library.oregonstate.edu/3Dprinting" title="">3D Printers</a></li><li class="menu-dropdown-item"><a href="//is.oregonstate.edu/service/large-format-poster-production" title="">Poster Printing</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/computers" title="">Computers</a></li></ul></li><li class="menuparent"><span title="" class="menu-top-level">About</span><ul class="menu-dropdown fade"><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/about/valley" title="">About the Valley Library</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/staff/directory" title="">Directory</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/policies" title="">Policies</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/visit" title="">Visiting</a></li><li class="menu-dropdown-item"><a href="//osulibrary.oregonstate.edu/jobs" title="">Jobs</a></li></ul></li></ul></div></div></div></div></div></div>'
		var prm_explore_main = angular.element(document.querySelector('prm-explore-main'));
		if(prm_explore_main.length == 1)
		{
			prm_explore_main.after(custom_header_html);
			var header_container = angular.element(document.getElementsByClassName('custom-header'));
			angular.element(header_container).after(prm_explore_main);
		}
		
		var prm_full_view_page = angular.element(document.querySelector('prm-full-view-page'));
		if(prm_full_view_page.length == 1)
		{
			prm_full_view_page.after(custom_header_html);
			var header_container = angular.element(document.getElementsByClassName('custom-header'));
			header_container.after(prm_full_view_page);
		}
		
		var prm_services_page = angular.element(document.querySelector('prm-services-page'));
		if(prm_services_page.length == 1)
		{
			prm_services_page.after(custom_header_html);
			var header_container = angular.element(document.getElementsByClassName('custom-header'));
			header_container.after(prm_services_page);
		}
	}
	else
	{
		console.log("header already exists - this function shouldn't have been called?!");
		console.log("path name: " + window.location.pathname);
	}
}
    

// change name of Export RIs action
/*document.addEventListener('DOMContentLoaded', function() {
  var elements = document.getElementsByTagName('span');
  var matches = Array.prototype.slice.call(elements).filter(function(e) {
    return e.getAttribute('translate') === 'fulldisplay.command.pushto.option.RISPushTo';
  });
  matches.forEach(function(element, index) {
    element.innerText = "Export RIS & EndNote";
  });
}, false);*/