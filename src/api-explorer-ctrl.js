angular.module('ApiExplorer').directive('imageloaded', [

    function () {

        'use strict';

        return {
            restrict: 'A',

            link: function(scope, element, attrs) {   
                var cssClass = attrs.loadedclass;

                element.bind('load', function (e) {
                    angular.element(element).addClass(cssClass);
                });
            }
        }
    }
]);

angular.module('ApiExplorer')
    .controller('ApiExplorerCtrl', ['$scope', 'adalAuthenticationService', '$location', 'ApiExplorerSvc', function ($scope, adalService, $location, apiService) {
        var expanded = true;

        $scope.selectedOptions = "GET";
        $scope.selectedVersion = "v1.0";
        $scope.showJsonEditor = false;
        $scope.showDuration = false;
        $scope.showJsonViewer = true;
        $scope.showPref = false;
        $scope.showImage = false;
        $scope.showApp = false;
        $scope.selectedString = "";
        $scope.userId = "";
        $scope.displayName = "";
        $scope.data = [];

        $scope.cards = [
            {name: 'Vi Lu', symbol: '1', aboutMe: "me info", interests: "interests1 2"},
            {name: 'Dan Kershaw', symbol: '2', aboutMe: "me info", interests: "interests3 2"},
            {name: 'Pooja Ana', symbol: '3', aboutMe: "me info", interests: "interests1 4"},
            {name: 'Qi Fo', symbol: '4', aboutMe: "me info", interests: "interests6 4"}
        ];

        $scope.throwout = function (eventName, eventObject) {
            eventObject.target.hidden = true;
            console.log('throwout', eventObject);
        };

        $scope.throwoutleft = function (eventName, eventObject) {
            console.log('throwoutleft', eventObject);
        };

        $scope.throwoutright = function (eventName, eventObject) {
            console.log('throwoutright', eventObject);
        };

        $scope.throwin = function (eventName, eventObject) {
            console.log('throwin', eventObject);
        };

        $scope.dragstart = function (eventName, eventObject) {
            console.log('dragstart', eventObject);
        };

        $scope.dragmove = function (eventName, eventObject) {
            console.log('dragmove', eventObject);
        };

        $scope.dragend = function (eventName, eventObject) {
            console.log('dragend', eventObject);
        };      

$scope.photos = [
    {'name': 'Sports', src: "http://lorempixel.com/130/170/sports/sports"},
    {'name': 'Career', src: "http://lorempixel.com/130/170/business/career"},
    {'name': 'Pets', src: "http://lorempixel.com/130/170/cats/pets"},
    {'name': 'Nightlife', src: "http://lorempixel.com/130/170/nightlife/nightlife"},
    {'name': 'Tech', src: "http://lorempixel.com/130/170/technics/tech"},
    {'name': 'Travel', src: "http://lorempixel.com/130/170/transport/travel"},
    {'name': 'Hiking', src: "http://lorempixel.com/130/170/nature/hiking"},
    {'name': 'Food', src: "http://lorempixel.com/130/170/food/food"},
    {'name': 'Fashion', src: "http://lorempixel.com/130/170/fashion/fashion"},
    {'name': 'Paragliding', src: "http://lorempixel.com/130/170/sports/3/Paragliding"},
    {'name': 'PersonalDevelopment', src: "http://lorempixel.com/130/170/business/2/Personal%20Developement"},
    {'name': 'Cats', src: "http://lorempixel.com/130/170/cats/2/Cats"},
    {'name': 'Dancing', src: "http://lorempixel.com/130/170/nightlife/2/Dancing"},
    {'name': 'Appletech', src: "http://lorempixel.com/130/170/technics/2/Apple tech"},
    {'name': 'Rain', src: "http://lorempixel.com/130/170/transport/2/Rain"},
    {'name': 'Scenery', src: "http://lorempixel.com/130/170/nature/2/Scenery"},
    {'name': 'HealthyEating', src: "http://lorempixel.com/130/170/food/2/Healthy%20Eating"},
    {'name': 'Bollywood', src: "http://lorempixel.com/130/170/fashion/2/Bollywood"}    
];        

        initializeJsonViewer($scope, run, apiService);

        $scope.onInterestClick = function(index){
            $scope.selectedString += index;
        }

        $scope.login = function () {
            adalService.login();
        };
        $scope.logout = function () {
            adalService.logOut();
        };
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.showAppGetUsers = function(results){
            $scope.showApp = true;
            var listOfIds = [];
            for(var i = 0 ; i < results.length; i++){
                listOfIds.push(results[i].UserId);
                apiService.performQuery("GET")("https://graph.microsoft.com/beta/users/" + results[i].UserId +"?$select=interests,aboutMe", "").success(function (results, status, headers, config) {
                    // need to populate list of datalist
                    results.count = "pane" + (i % 4 + 2);
                    $scope.data.push(results);
                    $scope.cards.push({name: 'Yi Li', symbol: '4', aboutMe: "me info", interests: "interests6 4"});
                }).error(function (err, status) {
                });                
            }

            //get the list of IDs

            //get all the details of the users

            
            // create the cards

            // figure out how to solve for more than 5 lol.

            // if there are no more people left, then quit.
        }

        $scope.submitInterests = function(){
            var bodyElt = "[";
            var count = 0;
            
            var selectedStringArr = $scope.photos;
            for(var elt = 0; elt < selectedStringArr.length; elt++){
                if($scope.photos[elt].showIndex == true){
                    if(count != 0){
                        bodyElt += ",";
                    }
                    count++;
                    bodyElt += "\"" + $scope.photos[elt].name + "\"";
                }
            }
            bodyElt += "]";
            apiService.performQuery("POST")("http://interestsdataapi.azurewebsites.net/api/interests/"+$scope.userId, bodyElt).success(function (results, status, headers, config) {
                $scope.showPref = false;
                results = JSON.stringify(results, null, 4).trim();
            }).error(function (err, status) {
                $scope.showPref = true;
            });
            
            $scope.showPref = false;
            getUsersAll();
        }

        var getUsersAll = function(){
            apiService.performQuery("GET")("http://interestsdataapi.azurewebsites.net/api/interests", "").success(function (results, status, headers, config) {
                $scope.showPref = false;
                if(results !== null){
                    $scope.showAppGetUsers(results);
                }
                else{
                    $scope.showPref = true;
                }
            }).error(function (err, status) {
                $scope.showPref = true;
            });            
        }        

        var getUsers = function(){
            apiService.performQuery("GET")("http://interestsdataapi.azurewebsites.net/api/interests/"+$scope.userId, "").success(function (results, status, headers, config) {
                $scope.showPref = false;
                if(results !== null){
                    results = JSON.stringify(results, null, 4).trim();
                    showResults($scope, results, headers);
                    getUsersAll();
                }
                else{
                    $scope.showPref = true;
                }
            }).error(function (err, status) {
                $scope.showPref = true;
            });            
        }

        var getMSUserData = function (){

        }

        var functionUserExists = function(){
            if($scope.userInfo.isAuthenticated){
                apiService.performQuery("GET")("https://graph.microsoft.com/v1.0/me", "").success(function (results, status, headers, config) {
                    var id = results["id"];
                    $scope.userId = id;
                    $scope.displayName = results["displayName"];
                    $scope.showPref = true;
                    
                    getUsers();

                }).error(function (err, status) {
                    handleJsonResponse($scope, startTime, err, null);
                });
        }
  };

        $scope.$on('adal:loginSuccess', functionUserExists);
        functionUserExists();
}]);

