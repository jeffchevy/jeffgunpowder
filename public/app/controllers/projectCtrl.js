angular.module('projectCtrl', ['projectService'])

    .controller('projectController', function (Project) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        //grab all the projects at page load
        Project.all()
            .success(function (data) {

                //when all projects come back, remove the processing variable
                vm.processing = false;

                //bind the projects that come back
                vm.projects = data;
            });

        //function to delete a project
        vm.deleteProject = function (id) {
            vm.processing = true;

            Project.delete(id)
                .success(function (data) {

                    // get all projects to update the table
                    // you can also set up your api
                    // to return the list of projects with the delete call
                    Project.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.projects = data;
                        });
                });
        };


    })

    // controller applied to project creation page
    .controller('projectCreateController', function (Project) {
        var vm = this;
        vm.projectData = {
            dailyLogs: [],
            drillLogs: []
        };

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a project
        vm.saveProject = function () {
            vm.processing = true;
            vm.message = '';

            // use the create function in the ProjectService
            Project.create(vm.projectData)
                .success(function (data) {
                    vm.processing = false;
                    vm.projectData = {};
                    vm.message = data.message;
                });
        };

        //Add a blank daily log to the object.
        vm.addBlankDailyLog = function () {
            vm.projectData.dailyLogs.push({});
        };

        //Remove a daily log from the object
        vm.deleteDailyLog = function (dailyLog) {
            var index = vm.projectData.dailyLogs.indexOf(dailyLog);
            vm.projectData.dailyLogs.splice(index, 1);
        };

        //Add a blank drill log to the object
        vm.addBlankDrillLog = function () {
            vm.projectData.drillLogs.push({});
        };

        //Remove a drill log from the object
        vm.deleteDrillLog = function (drillLog) {
            var index = vm.projectData.drillLogs.indexOf(drillLog);
            vm.projectData.drillLogs.splice(index, 1);
        };
    })

    // controller applied to project edit page
    .controller('projectEditController', function ($routeParams, Project, $location) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';


        // get the project data for the project you want to edit
        // $routeParams is the way we grab data from the URL
        Project.get($routeParams.project_id)
            .success(function (data) {
                vm.projectData = data;
                assignHoles();
            });

        // function to save the project
        vm.saveProject = function () {
            vm.processing = true;
            vm.message = '';

            // call the projectService function to update
            Project.update($routeParams.project_id, vm.projectData)
                .success(function (data) {
                    vm.processing = false;

                    // clear the form
                    vm.projectData = {};

                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };

        //Add a blank daily log to the object.
        vm.addBlankDailyLog = function () {
            vm.projectData.dailyLogs.push({});
        };

        //Remove a daily log from the object
        vm.deleteDailyLog = function (drillLog) {
            var index = vm.projectData.dailyLogs.indexOf(drillLog);
            vm.projectData.dailyLogs.splice(index, 1);
        };

        //Add a blank drill log to the object
        vm.addBlankDrillLog = function () {
            vm.projectData.drillLogs.push({});
        };

        //Remove a drill log from the object
        vm.deleteDrillLog = function (drillLog) {
            var index = vm.projectData.drillLogs.indexOf(drillLog);
            vm.projectData.drillLogs.splice(index, 1);
        };


        //function to delete a project
        vm.deleteProject = function (id) {
            vm.processing = true;

            // TODO add delete confirmation -- archive project instead of delete???
            Project.delete(id)
                .success(function (data) {
                    $location.path("/project");
                });
        };


        //Assigns all holes and no-holes.
        function assignHoles() {
            //Set the displayed grid size.
            var gridSizeX = '50', //horizontal rows
                gridSizeY = '10'; //vertical columns

            //for each drillLog, look through the holes data and create a viewHoleData object and add it to the drillLog
            for (dLog = 0; dLog < vm.projectData.drillLogs.length; dLog++) {
                var holeObject = vm.projectData.drillLogs[dLog];

                var viewData = [];
                for (var row = 0; row < gridSizeY; row++) {
                    var rowArray = [];
                    for (var col = 0; col < gridSizeX; col++) {
                        rowArray.push({hole: false});
                    }
                    viewData.push(rowArray);
                }

                for (var i = 0; i < holeObject.holes.length; i++) {
                    var hole = holeObject.holes[i];
                    hole.hasHole = true;
                    viewData[holeObject.holes[i].y - 1][holeObject.holes[i].x - 1] = hole;  //Subtracting 1 to compensate for the 0 based index of the arrays
                }
                vm.projectData.drillLogs[dLog].viewData = viewData;
            }
        }
    });