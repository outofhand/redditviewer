'use strict';

/**
 * @ngdoc function
 * @name redditApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the redditApp
 */
angular.module('redditApp')
  .controller('MainCtrl', function ($scope, $http, $sce, JobManager, Reddit) {

  	$scope.reddit = new Reddit();  	

	$scope.definitions = {};
	$scope.posts = [];
	$scope.subreddit = 'aww';
	$scope.nextPage = '';

	$scope.renderHTML = function(html_code)
	{
	    var decoded = angular.element('<textarea />').html(html_code).text();
	    return $sce.trustAsHtml(decoded);
	};	

	$scope.getNextPage = function (subreddit) {
		$scope.reddit = new Reddit();
		//$scope.subreddit = subreddit;
		$scope.reddit.nextPage(subreddit);		
	}	

	$scope.reddits = [{label: "aww"},{label: "funny"},{label: "pics"},{label: "Creatures_of_earth"},{label: "GrilledCheese"},{label: "nonononoYES"}];

	$scope.setSelected = function (reddit) {
		$scope.subreddit = reddit;
		$scope.checked = !$scope.checked
	}

    $scope.checked = false; // This will be binded using the ps-open attribute
    $scope.toggle = function(){
        $scope.checked = !$scope.checked
    }	

    $scope.toggleComments = function(){
        $scope.checked2 = !$scope.checked2
    }

    $scope.checked2 = false; // This will be binded using the ps-open attribute
    $scope.toggle2 = function(postId){
        $scope.checked2 = !$scope.checked2
        if ($scope.checked2) {
        	//$scope.getComments(postId);
console.log('postId = ' + postId + ' subreddit = ' + $scope.subreddit);       	
        	//$scope.getComments2($scope.subreddit, postId);
        	$scope.getComments2(postId);        	
        }
    }   

	$scope.getNext = function () {
		$scope.definitions = {};
		$scope.posts = [];
		$scope.spinner = true;
		console.log('next page = ' + $scope.nextPage);
	    JobManager.getNext($scope.subreddit, $scope.nextPage).then(function(data) {
	        $scope.spinner = false;

	        if (data.length === 0) {
	        //if (Object.keys(data.data.children).length === 0) {
	        	//$scope.definitions = {'definitions': [{'text':'No results found', 'attribution': ''}]};
	        	$scope.error = true;
	        	$scope.message = 'No results found for subreddit ' + $scope.subreddit;	
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

	                    $scope.posts.push(newItem);


	                }
	              }

	            }

	            $scope.nextPage = data.data.after;
	          }
          	} 
	    });

	}

	$scope.findWord = function(subreddit) {
		$scope.definitions = {};
		$scope.posts = [];
		$scope.spinner = true;
	    JobManager.getAll(subreddit).then(function(data) {
	        $scope.spinner = false;

	        if (data.length === 0) {
	        //if (Object.keys(data.data.children).length === 0) {
	        	//$scope.definitions = {'definitions': [{'text':'No results found', 'attribution': ''}]};
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

	                    $scope.posts.push(newItem);


	                }
	              }

	            }

	            $scope.nextPage = data.data.after;
	          }
          	} 
	    });
	};

	  $scope.getComments = function (postId) {
	  	$scope.comments = [];
		JobManager.getComments($scope.subreddit, postId).then(function(data) {
			console.log('subreddit = ' + $scope.subreddit + ' postId = ' + postId);
			console.log(data);

	        if (data.length === 0) {
	        	$scope.error = true;
	        	$scope.message = 'No comments found.';	
	        	console.log('error - ' + $scope.message);
	        } else {	
	        console.log(data[1].data.children);	
	          var items = data[1].data.children;
	          console.log('items = ' + items);
	          for (var i = 0; i < items.length; i++) {
			    var comment = items[i].data.body;
			    var author = items[i].data.author;
			    //var postcomment = '<p>[Author]' + author + '<br>' + comment + '</p>';
			    var postcomment = {
			    	author: author,
			    	comment: comment
			    }
			    $scope.comments.push(postcomment);         	
			  }

				/*$.getJSON("http://www.reddit.com/r/" + sub + "/comments/" + id + ".json?", function (data){
				  $.each(data[1].data.children, function (i, item) {
				    var comment = item.data.body
				    var author = item.data.author
				    var postcomment = '<p>[Author]' + author + '<br>' + comment + '</p>'
				    results.append(postcomment)
				  });
				});*/
			}

			console.log('comments = ' + $scope.comments);	
		});

		

	  }

  $scope.getComments2 = function(id) {
     $http.get("https://www.reddit.com/r/" + $scope.subreddit + "/comments/" + id + ".json").then(function (response) {
           $scope.treeData = response.data;
           $scope.toggleComments();
           //$scope.checked2 = !$scope.checked2;
      });    
  }	  


  })

.service('JobManager', ['$q', '$http', function($q, $http) {
    return {
        getAll: function (subreddit) {
            var deferred = $q.defer();


		    var url = "https://api.reddit.com/r/" + subreddit + "/.json?limit=5&jsonp=JSON_CALLBACK";

		    $http.jsonp(url).success(function(data) {

                deferred.resolve(data);

            })
            .error(function(data, status, headers, config) {
		        deferred.resolve('');
		    });

            return deferred.promise;
        },
        getNext: function (subreddit, next) {
            var deferred = $q.defer();
			var url = "https://api.reddit.com/r/" + subreddit + "/.json?&after=" + next + "&jsonp=JSON_CALLBACK";
        	//http://www.reddit.com/r/gaming/top.json?limit=5&after=t3_12vgdt

		    $http.jsonp(url).success(function(data) {

                deferred.resolve(data);

            })
            .error(function(data, status, headers, config) {
		        deferred.resolve('');
		    });

            return deferred.promise;        	

        },
        getComments: function (subreddit, postId) {
            var deferred = $q.defer();
            var url = "https://api.reddit.com/r/" + subreddit + "/comments/" + postId + ".json?jsonp=JSON_CALLBACK";
            //var url = "http://api.reddit.com/r/aww/comments/37ujsr/.json&jsonp=JSON_CALLBACK";
			//var url = "http://api.reddit.com/r/" + subreddit + "/.json?&after=" + next + "&jsonp=JSON_CALLBACK";
        	//var url="http://www.reddit.com/r/gaming/top.json?limit=5";

		    $http.jsonp(url).success(function(data) {
		    	console.log('success');
                deferred.resolve(data);

            })
            .error(function(data, status, headers, config) {
            	console.log('error ' + status);
		        deferred.resolve('');
		    });

            return deferred.promise;             	
        }
    };
}])

// Reddit constructor function to encapsulate HTTP and pagination logic
.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function(subreddit) {
  	if (subreddit.length < 2) return;
    if (this.busy) return;
    this.busy = true;

    var url = "https://api.reddit.com/r/" + subreddit + "?after=" + this.after + "&jsonp=JSON_CALLBACK";
  	//console.log('Reddit = ' + url);
    $http.jsonp(url).success(function(data) {

	    if (data.length === 0) {
	    	$scope.error = true;
	    	$scope.message = 'No results found for subreddit ' + subreddit;	
	    	console.log('error');
	    } else {

	      var items = data.data.children;
	      for (var i = 0; i < items.length; i++) {
	        //this.items.push(items[i].data);

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

  return Reddit;
});
