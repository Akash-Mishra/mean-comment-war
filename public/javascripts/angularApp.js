angular.module('commentWar', ['ui.router'])
// ui-router config
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
		    .state('home', {
		    	url: '/home',
		    	templateUrl: '/home.html',
		    	controller: 'MainCtrl',
		    	resolve: {
		    		postPromise: ['posts', function(posts) {
		    			return posts.getAll();
		    		}]
		    	}
		    })


		    .state('posts', {
		    	url: '/posts/{id}',
		    	templateUrl: '/posts.html',
		    	controller: 'PostsCtrl',
		    	resolve: {
		    		post: ['$stateParams', 'posts', function($stateParams, posts) {
		    			return posts.get($stateParams.id);
		    		}]
		    	}
		    });

		$urlRouterProvider.otherwise('home');
	    }
	])

// Main controller
.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts){

		$scope.posts = posts.posts;

		//
		// $scope.posts = [
		//     {title: 'post 1', upvotes: 5},
		//     {title: 'post 2', upvotes: 2},
		//     {title: 'post 3', upvotes: 15},
		//     {title: 'post 4', upvotes: 9},
		//     {title: 'post 5', upvotes:4}
		// ];

		$scope.addPost = function() {
			if ($scope.title === ''){ return; }
			posts.create({
				title: $scope.title,
				link: $scope.link
			});
			$scope.title = '';
			$scope.link = '';
		};

		$scope.deletePost = function(post){
			posts.delete(post);
		};

		$scope.incrementUpvotes = function(post) {
			posts.upvotes(post);
		};
	}])

// Post controller
.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	function($scope, posts, post) {
		$scope.post = post;
		$scope.addComment = function() {
			if($scope.body === ''){ return; }
			posts.addComment(post.__id, {
				body: $scope.body,
				author: 'user',
			}).success(function(comment) {
				$scope.post.comments.push(comment);
			});
			$scope.body = '';
		};
		$scope.incrementUpvotes = function (comment) {
			comment.upvotes += 1;
			posts.upvoteComment(post, comment);
		};
	}])

// Angular Service
.factory('posts', ['$http', function($http){
	// service body

	var o = {
		posts: []
	};

	// get all posts
	o.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};

	// create new posts
	o.create = function() {
		return $http.post('/posts', post).success(function(data) {
			o.posts.push(data);
		});
	};
}])