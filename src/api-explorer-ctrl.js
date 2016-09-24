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

        initializeJsonViewer($scope, run, apiService);

        $scope.login = function () {
            adalService.login();
        };
        $scope.logout = function () {
            adalService.logOut();
        };
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.submitInterests = function(){
            $scope.showPref = false;
            $scope.showApp = true;
        }

        $scope.$on('adal:loginSuccess', function(){
            if($scope.userInfo.isAuthenticated){
                apiService.performQuery("GET")("https://graph.microsoft.com/v1.0/me", "").success(function (results, status, headers, config) {
                    var id = results["id"];
                    $scope.showPref = true;
                    
                    apiService.performQuery("GET")("https://foobar.com/users/"+id, "").success(function (results, status, headers, config) {
                        $scope.showPref = false;
                        results = JSON.stringify(results, null, 4).trim();
                        showResults($scope, results, headers);
                        $scope.showApp = true;
                    }).error(function (err, status) {
                        $scope.showPref = true;
                    });            
                }).error(function (err, status) {
                    handleJsonResponse($scope, startTime, err, null);
                });
            
        }
  });

            if($scope.userInfo.isAuthenticated){
                apiService.performQuery("GET")("https://graph.microsoft.com/v1.0/me", "").success(function (results, status, headers, config) {
                    var id = results["id"];
                    $scope.showPref = true;
                    
                    apiService.performQuery("GET")("https://foobar.com/users/"+id, "").success(function (results, status, headers, config) {
                        $scope.showPref = false;
                        results = JSON.stringify(results, null, 4).trim();
                        showResults($scope, results, headers);
                        $scope.showApp = true;
                    }).error(function (err, status) {
                        $scope.showPref = true;
                    });            
                }).error(function (err, status) {
                    handleJsonResponse($scope, startTime, err, null);
                });
            
        }  
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