'use strict';

/**
 * @ngdoc function
 * @name redditApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the redditApp
 */
angular.module('redditApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
