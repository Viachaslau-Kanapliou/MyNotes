var ToastModule = angular.module('toastModule', []);
NotesApp.controller('ToastCtrl', ['$scope', '$timeout',function ($scope,$timeout) {
    $scope.lastMessage  = '';
    $scope.isError      = false;
    $scope.isActive     = true;

    $scope.$on('setMessage',function(event, arg){
        $scope.lastMessage = arg.msg;
        $scope.isError = arg.isError;
        $scope.isActive = true;
        $timeout(function(){
            $scope.isActive = false;
        },2000);

    });
}]);

ToastModule.factory('toastService', function($rootScope){
    //public interface
    var service = {
        showWarning  : showWarning,
        showError    : showError
    };

    //private
    function showWarning(msg){
        setMessage(msg,false);
    }
    function showError(msg){
        setMessage(msg,true);
    }

    //util
    function setMessage(msg,isError){
        $rootScope.$broadcast('setMessage',{
            msg: msg,
            isError: isError
        });
    }
    return service;
});
