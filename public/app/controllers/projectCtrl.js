angular.module('projectCtrl', ['projectService'])

    .controller('projectController', function (Project) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        //grab all the projects at page load
        Project.closed()
            .success(function (data) {
                //when all projects come back, remove the processing variable
                vm.processing = false;

                //bind the projects that come back
                vm.closedProjects = data;
            });

        //Grab all the active projects
        Project.active()
            .success(function (data) {
                //when all projects come back, remove the processing variable
                vm.processing = false;

                //bind the projects that come back
                vm.activeProjects = data;
            });

        //Grab all the deleted projects
        Project.deleted()
            .success(function (data) {
                //when all projects come back, remove the processing variable
                vm.processing = false;

                //bind the projects that come back
                vm.deletedProjects = data;
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

        //function to unDelete a project
        vm.unDeleteProject = function (id) {
            vm.processing = true;

            Project.unDelete(id)
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
                })
                .error(function (data) {
                    vm.processing = false;
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
                    var totals = calculateHoleTotals(data);
                    vm.numberOfHoles = totals.holeCount;
                    vm.totalDepth = totals.totalDepth;
                    vm.averageDepth = totals.totalDepth / totals.holeCount;
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

            //Calculate Number of holes, total depth, and average depth
            // vm.numberOfHoles = totalHoles()
            // var totals = calculateHoleTotals()
            // vm.totalDepth = '100,000';
            //     vm.averageDepth = '432,234';


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

            //function to unDelete a project
            vm.unDeleteProject = function (id) {
                vm.processing = true;

                Project.unDelete(id, vm.projectData)
                    .success(function (data) {

                        // get all projects to update the table
                        // you can also set up your api
                        // to return the list of projects with the delete call
                        Project.all()
                            .success(function (data) {
                                // vm.processing = false;
                                // vm.projects = data;
                                $location.path("/project");
                            });
                    });
            };

            //function to unDelete a project
            vm.closeProject = function (id) {
                vm.processing = true;

                Project.closeProject(id, vm.projectData)
                    .success(function (data) {

                        // get all projects to update the table
                        // you can also set up your api
                        // to return the list of projects with the delete call
                        Project.all()
                            .success(function (data) {
                                // vm.processing = false;
                                // vm.projects = data;
                                $location.path("/project");
                            });
                    });
            };

            //function to unDelete a project
            vm.reOpenProject = function (id) {
                vm.processing = true;

                Project.reOpenProject(id, vm.projectData)
                    .success(function (data) {

                        // get all projects to update the table
                        // you can also set up your api
                        // to return the list of projects with the delete call
                        Project.all()
                            .success(function (data) {
                                // vm.processing = false;
                                // vm.projects = data;
                                $location.path("/project");
                            });
                    });
            };


            function calculateHoleTotals(project) {
                console.log(project.drillLogs);
                var holeCount = 0;
                var totalDepth = 0;


                for (var i = 0; i < project.drillLogs.length; i++) {
                    for (h = 0; h < project.drillLogs[i].holes.length; h++) {
                        holeCount = holeCount + 1;
                        totalDepth = totalDepth + project.drillLogs[i].holes[h].z;
                        console.log('holeCount: ' + holeCount);
                        console.log('totalDepth: ' + totalDepth);

                    }

                    return {holeCount: holeCount, totalDepth: totalDepth};
                    // return '1,000,000'
                }
            }


            //Assigns all holes and no-holes.
            function assignHoles() {
                //Set the displayed grid size.
                var gridSizeX = '50', //horizontal rows
                    gridSizeY = '26'; //vertical columns

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
        }
    );