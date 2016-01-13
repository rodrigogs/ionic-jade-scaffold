angular.module('starter.services')
.factory('AppSrv', function () {
  return {
    exampleFnc: function () {
      return 'example';
    },

    exampleFnc2: function () {
      return 'example2';
    }
  };
});