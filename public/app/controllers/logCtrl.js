angular.module('logCtrl', [])

    .controller('logController', function ($http) {

        var vm = this;
        vm.message = 'controller is working';

        $http.get('/api/v1/drillLog/')
            .then(function (data) {
                vm.all = data.data;
            });

        vm.doCreate = function () {
            console.log('contractor is: ' + vm.contractorsName);
            $http.post('/api/v1/drillLog', {
                    contractorsName: vm.contractorsName,
                    jobName: vm.jobName,
                    shotNumber: vm.shotNumber,
                    drillerName: vm.drillerName,
                    customer: vm.customer,
                    threeRiversSupervisor: vm.threeRiversSupervisor,
                    notes: vm.notes,
                    stakeNumbers: vm.stakeNumber,
                    areaNumber: vm.areaNumber,
                    pattern: vm.pattern,
                    stakeNumber: vm.stakeNumber,
                })
                .success(function (data) {
                    console.log('success');
                    vm.message = data.message
                });
        };


    });
