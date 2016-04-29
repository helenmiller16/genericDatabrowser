// Main controller
// Exposes the model to the template
// Contains plot options and overlay options

(function() {
  'use strict';

  angular.module('App')
    .controller('Main', Main);

  Main.$inject = ['$scope', 'DataService', 'RequestService', '$location'];

  function Main($scope, DataService, RequestService, $location) {

    // vm stands for view model
    var vm = this;

    vm.request = DataService.request;

    vm.forms = DataService.forms;

    vm.updatePlot = updatePlot;                 
    vm.status = RequestService.status;          // request status and results
    vm.popup = { visible: false, url: null };   // plot zoom popup object

    // Initial plot
    updatePlot();

    ///////////////
    // FUNCTIONS
    ///////////////

    // Make request
    function updatePlot() {
      RequestService.get(DataService.request)
        .then(function(result) {
          DataService.result = result;
        });
    }

    ///////////////
    // SCOPE
    ///////////////

    // Watched for changes in plotURL, which translates to this function firing
    // whenever a successful request is made
    $scope.$watch(function() {
      return DataService.result;
    }, function() {
      if(DataService.result) {
        vm.url = DataService.result.data.rel_base + ".png";
        vm.popup.url = vm.url;
      }
    });

    // When URL params change apply those changes to the request object
    $scope.$watch(function() {
      return $location.search();
    }, function(params, old) {

      // If param is an attribute of request, add it's 
      // value to request
      for (var attr in params) {
        if (vm.request.hasOwnProperty(attr)) {
          vm.request[attr] = params[attr];
        }
      }

    }, true);

    // When the request object changes apply those changes to the URL params
    $scope.$watch(function() { 
      return vm.request; 
    }, function(params) {

      var par = $location.search();
      for (var attr in params) {
        par[attr] = params[attr];
      }
      $location.search(par);

    }, true);

  }

})();