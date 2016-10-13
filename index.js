angular
  .module('partnermarketing.matchHeight', [])
  .directive('matchHeight', ['$rootScope', '$window', function ($rootScope, $window) {

    'use strict';

    function getElementHeight(element) {
      return $window.parseInt($window.getComputedStyle(element, null).getPropertyValue('height'), 10);
    }

    function same(selector, element) {
      // Ensure we aren't calculating based on any previously forced heights.
      removeSame(selector, element);

      var greatestHeight = 0,
        elements = findTargetElements(selector, element);

      for (var i = 0; i < elements.length; i++) {
        var height = getElementHeight(elements[i]);
        if (height > greatestHeight) {
          greatestHeight = height;
        }
      }

      var newHeightCss = String(greatestHeight) + 'px'
      elements.map(function(element) { 
        element.style.height = newHeightCss;
      });

    }

    function removeSame(selector, element) {
      var elements = findTargetElements(selector, element);
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.height = 'auto';
      }
    }

    var trimString = function(string) {
      return string.replace(/^ +/, '').replace(/ +$/, '');
    };

    var findTargetElements = function(selector, element) {
      var elements = Array.prototype.slice.call(element[0].querySelectorAll(selector));
      if(elements) {
        elements.filter(function(el) {
          return !isHidden(el)
        });
      }
      return elements;
    };

    function isHidden(element) {
      // `offsetParent_` is used by unit tests because `offsetParent` is read-only.
      if (element.hasOwnProperty('offsetParent_')) {
        return (element.offsetParent_ === null);
      } else {
        return (element.offsetParent === null);
      }
    }

    return {
      restrict: 'A',
      scope: {
        matchHeight: '@'
      },
      compile: function compile() {
        return {
          post: function postLink(scope, element) {
            if (!angular.isString(scope.matchHeight)) {
              return;
            }
            var targets = scope.matchHeight.split('}');
            if (targets.length < 2) {
              return;
            }

            var mediaQueriesAndTargets = [];
            for (var i = 0; i < targets.length; i++) {
              var mediaQuery = trimString(targets[i].replace(/^(.+)\{.+$/, '$1'));
              var target = trimString(targets[i].replace(/^.+\{(.+)$/, '$1'));

              if (mediaQuery === '' && target === '') {
                continue;
              }

              mediaQueriesAndTargets.push([mediaQuery, target]);
            }

            function checkMediaQuery() {
              for (var i = 0; i < mediaQueriesAndTargets.length; i++) {
                var mediaQuery = mediaQueriesAndTargets[i][0];
                var selector = mediaQueriesAndTargets[i][1];

                if (mediaQuery === '*' ||
                    (typeof $window.matchMedia !== 'undefined' && $window.matchMedia(mediaQuery).matches)) {
                  same(selector, element);
                } else {
                  removeSame(selector, element);
                }
              }
              $rootScope.$broadcast('angularMatchHeight::resized');
            }

            var resizeTimer;

            $window.addEventListener('resize', function() {
              $window.clearTimeout(resizeTimer);
              resizeTimer = $window.setTimeout(checkMediaQuery, 10);
            });
            resizeTimer = $window.setTimeout(checkMediaQuery, 10);

            // Watch for DOM mutation, which could mean elements being inserted or styles
            // changing, and make sure we recalculate the heights after DOM mutation.
            var domMutationEvents = [
              'DOMAttributeNameChanged',
              'DOMCharacterDataModified',
              'DOMElementNameChanged',
              'DOMNodeInserted',
              'DOMNodeInsertedIntoDocument',
              'DOMNodeRemoved',
              'DOMNodeRemovedFromDocument'
            ];
            for (var i = 0; i < domMutationEvents.length; i++) {
              element[0].addEventListener(domMutationEvents[i], checkMediaQuery);
            }
          }
        };
      }
    };
  }]);
