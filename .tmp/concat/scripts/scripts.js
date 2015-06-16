angular.module("pageslide-directive", [])

.directive('pageslide', [
    function () {
        var defaults = {};

        /* Return directive definition object */

        return {
            restrict: "EAC",
            transclude: false,
            scope: {
                psOpen: "=?",
                psAutoClose: "=?",
                psSide: "@",
                psSpeed: "@",
                psClass: "@",
                psSize: "@",
                psSqueeze: "@",
                psCloak: "@",
                psPush: "@"
            },
            //template: '<div class="pageslide-content" ng-transclude></div>',
            link: function ($scope, el, attrs) {
                /* Inspect */
                //console.log($scope);
                //console.log(el);
                //console.log(attrs);

                /* Parameters */
                var param = {};

                param.side = $scope.psSide || 'right';
                param.speed = $scope.psSpeed || '0.5';
                param.size = $scope.psSize || '300px';
                param.zindex = 1000; // Override with custom CSS
                param.className = $scope.psClass || 'ng-pageslide';
                param.cloak = $scope.psCloak && $scope.psCloak.toLowerCase() == 'false' ? false : true;
                param.squeeze = Boolean($scope.psSqueeze) || false;
                param.push = Boolean($scope.psPush) || false;
                
                // Apply Class
                el.addClass(param.className);

                /* DOM manipulation */
                var content = null;
                var slider = null;
                var body = document.body;

                slider = el[0];

                // Check for div tag
                if (slider.tagName.toLowerCase() !== 'div' &&
                    slider.tagName.toLowerCase() !== 'pageslide')
                    throw new Error('Pageslide can only be applied to <div> or <pageslide> elements');

                // Check for content
                if (slider.children.length === 0) 
                    throw new Error('You have to content inside the <pageslide>');
                
                content = angular.element(slider.children);

                /* Append */
                body.appendChild(slider);

                /* Style setup */
                slider.style.zIndex = param.zindex;
                slider.style.position = 'fixed'; // this is fixed because has to cover full page
                slider.style.width = 0;
                slider.style.height = 0;
                slider.style.overflow = 'auto';
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                slider.style.transitionProperty = 'width, height';
                if (param.squeeze) {
                    body.style.position = 'absolute';
                    body.style.transitionDuration = param.speed + 's';
                    body.style.webkitTransitionDuration = param.speed + 's';
                    body.style.transitionProperty = 'top, bottom, left, right';
                }

                switch (param.side){
                    case 'right':
                        slider.style.height = attrs.psCustomHeight || '100%'; 
                        slider.style.top = attrs.psCustomTop ||  '0px';
                        slider.style.bottom = attrs.psCustomBottom ||  '0px';
                        slider.style.right = attrs.psCustomRight ||  '0px';
                        break;
                    case 'left':
                        slider.style.height = attrs.psCustomHeight || '100%';   
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        break;
                    case 'top':
                        slider.style.width = attrs.psCustomWidth || '100%';   
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                    case 'bottom':
                        slider.style.width = attrs.psCustomWidth || '100%'; 
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                }


                /* Closed */
                function psClose(slider,param){
                    if (slider && slider.style.width !== 0 && slider.style.width !== 0){
                        if (param.cloak) content.css('display', 'none');
                        switch (param.side){
                            case 'right':
                                slider.style.width = '0px'; 
                                if (param.squeeze) body.style.right = '0px'; 
                                if (param.push) {
                                    body.style.right = '0px'; 
                                    body.style.left = '0px'; 
                                }
                                break;
                            case 'left':
                                slider.style.width = '0px';
                                if (param.squeeze) body.style.left = '0px'; 
                                if (param.push) {
                                    body.style.left = '0px'; 
                                    body.style.right = '0px'; 
                                }
                                break;
                            case 'top':
                                slider.style.height = '0px'; 
                                if (param.squeeze) body.style.top = '0px'; 
                                if (param.push) {
                                    body.style.top = '0px'; 
                                    body.style.bottom = '0px'; 
                                }
                                break;
                            case 'bottom':
                                slider.style.height = '0px'; 
                                if (param.squeeze) body.style.bottom = '0px'; 
                                if (param.push) {
                                    body.style.bottom = '0px'; 
                                    body.style.top = '0px'; 
                                }
                                break;
                        }
                    }
                    $scope.psOpen = false;
                }

                /* Open */
                function psOpen(slider, param){
                    if (slider.style.width !== 0 && slider.style.width !== 0){
                        switch (param.side){
                            case 'right':
                                slider.style.width = param.size; 
                                if (param.squeeze) body.style.right = param.size; 
                                if (param.push) {
                                    body.style.right = param.size; 
                                    body.style.left = "-" + param.size; 
                                }
                                break;
                            case 'left':
                                slider.style.width = param.size; 
                                if (param.squeeze) body.style.left = param.size; 
                                if (param.push) {
                                    body.style.left = param.size; 
                                    body.style.right = "-" + param.size; 
                                }
                                break;
                            case 'top':
                                slider.style.height = param.size; 
                                if (param.squeeze) body.style.top = param.size; 
                                if (param.push) {
                                    body.style.top = param.size; 
                                    body.style.bottom = "-" + param.size; 
                                }
                                break;
                            case 'bottom':
                                slider.style.height = param.size; 
                                if (param.squeeze) body.style.bottom = param.size; 
                                if (param.push) {
                                    body.style.bottom = param.size; 
                                    body.style.top = "-" + param.size; 
                                }
                                break;
                        }
                        setTimeout(function(){
                            if (param.cloak) content.css('display', 'block');
                        },(param.speed * 1000));

                    }
                }

                function isFunction(functionToCheck){
                    var getType = {};
                    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
                }

                /*
                * Watchers
                * */

                $scope.$watch("psOpen", function (value){
                    if (!!value) {
                        // Open
                        psOpen(slider,param);
                    } else {
                        // Close
                        psClose(slider,param);
                    }
                });


                /*
                * Events
                * */

                $scope.$on('$destroy', function() {
                    document.body.removeChild(slider);
                });

                if($scope.psAutoClose){
                    $scope.$on("$locationChangeStart", function(){
                        psClose(slider, param);
                    });
                    $scope.$on("$stateChangeStart", function(){
                        psClose(slider, param);
                    });

                }
            }
        };
    }
]);


