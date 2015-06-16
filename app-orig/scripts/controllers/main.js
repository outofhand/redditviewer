'use strict';

/**
 * @ngdoc function
 * @name redditApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the redditApp
 */
angular.module('redditApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
