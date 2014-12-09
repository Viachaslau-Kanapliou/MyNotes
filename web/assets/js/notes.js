var NotesApp = angular.module('notesModule', [
    'toastModule'
]);
/*
* No specific validation logic, just common cases, e.g. we don't validate title.isEmpty() on isDone action
* */
NotesApp.controller('NotesCtrl', ['$scope', '$http','toastService', function ($scope, $http, toastService) {
    //public
    $scope.notes = null;

    $scope.editedElement = null; //backup of edited note

    $scope.getNotes    = getNotes;
    $scope.setDone     = setDone;
    $scope.setTitle    = setTitle;
    $scope.updateNote  = updateNote;
    $scope.setColor    = setColor;
    $scope.deleteNote  = deleteNote;
    $scope.addNote     = addNote;
    $scope.setEditedNote  = setEditedNote;

    //init
    $scope.notes = getNotes();

    //private
    function getNotes() {
        getData('/note/get', null, function(data){
            $scope.notes = data;
            toastService.showWarning('notes loaded');
        });
    }
    function setDone(note){
        postData('/note/'+note.id+'/updateItemIsDone','isDone='+note.isDone, function(data){
            toastService.showWarning("updated "+data.label);
        });
    }

    function setTitle(title){
        postData('/note/updateTitle','value='+title, function(){
            toastService.showWarning("updated title");
        })
    }
    function updateNote(note){
        if ($scope.editedElement.label != note.label) {
            postData('/note/' + note.id + '/updateItem', 'value=' + note.label, function () {
                toastService.showWarning("updated note title");
            });
        }
        $scope.editedElement = null;
    }

    function setColor(color){
        if ($scope.notes.color != color) {
            postData('/note/updateColor', 'color=' + color, function () {
                $scope.notes.color = color;
                toastService.showWarning("updated color");
            })
        }
        $scope.editedElement = null;
    }

    function deleteNote(note){
        postData('/note/'+note.id+'/delete', null, function(){
            _.remove($scope.notes.items,function(n){
                 return n.id == note.id;
            });
            toastService.showWarning("note deleted");
        })
    }

    function addNote(){
        getData('/note/newItem', null, function(data){
            $scope.notes.items.push(getNewNote(data.id))
            toastService.showWarning("note added");
        });
    }
    function setEditedNote(note){
        $scope.editedElement = {
            id: note.id,
            isDone: note.isDone,
            label: note.label
        };
    }

    // util
    function getNewNote(id){
        return {
            id:id,
            isDone: false,
            label: null}
    }
    function getData(url, data,callback,errorCallback){
        if (!errorCallback){
            errorCallback = function(data){
                toastService.showError(data);
            }
        }
        var getSettings = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: false
        };
        $http.get(url, data, getSettings).success(callback).error(errorCallback);
    }
    function postData(url, data,callback,errorCallback){
        if (!errorCallback){
            errorCallback = function(data){
                toastService.showError(data);
            }
        }
        var postSettings = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'},
            cache: false
        };
        $http.post(url, data,postSettings).success(callback).error(errorCallback);
    }

}]);
