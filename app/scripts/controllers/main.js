'use strict';

/**
 * @ngdoc function
 * @name redditApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the redditApp
 */
angular.module('redditApp')

	.directive("stickyNav", function stickyNav($window){  
	  function stickyNavLink(scope, element){
	    var w = angular.element($window),
	        size = element[0].clientHeight,
	        top = 0;

	    function toggleStickyNav(){
		  //console.log('top = ' + top + ' size = ' + size + ' Y = ' + $window.pageYOffset);	    	
	      if(!element.hasClass('controls-fixed') && $window.pageYOffset > top + size){
	        element.addClass('controls-fixed');
	      } else if(element.hasClass('controls-fixed') && $window.pageYOffset <= top + size){
	        element.removeClass('controls-fixed');
	      }
	    }

	    scope.$watch(function(){
	      return element[0].getBoundingClientRect().top + $window.pageYOffset;
	    }, function(newValue, oldValue){
	      if(newValue !== oldValue && !element.hasClass('controls-fixed')){
	        top = newValue;
	      }
	    });

	    w.bind('resize', function stickyNavResize(){
	      element.removeClass('controls-fixed');
	      //top = element[0].getBoundingClientRect().top + $window.pageYOffset;      
	      top = $window.pageYOffset;
	      toggleStickyNav();
	    });
	    w.bind('scroll', toggleStickyNav);
	  }

	  return {
	    scope: {},
	    restrict: 'A',
	    link: stickyNavLink
	  };
	})

  .controller('MainCtrl', function ($scope, $http, $sce, $localStorage, Reddit, commentsTab) {
	
	loadReddits();

  	$scope.reddit = new Reddit();  	

	$scope.definitions = {};
	$scope.posts = [];
	$scope.subreddit = '';
	$scope.nextPage = '';
	$scope.newSubreddit = '';
	$scope.showMeta = false;	

	function isUndefinedOrNull(val) {
	    return angular.isUndefined(val) || val === null 
	}	

	function loadReddits() {
		if ( isUndefinedOrNull($localStorage.reddits) ) {
			$localStorage.reddits = [
				{label: "awww"},
				{label: "funny"},
				{label: "pics"},
				{label: "Creatures_of_earth"},
				{label: "GrilledCheese"},
				{label: "nonononoYES"},
				{label: "UNBGBBIIVCHIDCTIICBG"},
				{label: "wtf"}
			];
		} 

		$scope.reddits = $localStorage.reddits;
	};

	$scope.clearComments = function () {
		$scope.checked2 = false;
	}

	$scope.closeComments = function () {
		$scope.checked2 = commentsTab.toggle();
		console.log('checked = ' + $scope.checked2);
	};

	$scope.addSubreddit = function (newSubreddit) {
		$scope.reddits.push( {label: newSubreddit} );
		$scope.newSubreddit = '';
		$localStorage.reddits = $scope.reddits;
	};

	$scope.removeSubreddit = function ($index) {
  		$scope.reddits.splice($index,1); 
  		$localStorage.reddits = $scope.reddits;
	}

	$scope.renderHTML = function(html_code)
	{
	    var decoded = angular.element('<textarea />').html(html_code).text();
	    return $sce.trustAsHtml(decoded);
	};	

	// get the reddit posts for the subreddit selected
	$scope.getNextPage = function (subreddit) {
		$scope.toggle();
		$scope.reddit = new Reddit();
		$scope.reddit.nextPage(subreddit);		
	}	

	// get subreddit selected from slider menu
	$scope.setSelected = function (reddit) {
		$scope.subreddit = reddit;
		$scope.checked = !$scope.checked
	}

	// toggle for subreddit list slider
    $scope.checked = false; // This will be binded using the ps-open attribute
    $scope.toggle = function(){
        $scope.checked = !$scope.checked
    }	

    // toggle for comments slider
    $scope.checked2 = false; // This will be binded using the ps-open attribute
    $scope.toggle2 = function(postId){
        $scope.checked2 = !$scope.checked2
        if ($scope.checked2) {
        	$scope.reddit.getComments($scope.subreddit, postId); 
        }
    }   
	$scope.getComments2 = function(id) {
	   $http.get("https://www.reddit.com/r/" + $scope.subreddit + "/comments/" + id + ".json").then(function (response) {
	   	console.log('response data = ' + response.data[1].data.children);
		    if (response.data[1].data.children.length === 0) {
		    	$scope.error = true;
		    	$scope.message = 'No comments';	
		    	console.log('error');
		    	$scope.treeData = [];
		    	$scope.checked2 = !$scope.checked2;
		    } else {	  
		    	 $scope.error = false; 	
		         $scope.treeData = response.data;
		         $scope.checked2 = !$scope.checked2;
		    }
		    
		    commentsTab.toggle();
	    }); 
	}	     

  })

.factory('commentsTab', function() {

    var commentControl = {};

    this.on = false;

    commentControl.toggle = function () {
    	this.on = !this.on;
    	console.log('this = ' + this.on);
    	return this.on;
    }

    return commentControl;

})

// Reddit constructor function to encapsulate HTTP and pagination logic
.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';

    this.treedata = [];
    this.commentsBusy = false;        
  };

  Reddit.prototype.nextPage = function(subreddit) {
  	if (subreddit.length < 2) return;
    if (this.busy) return;
    this.busy = true;

    var url = "https://api.reddit.com/r/" + subreddit + "?after=" + this.after + "&jsonp=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {

	    if (data.length === 0) {
	    	$scope.error = true;
	    	$scope.message = 'No results found for subreddit ' + subreddit;	
	    	console.log('error');
	    } else {

	      var items = data.data.children;
	      for (var i = 0; i < items.length; i++) {

	        if(!items[i].data.is_self)
	        {

	          var imgurPattern = /imgur\.com/;

	          if (imgurPattern.test(items[i].data.url)) {
	            var gifvPattern = /.gifv$/;
	            
	            if(!gifvPattern.test(items[i].data.url))
	            {
	                items[i].data.url = items[i].data.url+'.png';


	                var thumb = '';
	                if (items[i].data.media != null) {
	                	thumb = items[i].data.media.oembed.thumbnail_url;
	                } else {
	                	thumb = items[i].data.url;
	                }

	                var newItem = {
	            	  id: items[i].data.id,
	                  url: items[i].data.url,
	                  title: items[i].data.title,
	                  permalink: 'http://reddit.com'+items[i].data.permalink,
	                  subreddit: items[i].data.subreddit,
	                  ups: items[i].data.ups,
	                  author: items[i].data.author,
	                  domain: items[i].data.domain,
	                  thumbnail: thumb,
	                  commentCount: items[i].data.num_comments
	                }

	                 this.items.push(newItem);

	            }
	          }

	        }

	      }
	  	}
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  Reddit.prototype.getComments = function(subreddit, postId) {
    if (this.commentsBusy) return;
    this.commentsBusy = true;

    $http.get("https://www.reddit.com/r/" + subreddit + "/comments/" + postId + ".json").then(function (response) {	

	    if (response.data[1].data.children.length === 0) {
	    	$scope.error = true;
	    	$scope.message = 'No comments found';	
	    	console.log('error');
	    } else {

		  this.treeData = response.data;

		}
      this.commentsBusy = false;
    }.bind(this));
  };

  return Reddit;
});