angular.module('logCtrl', ['logService'])

    .controller('logController', function (Log) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        //grab all the drill logs at page load
        Log.all()
            .success(function (data){

                //when all drill logs come back, remove the processing variable
                vm.processing = false;

                //bind the drill logs that come back to vm.logs
                vm.logs = data;
            });

        //function to delete a log
        vm.deleteLog = function (id){
            vm.processing = true;

            Log.delete(id)
                .success(function (data) {

                    // get all logs to update the table
                    // you can also set up your api
                    // to return the list of logs with the delete call
                    Log.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.logs = data;
                        });
                });
        };
    })

    // controller applied to log creation page
    .controller('logCreateController', function (Log) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a log
        vm.saveLog = function () {
            vm.processing = true;
            vm.message = '';

            // use the create function in the logService
            Log.create(vm.logData)
                .success(function (data) {
                    vm.processing = false;
                    vm.logData = {};
                    vm.message = data.message;
                });
        };
    })

    // controller applied to log edit page
    .controller('logEditController', function ($routeParams, Log) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the log data for the log you want to edit
        // $routeParams is the way we grab data from the URL
        Log.get($routeParams.log_id)
            .success(function (data) {
                vm.logData = data;
            });

        // function to save the log
        vm.saveLog = function () {
            vm.processing = true;
            vm.message = '';

            // call the logService function to update
            Log.update($routeParams.log_id, vm.logData)
                .success(function (data) {
                    vm.processing = false;

                    // clear the form
                    vm.logData = {};

                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };
    });
