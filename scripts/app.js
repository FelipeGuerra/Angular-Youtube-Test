angular.module('App', ['App.Youtube']);
angular.module('App.Youtube', ['Youtube.Controllers', 'Youtube.Services']);

angular.module('Youtube.Controllers', []);
angular.module('Youtube.Services', []);

(function () {
    'use strict';

    var app = angular.module('Youtube.Controllers');
    app.controller('YoutubeController', YoutubeController);

    YoutubeController.$inject = ['$scope', '$http', '$sce', 'YoutubeService'];

    function YoutubeController($scope, $http, $sce, YoutubeService) {
        // default query
        $scope.query = '';
        $scope.modal = false;
        $scope.currentVideo = null;

        YoutubeService.search($scope.query)
            .success(function (data) {
                parseData(data.items);
            })
            .error(function (error) {
                console.log('There was an error: ' + error);
            });

        $scope.search = function () {
            YoutubeService.search($scope.query)
                .success(function (data) {
                    parseData(data.items);
                })
                .error(function (error) {
                    console.log('There was an error: ' + error);
                });
        };

        $scope.videoOpen = function (videoj) {
            if (!videoj.id) {
                $scope.modal = false;
                return;
            }
            var videourl = 'https://www.youtube.com/embed/' + videoj.id + '/?autoplay=1';
            $scope.currentVideo = $sce.trustAsResourceUrl(videourl);
            $scope.currentVideoId = videoj.id;
            $scope.currentVideoDesc = videoj.description;
            $scope.currentVideoTitle = videoj.title;
            $scope.currentVideoDate = videoj.published;
            $scope.currentVideoViews = videoj.views;
            $scope.modal = true;
        };

        function parseData(data, Item) {
            // console.info(data)
            if (data.length > 0) {
                $scope.videos = [];

                data.forEach(function (item) {
                    var dateform = item.snippet.publishedAt.replace('T', ' ').replace('.000Z', '');
                    var viewCount = "";

                    var video = {
                        id: item.id.videoId,
                        channelId: item.snippet.channelId,
                        title: item.snippet.title,
                        images: {
                            default: {
                                url: item.snippet.thumbnails.default.url
                            },
                            medium: {
                                url: item.snippet.thumbnails.medium.url
                            },
                            high: {
                                url: item.snippet.thumbnails.high.url
                            }
                        },
                        description: item.snippet.description,
                        published: my_date_format(dateform),
                        views: viewCount
                    };

                    $scope.videos.push(video);
                });
            }

            $scope.datalists = data // json data
            //show more functionality
            var pagesShown = 1;
            var pageSize = 5;
            $scope.paginationLimit = function (data) {
                return pageSize * pagesShown;
            };

            $scope.hasMoreItemsToShow = function () {
                return pagesShown < ($scope.datalists.length / pageSize);
            };

            $scope.showMoreItems = function () {
                pagesShown = pagesShown + 1;
            };
        }


        // Get all url params
        function queryString(url) {
            var parse_url = /^(?:([a-zA-Z]+):)?(\/{0,3})([0-9.\-a-zA-Z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/,
                names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'],
                query_string = {},
                result = parse_url.exec(url);

            var vars = result[6].split('&');

            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                query_string[pair[0]] = pair[1];
            }

            return query_string;
        }

        function getVideoId(url) {
            var query_string = queryString(url);
            return query_string.v;
        }
    }
}());

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
                channelId: 'UCIFPH3lgl7dvSbfMmzQXxIw',
                maxResults: 15,
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

    //VER:
    /*
    $scope.search = function (isNewQuery) {
    	$scope.loading = true;
    	$http.get('https://www.googleapis.com/youtube/v3/search', {
    		params: {
    			key: YOUR_API_KEY_HERE,
    			type: 'video',
    			maxResults: '10',
    			pageToken: isNewQuery ? '' : $scope.nextPageToken,
    			part: 'id,snippet',
    			fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
    			q: this.query
    		}
    	})
    	.success( function (data) {
    		if (data.items.length === 0) {
    			$scope.label = 'No results were found!';
    		}
    		VideosService.listResults(data, $scope.nextPageToken && !isNewQuery);
    		$scope.nextPageToken = data.nextPageToken;
    		$log.info(data);
    	})
    	.error( function () {
    		$log.info('Search error');
    	})
    	.finally( function () {
    		$scope.loadMoreButton.stopSpin();
    		$scope.loadMoreButton.setDisabled(false);
    		$scope.loading = false;
    	});
    };
    */
}());

var my_date_format = function (input) {
    var d = new Date(Date.parse(input.replace(/-/g, "/")));
    var month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    var date = d.getDay() + " de " + month[d.getMonth()] + " de " + d.getFullYear() + ' às';
    var time = d.toLocaleTimeString().toLowerCase().replace(/([\d]+:[\d]+):[\d]+(\s\w+)/g, "$1$2");
    return (date + " " + time);
};