angular.module('ApiExplorer')
    .controller('DropdownCtrl', function ($scope, $log) {
        $scope.selectedOptions = "GET";

        $scope.items = [
            'GET',
            'POST',
            'PATCH',
            'DELETE'
          ];

        $scope.OnItemClick = function (selectedOption) {
            $log.log(selectedOption);
            $scope.selectedOptions = selectedOption;
            $scope.$parent.selectedOptions = selectedOption;
            if (selectedOption == 'POST' || selectedOption == 'PATCH') {
                $scope.$parent.showJsonEditor = true;
                initializeJsonEditor($scope.$parent);
            } else if (selectedOption == 'GET' || selectedOption == 'DELETE') {
                $scope.$parent.showJsonEditor = false;
            }
        }
    });

angular.module('ApiExplorer')
    .controller('VersionCtrl', function ($scope, $log) {
        $scope.selectedVersion = "Version";

        $scope.items = [
            'beta',
            'v1.0',
          ];

        $scope.OnItemClick = function (selectedVersion) {
            $log.log(selectedVersion);
            $scope.selectedVersion = selectedVersion;
            $scope.$parent.selectedVersion = selectedVersion;
            $scope.$parent.text = $scope.$parent.text.replace(/https:\/\/graph.microsoft.com($|\/([\w]|\.)*($|\/))/, "https://graph.microsoft.com/" + selectedVersion + "/");
        }
    });

