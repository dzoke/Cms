angular.module('OpiferContent', ['angular-inview', 'ui.tree', 'ngCookies'])

    .factory('ContentService', ['$resource', '$routeParams', function ($resource, $routeParams) {
        return $resource(Routing.generate('opifer_content_api_content') + '/:id', {}, {
            index: {method: 'GET', params: {}, cache: false},
            delete: {method: 'DELETE', params: {id: $routeParams.id}},
            duplicate: {method: 'PUT', params: {id: $routeParams.id}, url: Routing.generate('opifer_content_api_content') + '/duplicate'}
        });
    }])

    .controller('ContentPickerController', ['$scope', '$http', '$rootScope', '$cookies', function ($scope, $http, $rootScope, $cookies) {
        $scope.content = {};
        $scope.selecteditems = [];
        $scope.formname = '';
        $scope.multiple = false;
        $scope.isPickerOpen = false;

        /**
         * Set content
         *
         * @param  {array} content
         * @param  {string} formname
         * @param {bool} multiple
         */
        $scope.init = function (content, formname, multiple) {
            $scope.formname = formname;

            if (angular.isDefined(multiple) && multiple) {
                $scope.multiple = multiple;
            }

            if ($scope.multiple) {
                // When items have been passed to the init function, retrieve the related data.
                if (angular.isDefined(content) && content != '') {
                    content = JSON.parse(content);
                    if (content.length && typeof content[0] === 'object') {
                        angular.forEach(content, function (c, index) {
                            $scope.selecteditems.push(content[index]);
                        });
                    } else if (content.length) {
                        content = content.toString();

                        $http.get(Routing.generate('opifer_content_api_content_ids', {'ids': content}))
                            .success(function (data) {
                                var results = data.results;
                                for (var i = 0; i < results.length; i++) {
                                    results[i].__children = [];

                                    $scope.selecteditems.push(results[i]);
                                }
                            })
                        ;
                    }
                }
            } else {
                $scope.content = JSON.parse(content);
            }
        };

        $scope.hasContent = function(content) {
            for (var i = 0; i < $scope.selecteditems.length; i++) {
                if (content.id == $scope.selecteditems[i].id) {
                    return true;
                }
            }

            return false;
        };

        // Select a content item
        $scope.pickContent = function(content) {
            $rootScope.$emit('contentPicker.pickContent', content);

            if ($scope.multiple) {
                content.__children = [];
                $scope.selecteditems.push(content);
            } else {
                $scope.content = content;
                $scope.isPickerOpen = false;
            }
        };

        // Select a content item
        $scope.unpickContent = function(content) {
            for (var i = 0; i < $scope.selecteditems.length; i++) {
                if (content.id == $scope.selecteditems[i].id) {
                    $scope.selecteditems.splice(i, 1);
                }
            }
        };

        // Remove a content item
        $scope.removeContent = function (idx) {
            $scope.selecteditems.splice(idx, 1);
        };
    }])

    /**
     * Content browser directive
     */
    .directive('contentBrowser', function () {

        return {
            restrict: 'E',
            scope: {
                name: '@',
                value: '@',
                formid: '@',
                provider: '@',
                context: '@',
                siteId: '@',
                active: '=',
                //locale: '@',
                mode: '@',
                receiver: '@'
            },
            templateUrl: '/bundles/opifercontent/app/content/content.html',
            controller: function ($scope, ContentService, $attrs, $cookies) {
                $scope.navto = false;
                $scope.maxPerPage = 1000;
                $scope.currentPage = 1;
                $scope.numberOfResults = 0;
                $scope.remainingResults = 0;
                $scope.lastBrowsedResults = [];
                $scope.contents = [];
                $scope.lblPaginate = "Meer resultaten";
                $scope.query = null;
                $scope.inSearch = false;
                $scope.busyLoading = false;
                $scope.expandMap = $cookies.getObject('contentExpandMap');
                if (!Array.isArray($scope.expandMap)) {
                    $scope.expandMap = new Array;
                }
                $scope.confirmation = {
                    shown: false,
                    name: '',
                    action: ''
                };

                if (typeof $scope.history === "undefined") {
                    $scope.history = [];
                    $scope.histPointer = 0;
                    $scope.history.push(0);
                }

                $scope.fetchContents = function () {
                    if ($scope.active == false) {
                        return;
                    }

                    ContentService.index({
                            site_id: $scope.siteId,
                            //locale: $scope.locale,
                            q: $scope.query,
                            p: $scope.currentPage,
                            limit: $scope.maxPerPage
                        },
                        function (response, headers) {
                            for (var key in response.results) {
                                $scope.contents.push(response.results[key]);
                            }
                            $scope.numberOfResults = response.total_results;
                            $scope.remainingResults = $scope.numberOfResults - ($scope.currentPage * $scope.maxPerPage);
                            $scope.lblPaginate = "Meer content (" + $scope.remainingResults + ")";
                            $scope.busyLoading = false;
                        });
                };

                $scope.searchContents = function () {
                    ContentService.index({
                            q: $scope.query
                        },
                        function (response, headers) {
                            $scope.contents = [];
                            for (var key in response.results) {
                                $scope.contents.push(response.results[key]);
                            }
                            $scope.numberOfResults = response.total_results;
                            $scope.btnPaginate.button('reset');
                            $scope.lblPaginate = "Meer content (" + ($scope.numberOfResults - ($scope.currentPage * $scope.maxPerPage)) + ")";
                        });
                };

                $scope.$watchCollection('[query]', _.debounce(function () {
                    if ($scope.query) {
                        $scope.currentPage = 1;
                        $scope.inSearch = true;
                        $scope.searchContents();
                    } else if ($scope.inSearch) {
                        $scope.clearSearch();
                    }
                }, 300));

                // Only fetch the content once while opening the browser
                $scope.$watch('active', function() {
                    if ($scope.active == true && $scope.contents.length == 0) {
                        $scope.fetchContents();
                    }
                });

                $scope.expand = function (content) {
                    var idx = $scope.expandMap.indexOf(content.id);

                    if (idx >= 0) {
                        $scope.expandMap.splice(idx, 1);
                    } else {
                        $scope.expandMap.push(content.id);
                    }

                    $cookies.putObject('contentExpandMap', $scope.expandMap);
                };

                $scope.isExpanded = function (content) {
                    return $scope.expandMap.indexOf(content.id) >= 0;
                };

                $scope.reloadContents = function () {
                    $scope.contents = [];
                    $scope.currentPage = 1;
                    $scope.fetchContents({cache: false});
                };

                $scope.clearSearch = function () {
                    $scope.query = null;
                    $scope.inSearch = false;
                    $scope.currentPage = 1;
                    $scope.contents = [];
                    $scope.fetchContents();
                };

                $scope.deleteContent = function (content) {
                    ContentService.delete({id: content.id}, function () {
                        $scope.contents.splice($scope.contents.indexOf(content), 1);
                    });

                     $scope.confirmation.shown = false;
                };

                $scope.confirmDeleteContent = function (content, $event) {
                    $scope.confirmation.object = content;
                    $scope.confirmation.idx = content.id;
                    $scope.confirmation.name = content.title;
                    $scope.confirmation.dataset = $event.currentTarget.dataset;
                    $scope.confirmation.action = $scope.deleteContent;
                    $scope.confirmation.shown = !$scope.confirmation.shown;
                };

                $scope.editContent = function (id) {
                    window.location = Routing.generate('opifer_content_contenteditor_design', {'type': 'content', 'id': id});
                };

                $scope.editUrl = function (id) {
                    return Routing.generate('opifer_content_content_edit', {'id': id});
                };

                $scope.designUrl = function (id) {
                    return Routing.generate('opifer_content_contenteditor_design', {'type': 'content', 'id': id});
                };

                $scope.copyContent = function (content) {
                    ContentService.duplicate({id: content.id}, function () {
                        $scope.confirmation.shown = false;
                        $scope.reloadContents();
                    });
                };

                $scope.rootNodes = function () {
                    if ($scope.query) return $scope.contents;

                    return this.childNodes(0);
                };

                $scope.childNodes = function (parent_id) {
                    if ($scope.query) return [];

                    var nodes = [];
                    angular.forEach($scope.contents, function (c, index) {
                        if (c.parent_id == parent_id) {
                            this.push(c);
                        }
                    }, nodes);

                    return nodes;
                };

                $scope.confirmCopyContent = function (selected, $event) {

                    $scope.confirmation.object = selected;
                    $scope.confirmation.idx = selected.id;
                    $scope.confirmation.name = selected.title;
                    $scope.confirmation.dataset = $event.currentTarget.dataset;
                    $scope.confirmation.action = $scope.copyContent;
                    $scope.confirmation.shown = !$scope.confirmation.shown;
                };

                $scope.loadMore = function (e) {
                    if (!$scope.active || $scope.busyLoading || $scope.remainingResults <= 0) return;
                    $scope.currentPage++;
                    $scope.busyLoading = true;
                    $scope.fetchContents();
                };

                $scope.pickObject = function (contentId) {
                    $scope.$parent.pickObject(contentId);
                };

                $scope.unpickObject = function (contentId) {
                    $scope.$parent.unpickObject(contentId);
                };

                $scope.pickContent = function (content) {
                    $scope.$parent.pickContent(content);
                };

                $scope.unpickContent = function (content) {
                    $scope.$parent.unpickContent(content);
                };

                $scope.hasContent = function (content) {
                    return $scope.$parent.hasContent(content);
                };

                $scope.$on('ngModal.close', function() {
                    $scope.active = false;
                });
            },
            compile: function (element, attrs) {
                if (!attrs.mode) {
                    attrs.mode = 'ADMIN';
                }
            }
        };
    })
;