// © Copyright 2014 Paul Thomas <paul@stackfull.com>.  All Rights Reserved.

// sf-tree-repeat directive
// ========================
// Like `ng-repeat` but recursive
//
(function(){
  'use strict';
  // (part of the sf.treeRepeat module).
  var mod = angular.module('sf.treeRepeat',[]);

  // Utility to turn the expression supplied to the directive:
  //
  //     a in b of c
  //
  // into `{ value: "a", collection: "b", root: "c" }`
  //
  function parseRepeatExpression(expression){
    var match = expression.match(/^\s*([\$\w]+)\s+in\s+([\S\s]*)\s+of\s+([\S\s]*)$/);
    if (! match) {
      throw new Error("Expected sfTreepeat in form of"+
                      " '_item_ in _collection_ of _root_' but got '" +
                      expression + "'.");
    }
    return {
      value: match[1],
      collection: match[2],
      root: match[3]
    };
  }

  // The `sf-treepeat` directive is the main and outer directive. Use this to
  // define your tree structure in the form `varName in collection of root`
  // where:
  //  - varName is the scope variable used for each node in the tree.
  //  - collection is the collection of children within each node.
  //  - root is the root node.
  //
  mod.directive('sfTreepeat', ['$log', function($log) {
    return {
      restrict: 'A',
      // Use a scope to attach the node model
      scope: true,
      // and a controller to communicate the template params to `sf-treecurse`
      controller: ['$scope', '$attrs',
        function TreepeatController($scope, $attrs){
          var ident = this.ident = parseRepeatExpression($attrs.sfTreepeat);
          $log.info("Parsed '%s' as %s", $attrs.sfTreepeat, JSON.stringify(this.ident));
          // Keep the root node up to date.
          $scope.$watch(this.ident.root, function(v){
            $scope[ident.value] = v;
          });
        }
      ],
      // Get the original element content HTML to use as the recursive template
      compile: function sfTreecurseCompile(element){
        var template = element.html();
        return {
          // set it in the pre-link so we can use it lower down
          pre: function sfTreepeatPreLink(scope, iterStartElement, attrs, controller){
            controller.template = template;
          }
        };
      }
    };
  }]);

  // The `sf-treecurse` directive is a little like `ng-transclude` in that it
  // signals where to insert our recursive template
  mod.directive('sfTreecurse', ['$compile', function($compile){
    return {
      // which must come from a parent `sf-treepeat`.
      require: "^sfTreepeat",
      link: function sfTreecursePostLink(scope, iterStartElement, attrs, controller) {
        // Now we stitch together an element containing a vanila repeater using
        // the values from the controller.
        var build = [
          '<', iterStartElement.context.tagName, ' ng-repeat="',
          controller.ident.value, ' in ',
          controller.ident.value, '.', controller.ident.collection,
          '">',
          controller.template,
          '</', iterStartElement.context.tagName, '>'];
        var el = angular.element(build.join(''));
        // We swap out the element for our new one and tell angular to do its
        // thing with that.
        iterStartElement.replaceWith(el);
        $compile(el)(scope);
      }
    };
  }]);

}());


/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);

'use strict';

/**
 * @ngdoc overview
 * @name redditApp
 * @description
 * # redditApp
 *
 * Main module of the application.
 */
angular
  .module('redditApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pageslide-directive',
    'sf.treeRepeat',
    'infinite-scroll'    
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name redditApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the redditApp
 */
angular.module('redditApp')
  .controller('MainCtrl', ["$scope", "$http", "$sce", "JobManager", "Reddit", function ($scope, $http, $sce, JobManager, Reddit) {

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
     $http.get("http://www.reddit.com/r/" + $scope.subreddit + "/comments/" + id + ".json").then(function (response) {
           $scope.treeData = response.data;
           $scope.toggleComments();
           //$scope.checked2 = !$scope.checked2;
      });    
  }	  


  }])

.service('JobManager', ['$q', '$http', function($q, $http) {
    return {
        getAll: function (subreddit) {
            var deferred = $q.defer();


		    var url = "http://api.reddit.com/r/" + subreddit + "/.json?limit=5&jsonp=JSON_CALLBACK";

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
			var url = "http://api.reddit.com/r/" + subreddit + "/.json?&after=" + next + "&jsonp=JSON_CALLBACK";
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
            var url = "http://api.reddit.com/r/" + subreddit + "/comments/" + postId + ".json?jsonp=JSON_CALLBACK";
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
.factory('Reddit', ["$http", function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function(subreddit) {
  	if (subreddit.length < 2) return;
    if (this.busy) return;
    this.busy = true;

    var url = "http://api.reddit.com/r/" + subreddit + "?after=" + this.after + "&jsonp=JSON_CALLBACK";
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
}]);

'use strict';

/**
 * @ngdoc function
 * @name redditApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the redditApp
 */
angular.module('redditApp')
  .controller('AboutCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
