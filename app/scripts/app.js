'use strict';

/**
 * @ngdoc overview
 * @name hotMessApp
 * @description
 * # hotMessApp
 *
 * Main module of the application.
 */
angular.module('hotMessApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.Auth',
    'ngMaterial'
  ])
  .directive('menuClose', function() {
    return {
      restrict: 'AC',
      link: function($scope, $element) {
        $element.bind('click', function() {
          var drawer = angular.element(document.querySelector('.mdl-layout__drawer'));
          var obfuscator = angular.element(document.querySelector('.mdl-layout__obfuscator'));
          if(drawer) {
            drawer.toggleClass('is-visible');
            obfuscator.toggleClass('is-visible');
          }
        });
      }
    };
  })


  .run(['$rootScope', '$location', 'auth', function ($rootScope, $location, auth) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (auth.$getAuth() === null) {
        if (next.loadedTemplateURL !== "views/login.html") {
          $location.path("/login");
        }
      }
    })
  }]);

// Helper functions
function objectToList(object) {
  if (!object) {
    return;
  }

  return Object.keys(object).map((key) => {
    let obj = object[key];
    obj._key = key;
    return obj;
  });
}

function moveRecord(oldRef, newRef) {
  oldRef.once('value', function(snap)  {
    newRef.set( snap.val(), function(error) {
      if( !error ) {  oldRef.remove(); }
      else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
    });
  });
}
