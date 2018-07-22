(function () {
	'use strict';

	var app = angular.module('Youtube.Services');
	app.service('YoutubeService', YoutubeService);

	YoutubeService.$inject = ['$http'];

	function YoutubeService($http) {
		// API config
		var API = {
			url: 'https://www.googleapis.com/youtube/v3',
			params: {
				key: 'AIzaSyBc50oq-F7_OKjkX002-itENPKY2RwNH4w',
				maxResults: 20,
				part: 'snippet',
				type: 'video'
			}
		};

		return {
			search: function (query) {
				var url = API.url + '/search/?q=' + query;
				url += parseParams(API.params);

				return $http.get(url);
			}
		};
	}

	function parseParams(obj) {
		var params = '';
		for (var p in obj) {
			if ((obj.hasOwnProperty(p)) && (obj[p] !== '')) {
				params += '&' + p + '=' + obj[p];
			}
		}
		return params;
	}
}());