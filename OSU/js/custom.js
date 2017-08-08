(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);
   
app.component('prmSearchBookmarkFilterAfter', {
    bindings: {},
    template: '<div class="chat"><a ng-href="http://answers.library.oregonstate.edu/widget_standalone.php?hash=848ad121b384a3768c03838752654abb" target="_blank">Chat</a></div>'
});    
    
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

/*

function hide_show_other_institutions() {
  if (angular.element(document.querySelector('md-tabs')).hasClass("hide")) {
    angular.element(document.querySelector('md-tabs')).removeClass("hide");
    angular.element(document.getElementsByClassName('hide_show_other_institutions_button')).text("Hide Libraries");
  } else {
    angular.element(document.querySelector('md-tabs')).addClass("hide");
    angular.element(document.getElementsByClassName('hide_show_other_institutions_button')).text("Show Libraries");
  }

  // place button above list of libraries 
  angular.element(document.querySelector('prm-alma-more-inst-after')).after(angular.element(document.querySelector('prm-alma-more-inst md-tabs')));
}
*/