angular.module('ApiExplorer')
    .controller('datalistCtrl', function ($scope, $log) {
        $scope.urlOptions = [];

        $scope.$parent.$on("clearUrls", function (event, args) {
            $scope.urlOptions = [];
        });

        $scope.$parent.$on("populateUrls", function (event, args) {
            $scope.urlOptions = [
                "https://graph.microsoft.com/v1.0/me",
                "https://graph.microsoft.com/v1.0/users",
                "https://graph.microsoft.com/v1.0/me/messages",
                "https://graph.microsoft.com/v1.0/drive",
                "https://graph.microsoft.com/v1.0/groups",
                "https://graph.microsoft.com/v1.0/devices",
                "https://graph.microsoft.com/beta/me",
                "https://graph.microsoft.com/beta/users",
                "https://graph.microsoft.com/beta/me/messages",
                "https://graph.microsoft.com/beta/drive",
                "https://graph.microsoft.com/beta/devices",
                "https://graph.microsoft.com/beta/groups",
                "https://graph.microsoft.com/beta/me/notes/notebooks"
            ];
        });
    });

angular.module('ApiExplorer').controller('FormCtrl', ['$scope', '$log', 'ApiExplorerSvc', 'ngProgressFactory', function ($scope, $log, apiService, ngProgressFactory) {
    $scope.text = 'https://graph.microsoft.com/v1.0/';
    $scope.duration = "";
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.listData = "requestList";
    $scope.photoData = "";
    $scope.responseHeaders = "";

    $scope.$emit('populateUrls');

    // custom link re-routing logic to resolve links
    $scope.$parent.$on("urlChange", function (event, args) {
        msGraphLinkResolution($scope, $scope.$parent.jsonViewer.getSession().getValue(), args);
    });

    $scope.submit = function () {
        $scope.$emit('clearUrls');
        if ($scope.text) {
            $scope.previousString = $scope.text;
            $log.log($scope.text);

            if ($scope.userInfo.isAuthenticated) {
                $scope.showJsonViewer = true;
                $scope.showImage = false;

                $scope.progressbar.reset();
                $scope.progressbar.start();
                var postBody = "";
                if ($scope.jsonEditor != undefined) {
                    postBody = $scope.jsonEditor.getSession().getValue();
                }
                var startTime = new Date();
                var endTime = null;
                apiService.performQuery($scope.selectedOptions)($scope.text, postBody).success(function (results, status, headers, config) {
                    if (isImageResponse(headers)) { 
                        handleImageResponse($scope, apiService, headers);
                    } else if (isHtmlResponse(headers)) {  
                        handleHtmlResponse($scope, startTime, results, headers);
                    } else if (isXmlResponse(results)) {
                        handleXmlResponse($scope, startTime, results, headers);
                    } else {
                        handleJsonResponse($scope, startTime, results, headers);
                    }
                }).error(function (err, status) {
                    handleJsonResponse($scope, startTime, err, null);
                });
            }
        }
    };
}]);