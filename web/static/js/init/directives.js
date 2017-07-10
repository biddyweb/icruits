/**
 * Created by einjel on 4/22/17.
 */
(function () {
    "use strict";

    angular.module('app').directive('addDivDirective', function () {
        return {
            restrict: 'A',
            scope: true,
            template: `<a ng-show='enable_add' class='btn add-btn' id='addNewRow' ng-click="clickToClone('hiddenTasks', 'clonedTasks')">
                       <span id='apply-span'>Add Task</span><span id='apply-span-2' class='hover hide-button'>Add Task</span></a>
<a ng-show='!enable_add' class='btn add-btn' id='assignTask' onclick="assignTasks(this.text)" ng-click="switchBtns()"><span id='apply-span'>Assign Task</span><span id='apply-span-2' class='hover hide-button'>Assign Task</span></a>`,
            controller: function ($scope, $element, $compile) {
                $scope.clicked = 0;
                /*$scope.addNewTaskClick = function () {
                        $('#TasksBlueprint').append($compile($('#hiddenTasks:last').clone())($scope));
                        console.log($scope.new_employee);
                        $('#TasksBlueprint:last button:last').css({
                            display: 'inline'
                        }); lastElementChild.childNodes[3].childNodes[3]
                        $('#selectTask:last').find("option").val("");
                        var task = {name: $('#selectTask option:selected').text(), expert: $scope.new_employee, task_status: "Active"};
                        $scope.addTask(task);
                }*/
                $scope.clickToClone = function (sourceId, cloneId) {
                    var sourceHtml = angular.element(document.getElementById(sourceId)).html(),
                        element = angular.element(document.getElementById(cloneId));
                    angular.element(document.getElementById(cloneId)).append(sourceHtml);
                    $('#TasksBlueprint:last button:last').css({
                        display: 'inline'
                    });
                    $scope.enable_add = false;
                    element[0].childNodes[element[0].childNodes.length - 2].childNodes[3].childNodes[3].innerText = 'SELECT';
                };
                $scope.switchBtns = function () {
                    if(!$scope.no_employee_task_errors){
                        $scope.enable_add = true;
                    }
                };
            }
        }
    });
})();

(function () {
    "use strict";

    angular.module('app').directive('addButtonsDirective', function () {
        return {
            restrict: 'A',
            scope: true,
            template: '<a id="blueprint-btn" ng-show="!user.profile_type"' +
                            'ng-click="SendMail()">' +
                            '<span id="advanced-span" class="show-button">' +
                                'iCruit' +
                            '</span>' +
                            '<span id="advanced-span-2" class="hover show-button">' +
                                'iCruit' +
                            '</span>' +
                      '</a>',
            controller: function ($scope, $rootScope, $element, $compile) {
                $scope.SendMail = function () {
                    $rootScope.iCruitsClicked = true;
                };
            }
        }
    });
})();

(function () {
    // body...
    angular.module('app').directive('customValidation', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {

                    var transformedInput = inputValue.toLowerCase().replace(/ /g, '');

                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });
})();
