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

            // set a processing variable to show loading things
            vm.processing = true;

            // variable to hide/show elements of the view
            // differentiates between create or edit pages
            vm.type = 'edit';


            // get the project data for the project you want to edit
            // $routeParams is the way we grab data from the URL
            Project.get($routeParams.project_id)
                .success(function (data) {
                    vm.projectData = data;
                    getTableDimensions();
                    assignHoles();
                    var totals = calculateHoleTotals();
                    vm.numberOfHoles = totals.holeCount;
                    vm.totalDepth = totals.totalDepth;
                    vm.averageDepth = totals.totalDepth / totals.holeCount;
                    vm.holeDepthCount = totals.holeDepthCount;

                    //when the project comes back, remove the processing variable
                    vm.processing = false;
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
            //function to get the day class from a date, this determines the color to use
            vm.getDayClass = function (theDate) {
                if (!theDate) {
                    theDate = new Date();
                }
                return 'day' + new Date(theDate).getDate();
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


            /**
             * Calculate hole totals.
             * @param project
             * @returns {{holeCount: number, totalDepth: number, holeDepthCount: {}}}
             */
            function calculateHoleTotals() {
                var holeCount = 0;
                var totalDepth = 0;
                var holeDepthCount = {};

                for (i = 0; i < vm.projectData.drillLogs.length; i++) {
                    for (row = 0; row < vm.projectData.drillLogs[i].viewData.length; row++) {
                        for (h = 0; h < vm.projectData.drillLogs[i].viewData[row].length; h++) {
                            if (vm.projectData.drillLogs[i].viewData[row][h].hole !== false) {
                                holeCount = holeCount + 1;
                                totalDepth = totalDepth + vm.projectData.drillLogs[i].viewData[row][h].z;

                                //count the number of holes for each depth
                                if (holeDepthCount[vm.projectData.drillLogs[i].viewData[row][h].z]) {
                                    //we have one already, increment the count
                                    holeDepthCount[vm.projectData.drillLogs[i].viewData[row][h].z]
                                        = holeDepthCount[vm.projectData.drillLogs[i].viewData[row][h].z] + 1;
                                }
                                else {
                                    //this is the first one
                                    holeDepthCount[vm.projectData.drillLogs[i].viewData[row][h].z] = 1;
                                }
                            }
                        }
                    }
                }

                return {holeCount: holeCount, totalDepth: totalDepth, holeDepthCount: holeDepthCount};
            }


            //Assigns all holes and no-holes.
            function assignHoles() {

                //for each drillLog, look through the holes data and create a viewHoleData object and add it to the drillLog
                for (dLog = 0; dLog < vm.projectData.drillLogs.length; dLog++) {
                    var holeObject = vm.projectData.drillLogs[dLog];

                    var viewData = [];
                    for (var row = 0; row < vm.projectData.drillLogs[dLog].xMax; row++) {
                        var rowArray = [];
                        for (var col = 0; col < vm.projectData.drillLogs[dLog].yMax; col++) {
                            rowArray.push({hole: false});
                        }
                        viewData.push(rowArray);
                    }

                    for (var i = 0; i < holeObject.holes.length; i++) {
                        var hole = holeObject.holes[i];
                        //color the whole based on the day of the month, by adding the appropriate class day1, daye etc
                        hole.day = '';
                        if (hole.date) {
                            var d = new Date(hole.date);
                            hole.day = 'day' + d.getDate();
                        }

                        //check to see if hole already exists.  If it does, don't add unless timestamp is newer, then replace
                        if (viewData[holeObject.holes[i].x - 1][holeObject.holes[i].y - 1].hole !== false) {
                            var previousDate = viewData[holeObject.holes[i].x - 1][holeObject.holes[i].y - 1].date;
                            var thisDate = hole.date;
                            if (thisDate > previousDate) {
                                console.log(thisDate + ' is newer than ' + previousDate + ' - replacing previous hole');

                                //replace hole with newer timestamped hole
                                viewData[holeObject.holes[i].x - 1][holeObject.holes[i].y - 1] = hole;  //Subtracting 1 to compensate for the 0 based index of the arrays
                            }
                        }
                        else {
                            console.log('hole was false, adding new hole.');
                            viewData[holeObject.holes[i].x - 1][holeObject.holes[i].y - 1] = hole;  //Subtracting 1 to compensate for the 0 based index of the arrays
                        }
                    }
                    vm.projectData.drillLogs[dLog].viewData = viewData;
                }
            }

            /**
             * Gets the max x and y coordinates for each table and assigns it in the table object.
             */
            function getTableDimensions() {
                for (dLog = 0; dLog < vm.projectData.drillLogs.length; dLog++) {
                    var xMax = 8, //start with a minimum value for our x and y table coordinates
                        yMax = 24;
                    var holes = vm.projectData.drillLogs[dLog].holes;
                    holes.forEach(function (hole) {
                        if (hole.x > xMax) xMax = hole.x;
                        if (hole.y > yMax) yMax = hole.y;
                    });
                    vm.projectData.drillLogs[dLog].xMax = xMax + 2;
                    vm.projectData.drillLogs[dLog].yMax = yMax + 2;
                }
            }
        }
    );