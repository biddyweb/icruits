(function () {
    "use strict";

    angular.module('app').controller('BluprintDetailsCtrl', BluprintDetailsCtrl);

    BluprintDetailsCtrl.$inject = ['$scope', '$rootScope', '$cookies', '$state', '$window', 'JobFeed', 'UserInfoRes', 
    'SalaryInfo', 'JobType', 'VisaStatusInfo', 'JobFeedsRes', 'QueueRes', 'QueueInfo', 'UserInfo', 'QueueStackInfo', 
    'AppliedBlueprintsInfo', 'AppliedBlueprintsRes', 'QueueStackRes', 'ReviewResultsRes', 'PrehiredEmpRes',
    'PrehiredEmpInfo', 'HiredEmpRes', 'IndustryInfoRes', 'CompanyTypeInfo', 'ExperienceLevelInfo', 'LocationInfoRes',
    'WaitIntervalInfo', 'OnJobSuccessInfo', 'JobDurationInfo'];

    function BluprintDetailsCtrl ($scope, $rootScope, $cookies, $state, $window, JobFeed, UserInfoRes, 
        SalaryInfo, JobType, VisaStatusInfo, JobFeedsRes, QueueRes, QueueInfo, UserInfo, QueueStackInfo,
        AppliedBlueprintsInfo, AppliedBlueprintsRes, QueueStackRes, ReviewResultsRes, PrehiredEmpRes,
        PrehiredEmpInfo, HiredEmpRes, IndustryInfoRes, CompanyTypeInfo, ExperienceLevelInfo, LocationInfoRes,
        WaitIntervalInfo, OnJobSuccessInfo, JobDurationInfo) {

        $scope.queue_resource = QueueInfo;

        $scope.prehired_employee_info = PrehiredEmpInfo;

        $scope.queue_stack_resource = QueueStackInfo;

        $scope.applied_blueprints_resource = AppliedBlueprintsInfo;

        $scope.user = UserInfo;

        $scope.blueprint = JobFeed;

        $scope.salary = SalaryInfo;

        $scope.type = JobType;

        $scope.industy = IndustryInfoRes;

        $scope.visa_status = VisaStatusInfo;

        $scope.companyType = CompanyTypeInfo;

        $scope.experienceLevel = ExperienceLevelInfo;

        $scope.locationInfo = LocationInfoRes;

        $scope.waitInterval = WaitIntervalInfo;

        $scope.onJobSuccess = OnJobSuccessInfo;

        $scope.JobDuration = JobDurationInfo;

        $scope.sent_mail = false;

        $scope.has_applied = false;

        $scope.is_icruited = false;

        $scope.has_accepted = false;

        $scope.has_interview = false;

        $scope.is_hired = false;

        $scope.sent_apply_mail = false;

        $scope.blueprint_in_queue = false;

        $scope.reached_max_queue = false;

        $scope.show_unapply_canvas = false;

        $scope.published = $scope.blueprint.is_published;

        if($scope.published){
            $scope.editable = false;
        }
        if(!$scope.published){
            $scope.editable = true;            
        }
        //      querying data from DB for related fields     //
        angular.forEach($scope.type, function (value, key) {
            // body...
            if(value.id === $scope.blueprint.related_job_type){
                $scope.job_type = value;
            }
        });

        angular.forEach($scope.salary, function(value, key){
            if(value.id === $scope.blueprint.related_salary){
                $scope.job_salary = value;
                // body...
            }
        });

        angular.forEach($scope.visa_status, function (value, key) {
            // body...
            if(value.id === $scope.blueprint.related_visa_status){
                $scope.visa_status_info = value;
            }
        });
        //////////////////////////////////////////////////////////
        $scope.blueprint_queue = [];

        angular.forEach($scope.queue_resource, function (value, que_key) {
            // body...
            $scope.queue_resource[que_key].stacks = [];
            angular.forEach(value.stack, function (current_que_stack_value, current_que_stack_key) {
                // body...
                angular.forEach($scope.queue_stack_resource, function (que_stack_value, que_stack_key) {
                    // body...
                    if(current_que_stack_value === que_stack_value.id){
                        $scope.queue_resource[que_key].stacks.push(que_stack_value);
                    }
                });
                if(!$scope.user.profile_type){
                    $scope.current_queue = $scope.queue_resource[que_key].stacks[$scope.queue_resource[que_key].stacks.length - 1 ].candidate_position;
                }
            });
            if(value.blueprint === $scope.blueprint.id){
                $scope.blueprint_queue.push(value);
                $scope.blueprint_in_queue = true;
            }
        });

        /*
        if ($cookies.get('token')) {
            var user_logged;
        } else {
            setTimeout(function() {
                $state.go('root.home', { reload: true });
            }, 100);
        }
        */

        /* Employer BLUEPRINT DETAIL PAGE LOGIC */
        if(!$scope.user.profile_type) {
            var check_for_queue = angular.isUndefined($scope.blueprint_queue[0]);

            if(!check_for_queue) {
                var check_person_in_queue = angular.isUndefined($scope.blueprint_queue[0].stacks[1]);

                if (!check_person_in_queue) {
                    var first_candidate = $scope.blueprint_queue[0].stacks[1];
                    $scope.has_interview = first_candidate.has_interview;
                    $scope.is_icruited = first_candidate.has_icruited;
                    $scope.has_accepted = first_candidate.has_accepted;
                    $scope.has_applied = first_candidate.has_applied;
                    $scope.current_queue_id = first_candidate.id;
                    $scope.current_candidate = first_candidate.candidate;
                }
            }
        }
        $scope.SendMail = function (event) {
            // body...
            //$scope.sent_mail = true;

            var check_person_in_queue = angular.isUndefined($scope.blueprint_queue[0].stacks[1]);

            if(!check_person_in_queue){
                var first_candidate = $scope.blueprint_queue[0].stacks[1].candidate,
                    stack_id = $scope.blueprint_queue[0].stacks[1].id,
                    elementAccept = angular.element($('#accept-interview-btn')),
                    elementReject = angular.element($('#reject-interview-btn')),
                    elementiCruit = angular.element(event.target),
                    send_mail_context = {
                        blueprint: $scope.blueprint.id,
                        user: first_candidate,
                        stack: stack_id
                    },
                    elementImg = angular.element($('#detail-img')),
                    elementResults = angular.element($('#simulator-results'));
                elementiCruit.css({
                    display: 'none'
                });
                elementAccept.css({
                    display: 'block'
                });
                elementReject.css({
                   display: 'block'
                });
                elementImg.css({
                    display: 'none'
                });
                elementResults.css({
                    display: 'block'
                });
                angular.forEach($scope.applied_blueprints_resource, function (value, key) {
                    if(value.blueprint === $scope.blueprint.id && value.candidate === first_candidate){
                        console.log(value.simulator_results);
                        console.log('reviewing results');
                    }
                });
                ReviewResultsRes.save(send_mail_context, function (response) {
                    $scope.data = response.data;
                }, function (response) {
                    $scope.errors = response.data;
                });
            } else {
                console.log('no persons in que');
            }
        };

        $scope.inviteToInterview = function () {
            var check_person_in_queue = angular.isUndefined($scope.blueprint_queue[0].stacks[1]);

            if(!check_person_in_queue) {
                var que_stack = $scope.blueprint_queue[0].stacks[1].id,
                    blueprint_id = $scope.blueprint.id,
                    user_id = $scope.user.id,
                    request = {
                        que_stack: que_stack,
                        blueprint_id: blueprint_id,
                        user_id: user_id
                    };
                PrehiredEmpRes.save(request, function (response) {
                    $scope.data = response.data;
                    setTimeout(function () {
                        $window.location.reload();
                    }, 500);
                }, function (response) {
                    $scope.errors = response.data;
                });
            } else {
                console.log('no persons in que');
            }
        };

        $scope.deleteBlueprint = function () {
            JobFeedsRes.delete({ name_slug: $scope.blueprint.name_slug }, function (response) {
                $scope.data = response.data;
                setTimeout(function () {
                    $state.go('root.dashboard', { reload: true });
                }, 500);
            }, function (response) {
                $scope.errors = response.data;
            });
        };

        $scope.updateBlueprint = function () {
            // body...
            JobFeedsRes.update({ name_slug: $scope.blueprint.name_slug }, $scope.blueprint, function (response) {
                // body...
                $scope.data = response.data;
                setTimeout(function () {
                    $state.go('root.dashboard', { reload: true });
                    $window.location.reload();
                }, 500);
            }, function (response) {
                // body...
                $scope.errors = response.data;
            });
        };
        $scope.publishBlueprint = function () {
            // body...
            $scope.blueprint.is_published = true;
            JobFeedsRes.update({ name_slug: $scope.blueprint.name_slug }, $scope.blueprint, function (response) {
                // body...
                $scope.data = response.data;
                setTimeout(function () {
                    $state.go('root.dashboard', { reload: true });
                    $window.location.reload();
                }, 500);
            }, function (response) {
                // body...
                $scope.errors = response.data;
                setTimeout(function () {
                    $state.go('root.dashboard', { reload: true });
                    $window.location.reload();
                }, 500);
            });

            var queue_data = {blueprint: $scope.blueprint.id};
            QueueRes.save(queue_data, function (response) {
                // body...
                $scope.queue_response = response.data;
            }, function (response) {
                // body...
                $scope.errors = response.data;
            });
            setTimeout(function() {
                $state.go('root.dashboard', { reload: true });
                $window.location.reload();
            }, 500);
        };

        $scope.previewBlueprint = function () {
            // body...
            $scope.published = true;
        };
        $scope.editBlueprint = function () {
            // body...
            $scope.published = false;
        };

        $scope.hireEmployee = function () {
            HiredEmpRes.save({blueprint: $scope.blueprint.id,
                employee: $scope.current_candidate}, function (response) {
                $scope.data = response.data;
            }, function (response) {
                $scope.errors = response.data;
            });
            QueueStackRes.delete({ id: $scope.current_queue_id }, function (response) {
                $scope.data = response.data;
                $scope.is_icruited = false;
                $scope.has_applied = false;
                $scope.has_interview = false;
                $scope.has_accepted = false;
            }, function (response) {
               $scope.errors = response.data;
            });
        };

        /*
            JobSeeker BLUEPRINT DETAIL LOGIC
        */

        if($scope.user.profile_type) {
            $scope.people_in_queue = $scope.blueprint_queue[0].stacks[$scope.blueprint_queue[0].stacks.length - 1 ].candidate_position;
            $scope.has_applied = false;
            $scope.is_icruited = false;
            $scope.has_accepted = false;
            $scope.has_interview = false;
            $scope.is_hired = false;
            $scope.can_apply = $scope.blueprint.has_simulator;
            $scope.has_applied_in_queue = false;
            angular.forEach($scope.queue_resource, function (qu_value, qu_key) {
                if (qu_value.blueprint === $scope.blueprint.id) {
                    angular.forEach(qu_value.stacks, function (st_value, st_key) {
                        if (st_value.candidate === $scope.user.id) {
                            $scope.current_queue = st_value.candidate_position;
                            $scope.current_queue_id = st_value.id;
                            $scope.has_applied_in_queue = st_value.has_applied;
                            $scope.is_icruited = st_value.has_icruited;
                            $scope.has_accepted = st_value.has_accepted;
                            $scope.has_interview = st_value.has_interview;
                            $scope.is_hired = st_value.is_hired;
                        }
                    });
                }
            });
        }

        angular.forEach($scope.applied_blueprints_resource, function (value, key) {
            // body...
            if(!$scope.has_interview && !$scope.is_icruited && !$scope.has_applied_in_queue && value.blueprint === $scope.blueprint.id && value.candidate === $scope.user.id){
                $scope.has_applied = true;
                $scope.applied_bluprint_name_slug = value.name_slug;
            }
            /*
            if(value.has_completed_simulation && !value.has_failed && value.candidate === $scope.user.id){
                $scope.is_icruited = true;
            }
            */
        });

        $scope.applyForBlueprint = function () {
            // body...
            $scope.apply_for_blueprint_data = {
                related_candidate: $scope.user.id,
                related_blueprint: $scope.blueprint.id
            };
            AppliedBlueprintsRes.save($scope.apply_for_blueprint_data, function (response) {
                // body...
                $scope.sent_apply_mail = true;
            }, function (response) {
                // body...
                $scope.errors = response.data;
                $scope.reached_max_queue_error = $scope.errors.error;
                $scope.reached_max_queue = true;
            });
        };

        $scope.unapplyFromBlueprint = function () {
            // body...
            AppliedBlueprintsRes.delete({ name_slug: $scope.applied_bluprint_name_slug }, function (response) {
                // body...
                $scope.has_applied = false;
                $scope.show_unapply_canvas = true;
            }, function (response) {
                // body...
                $scope.errors = response.data;
            });
        };

        $scope.exitQueue = function () {
            QueueStackRes.delete({ id: $scope.current_queue_id }, function (response) {
                $scope.data = response.data;
                $scope.is_icruited = false;
                $scope.has_applied = false;
                $scope.has_interview = false;
                $scope.has_accepted = false;
                $state.go('root.dashboard', { reload: true });
            }, function (response) {
               $scope.errors = response.data;
            });
        };

        $scope.onInterview = function () {
            $window.open('https://www.google.com', '_blank');
        };

        $scope.$emit('metaTagsChanged', {
            title: $scope.blueprint.name,
            description: $scope.blueprint.description
        });
        $rootScope.image = '';

        $scope.closeErrorCanvasDetails = function () {
            if($scope.reached_max_queue){
                $scope.reached_max_queue = false;
            }
            if($scope.sent_apply_mail){
                $scope.sent_apply_mail = false;
                $window.location.reload();
            }
            if($scope.show_unapply_canvas){
                $scope.show_unapply_canvas = false;
                $window.location.reload();
            }
        };

    }
})();

(function () {
    "use strict";

    angular.module('app').controller('SeoCtrl', SeoCtrl);

    SeoCtrl.$inject = ['$scope', '$rootScope', '$location'];

    function SeoCtrl ($scope, $rootScope, $location) {
        $scope.$on('metaTagsChanged', function (event, metaTags) {
            $rootScope.title = metaTags.title;
            $rootScope.description = metaTags.description;
            $rootScope.location = $location.path();
        });
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('HomeAbstractCtrl', HomeAbstractCtrl);

    HomeAbstractCtrl.$inject = ['$scope', '$location', '$window'];

    function HomeAbstractCtrl ($scope, $location, $window) {
        $scope.home = $location.path() == '/';
        $scope.$on('$stateChangeSuccess', function () {
                $scope.home = $location.path() == '/';
        });
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$rootScope', '$state', '$cookies', '$window', 'metaTags', 'BluePrints', 'UserInfo',
    'IndustryInfo', 'LocationInfo', 'SalaryInfo', 'ExperienceInfo', 'CompanyTypeInfo', 'WaitIntervalInfo', 'OnJobSuccessInfo',
    'JobTypeInfo', 'JobDurationInfo', 'ExperienceLevelInfo', 'BlueprintTasksInfo', 'VisaStatusInfo', 'UserListInfo', 'Upload', 'CreateBlueprintRes',
    'DesiredEmployeeRes', 'DesiredEmployeesInfo', 'BlueprintTasksRes' , 'QueueInfo', 'QueueStackInfo', 'AppliedBlueprintsInfo',
    'HiredEmpInfo', 'UserInfoRes'];

    function DashboardCtrl ($scope, $rootScope, $state, $cookies, $window, metaTags, BluePrints, UserInfo,
    IndustryInfo, LocationInfo, SalaryInfo, ExperienceInfo, CompanyTypeInfo, WaitIntervalInfo, OnJobSuccessInfo,
    JobTypeInfo, JobDurationInfo, ExperienceLevelInfo, BlueprintTasksInfo, VisaStatusInfo, UserListInfo, Upload, CreateBlueprintRes,
    DesiredEmployeeRes, DesiredEmployeesInfo, BlueprintTasksRes, QueueInfo, QueueStackInfo, AppliedBlueprintsInfo,
    HiredEmpInfo, UserInfoRes) {

        $scope.hired_employee_info = HiredEmpInfo;

        $scope.queue_resource = QueueInfo;

        $scope.applied_blueprints_resource = AppliedBlueprintsInfo;

        $scope.queue_stack_resource = QueueStackInfo;

        $scope.make_blueprint = {};

        $scope.user = UserInfo;

        $scope.desired_employees_info = DesiredEmployeesInfo;

        $scope.industry_info = IndustryInfo;

        $scope.location_info = LocationInfo;

        $scope.salary_info = SalaryInfo;

        $scope.experience_info = ExperienceInfo;

        $scope.company_type_info = CompanyTypeInfo;

        $scope.wait_interval_info = WaitIntervalInfo;

        $scope.on_job_success_info = OnJobSuccessInfo;

        $scope.job_type_info = JobTypeInfo;

        $scope.job_duration_info = JobDurationInfo;

        $scope.experience_level_info = ExperienceLevelInfo;

        $scope.blueprint_tasks_info = BlueprintTasksInfo;

        $scope.blueprint_tasks = $scope.blueprint_tasks_info;
        /*$scope.blueprint_tasks = [];

        angular.forEach($scope.blueprint_tasks_info, function (value, key) {
            // body...
            if(value.expert === ""){
                $scope.blueprint_tasks.push(value);
            };
        });*/

        $scope.blueprint_resource = BluePrints;
        $scope.blueprints = [];
        $scope.not_closed_blueprints = [];
        $scope.closed_blueprints = [];
        $scope.preferenced_filters = [];

        $scope.show_closed_jobs = false;
        $scope.show_accepted_jobs = false;
        $scope.show_applied_jobs = false;
        $scope.show_icruited_jobs = false;
        $scope.show_has_interview = false;
        $scope.show_is_hired = false;

        $scope.show_new_jobs = true;
        $scope.show_new_jobs_icruited = true;
        $scope.show_new_jobs_interview = true;
        $scope.show_hired_jobs = true;

        $scope.industryIncludes = [];

        $scope.locationIncludes = [];

        $scope.salaryIncludes = [];

        $scope.experienceIncludes = [];

        // tuple show closed/opened jobs logic
        $scope.tupleJobsState = function () {
            if(!$scope.show_closed_jobs){
                $scope.show_closed_jobs = true;
                $scope.blueprints = $scope.closed_blueprints;
            } else {
                $scope.show_closed_jobs = false;
                $scope.blueprints = $scope.not_closed_blueprints;
            }
        };

        if(!$scope.user.profile_type){
            // employeer blueprints data
            angular.forEach($scope.blueprint_resource, function (value, key) {
                if($scope.user.id === value.related_user && !value.is_closed){
                    $scope.not_closed_blueprints.push(value);
                }
                if($scope.user.id === value.related_user && value.is_closed){
                    $scope.closed_blueprints.push(value);
                }
            });
            angular.forEach($scope.queue_resource, function (value, key) {
                $scope.queue_resource[key].stacks = [];
                angular.forEach(value.stack, function (current_que_stack_value, current_que_stack_key) {
                    // body...
                    angular.forEach($scope.queue_stack_resource, function (que_stack_value, que_stack_key) {
                        // body...
                        if (current_que_stack_value === que_stack_value.id) {
                            $scope.queue_resource[key].stacks.push(que_stack_value);
                        }
                    });
                });
            });
            if($scope.show_closed_jobs){
                angular.forEach($scope.closed_blueprints, function (value, key) {
                    $scope.closed_blueprints[key].queue_pos = {};
                    angular.forEach($scope.queue_resource, function (que_val, que_key) {
                        if(value.is_published && Number(que_val.blueprint) === Number(value.id)){
                            $scope.closed_blueprints[key].queue_pos = que_val.stacks[que_val.stacks.length - 1].candidate_position;
                        }
                    });
                    if(!angular.isNumber($scope.closed_blueprints[key].queue_pos)){
                        $scope.closed_blueprints[key].queue_pos = '-';
                    }
                });
                angular.forEach($scope.closed_blueprints, function (value, key) {
                    angular.forEach($scope.salary_info, function (salary_value, salary_key) {
                        if(value.related_salary === salary_value.id){
                            $scope.closed_blueprints[key].salary_range = salary_value.sal_range;
                        }
                    });
                    angular.forEach($scope.location_info, function (location_value, location_key) {
                        if(value.related_location === location_value.id){
                            $scope.closed_blueprints[key].current_location = location_value.location;
                        }
                    });
                });
                $scope.blueprints = $scope.closed_blueprints;
            } else {
                angular.forEach($scope.not_closed_blueprints, function (value, key) {
                    $scope.not_closed_blueprints[key].queue_pos = {};
                    angular.forEach($scope.queue_resource, function (que_val, que_key) {
                        if(value.is_published && Number(que_val.blueprint) === Number(value.id)) {
                            $scope.not_closed_blueprints[key].queue_pos = que_val.stacks[que_val.stacks.length - 1].candidate_position;
                        }
                    });
                    if(!angular.isNumber($scope.not_closed_blueprints[key].queue_pos)){
                        $scope.not_closed_blueprints[key].queue_pos = '-';
                    }
                });
                angular.forEach($scope.not_closed_blueprints, function (value, key) {
                    angular.forEach($scope.salary_info, function (salary_value, salary_key) {
                        if(value.related_salary === salary_value.id){
                            $scope.not_closed_blueprints[key].salary_range = salary_value.sal_range;
                        }
                    });
                    angular.forEach($scope.location_info, function (location_value, location_key) {
                        if(value.related_location === location_value.id){
                            $scope.not_closed_blueprints[key].current_location = location_value.location;
                        }
                    });
                });
                $scope.blueprints = $scope.not_closed_blueprints;
            }
        } else {
            // jobseeker queue data
            angular.forEach($scope.queue_resource, function (que_value, que_key) {
                // body...
                $scope.queue_resource[que_key].stacks = [];
                $scope.queue_resource[que_key].full_stacks = [];
                $scope.queue_resource[que_key].accepted_stacks = [];
                $scope.queue_resource[que_key].applied_stacks = [];
                $scope.queue_resource[que_key].icruited_stacks = [];
                $scope.queue_resource[que_key].interview_stacks = [];
                $scope.queue_resource[que_key].hired_stacks = [];
                $scope.queue_resource[que_key].new_job_stacks = [];

                angular.forEach($scope.blueprint_resource, function (blueprint_value, blueprint_key) {
                    // body...
                    if(que_value.blueprint === blueprint_value.id){
                        $scope.queue_resource[que_key].blueprints = blueprint_value;
                    }
                });
                angular.forEach($scope.location_info, function (location_value, location_key){
                    if($scope.queue_resource[que_key].blueprints.related_location === location_value.id){
                        $scope.queue_resource[que_key].blueprints.current_location = location_value.location;
                    }
                });
                angular.forEach($scope.salary_info, function (salary_value, salary_key){
                    if($scope.queue_resource[que_key].blueprints.related_salary === salary_value.id){
                        $scope.queue_resource[que_key].blueprints.salary_range = salary_value.sal_range;
                    }
                });
                angular.forEach(que_value.stack, function (current_que_stack_value, current_que_stack_key) {
                    // body...
                    angular.forEach($scope.queue_stack_resource, function (que_stack_value, que_stack_key) {
                        // body...
                        if(current_que_stack_value === que_stack_value.id){
                            $scope.queue_resource[que_key].full_stacks.push(que_stack_value);
                        }
                        if(current_que_stack_value === que_stack_value.id && que_stack_value.has_accepted){
                            $scope.queue_resource[que_key].accepted_stacks.push(que_stack_value);
                        }
                        if(current_que_stack_value === que_stack_value.id && que_stack_value.has_applied){
                            $scope.queue_resource[que_key].applied_stacks.push(que_stack_value);
                        }
                        if(current_que_stack_value === que_stack_value.id && !que_stack_value.has_applied){
                            $scope.queue_resource[que_key].new_job_stacks.push(que_stack_value);
                        }
                        if(current_que_stack_value === que_stack_value.id && que_stack_value.has_icruited){
                            $scope.queue_resource[que_key].icruited_stacks.push(que_stack_value);
                        }
                        if(current_que_stack_value === que_stack_value.id && que_stack_value.has_interview){
                            $scope.queue_resource[que_key].interview_stacks.push(que_stack_value);
                        }
                        if(current_que_stack_value === que_stack_value.id && que_stack_value.is_hired){
                            $scope.queue_resource[que_key].hired_stacks.push(que_stack_value);
                        }
                    });
                });
                $scope.queue_resource[que_key].stacks = $scope.queue_resource[que_key].full_stacks;
            });
            $scope.blueprints = [];
            $scope.hired_blueprints = [];
            $scope.old_res = $scope.queue_resource;
            if(angular.isUndefined($scope.hired_employee_info[0])){
                angular.forEach($scope.queue_resource, function (value, key) {
                     $scope.blueprints.push(value);
                });
            } else {
                angular.forEach($scope.queue_resource, function (value, key) {
                    angular.forEach($scope.hired_employee_info, function (hired_val, hired_key) {
                        if(value.blueprint === hired_val.blueprint && hired_val.employee === $scope.user.id){
                            $scope.hired_blueprints.push(value);
                        } else {
                            $scope.blueprints.push(value);
                        }
                    });
                });
            }
            $scope.queue_resource = $scope.blueprints;
            if(!$scope.user.preference_filter){
                $scope.user.preference_filter = [];
            } else {
                if(angular.isUndefined($scope.user.preference_filter.industryIncludes)) {
                    $scope.user.preference_filter.industryIncludes = [];
                }
                if(angular.isUndefined($scope.user.preference_filter.locationIncludes)) {
                    $scope.user.preference_filter.locationIncludes = [];
                }
                if(angular.isUndefined($scope.user.preference_filter.salaryIncludes)) {
                    $scope.user.preference_filter.salaryIncludes = [];
                }
                if(angular.isUndefined($scope.user.preference_filter.experienceIncludes)) {
                    $scope.user.preference_filter.experienceIncludes = [];
                }
                if($scope.user.preference_filter.industryIncludes){
                    angular.forEach($scope.user.preference_filter.industryIncludes, function (value, key) {
                        $scope.FilterIndustry(value);
                    });
                }
                if($scope.user.preference_filter.locationIncludes){
                    angular.forEach($scope.user.preference_filter.locationIncludes, function (value, key) {
                        $scope.FilterLocation(value);
                    });
                }
                if($scope.user.preference_filter.salaryIncludes){
                    angular.forEach($scope.user.preference_filter.salaryIncludes, function (value, key) {
                        $scope.FilterSalary(value);
                    });
                }
                if($scope.user.preference_filter.experienceIncludes){
                    angular.forEach($scope.user.preference_filter.experienceIncludes, function (value, key) {
                        $scope.FilterExperience(value);
                    });
                }
            }
        }

        $scope.tupleAppliedJobs = function () {
            // body...
            if($scope.show_new_jobs){
                $scope.blueprints = [];
                $scope.make_tmp_blueprints = [];
                angular.forEach($scope.applied_blueprints_resource, function (value, key) {
                    angular.forEach($scope.queue_resource, function (blu_value, blu_key) {
                        if(blu_value.blueprint !== value.blueprint && value.candidate === $scope.user.id){
                            console.log('here');
                            $scope.make_tmp_blueprints[key] = {};
                            $scope.make_tmp_blueprints[key].blueprints = blu_value.blueprints;
                            $scope.make_tmp_blueprints[key].stacks = [];
                            $scope.make_tmp_blueprints[key].stacks = blu_value.stacks;
                        }
                        if(blu_value.blueprint === value.blueprint && value.candidate === $scope.user.id){
                            console.log('found same');
                            return ''
                        }
                    });
                });
                $scope.blueprints = $scope.make_tmp_blueprints;
                /*angular.forEach($scope.queue_resource, function (stack_value, stack_key) {
                    angular.forEach(stack_value.stacks, function (get_val, get_key) {
                        if(get_val.candidate === $scope.user.id && get_val.has_applied){
                            $scope.blueprints.push(stack_value);
                        }
                    });
                });*/
                $scope.show_new_jobs = false;
            } else {
                $scope.blueprints = [];
                angular.forEach($scope.queue_resource, function (value, key) {
                    // body...
                    if(typeof $scope.queue_resource[key].new_job_stacks != 'undefined'){
                        $scope.blueprints.push(value);
                    }
                });
                $scope.show_new_jobs = true;
            }
        };

        $scope.tupleICruitedJobs = function () {
            // body...
            if($scope.show_new_jobs_icruited){
                $scope.blueprints = [];
                    angular.forEach($scope.queue_resource, function (stack_value, stack_key) {
                        // body...
                        angular.forEach(stack_value.stacks, function (get_val, get_key) {
                            if(get_val.candidate === $scope.user.id && get_val.has_icruited){
                                $scope.blueprints.push(stack_value);
                            }
                        });
                    });
                $scope.show_new_jobs_icruited = false;
            } else {
                $scope.blueprints = [];
                angular.forEach($scope.queue_resource, function (value, key) {
                    // body...
                    if(typeof $scope.queue_resource[key].new_job_stacks != 'undefined'){
                        $scope.blueprints.push(value);
                    }
                });
                $scope.show_new_jobs_icruited = true;
            }
        };

        $scope.tupleInterviewJobs = function () {
            // body...
            if($scope.show_new_jobs_interview){
                $scope.blueprints = [];
                angular.forEach($scope.applied_blueprints_resource, function (value, key) {
                    // body...
                    angular.forEach($scope.queue_resource, function (stack_value, stack_key) {
                        // body...
                        if(value.candidate === $scope.user.id && value.blueprint === stack_value.blueprints.id){
                            angular.forEach(stack_value.stacks, function (get_val, get_key) {
                                if(get_val.has_interview){
                                    $scope.blueprints.push(stack_value);
                                }
                            });
                        }
                    });
                });
                $scope.show_new_jobs_interview = false;
            } else {
                $scope.blueprints = [];
                angular.forEach($scope.queue_resource, function (value, key) {
                    // body...
                    if(typeof $scope.queue_resource[key].new_job_stacks != 'undefined'){
                        $scope.blueprints.push(value);
                    }
                });
                $scope.show_new_jobs_interview = true;
            }
        };

        $scope.tupleHiredJobs = function () {
            if($scope.show_hired_jobs){
                $scope.blueprints = $scope.hired_blueprints;
                $scope.show_hired_jobs = false;
            } else {
                $scope.blueprints = [];
                angular.forEach($scope.queue_resource, function (value, key) {
                    // body...
                    if(typeof $scope.queue_resource[key].new_job_stacks != 'undefined'){
                        $scope.blueprints.push(value);
                    }
                });
                $scope.show_hired_jobs = true;
            }
        };

        $scope.visa_status_info = VisaStatusInfo;

        $scope.user_list_info = UserListInfo;

        $scope.make_blueprint_tasks = [];

        $scope.make_blueprint = {related_user: $scope.user.id};

        $scope.user_list = [];

        angular.forEach($scope.user_list_info, function (value, key) {
            // body...
            if(value.profile_type){
                $scope.user_list.push(value);
            }
        });

        /* FILTER PART */

        $scope.FilterIndustry = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.industryIncludes);
            if(i > -1 ){
                $scope.industryIncludes.splice(i, 1);
                $scope.user.preference_filter.industryIncludes.splice(i, 1);
            } else {
                $scope.industryIncludes.push(filter);
                $scope.user.preference_filter.industryIncludes.push(filter);
            }
            UserInfoRes.update($scope.user);
        };

        $scope.industryFilter = function (blueprints) {
            // body...
            if(!$scope.user.profile_type){
                if($scope.industryIncludes.length > 0){
                    if ($.inArray(blueprints.related_industry, $scope.industryIncludes) < 0)
                        return;
                }
                return blueprints;
            } else {
                if($scope.industryIncludes.length > 0){
                    if ($.inArray(blueprints.blueprints.related_industry, $scope.industryIncludes) < 0)
                        return;
                }
                return blueprints;                
            }
        };

        $scope.FilterLocation = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.locationIncludes);
            if(i > -1 ){
                $scope.locationIncludes.splice(i, 1);
            } else {
                $scope.locationIncludes.push(filter);
            }
        };

        $scope.locationFilter = function (blueprints) {
            // body...
            if(!$scope.user.profile_type){
                if($scope.locationIncludes.length > 0){
                    if ($.inArray(blueprints.related_location, $scope.locationIncludes) < 0)
                        return;
                }
                return blueprints;                
            } else {
                if($scope.locationIncludes.length > 0){
                    if ($.inArray(blueprints.blueprints.related_location, $scope.locationIncludes) < 0)
                        return;
                }
                return blueprints;                
            }
        };

        $scope.FilterSalary = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.salaryIncludes);
            if(i > -1 ){
                $scope.salaryIncludes.splice(i, 1);
            } else {
                $scope.salaryIncludes.push(filter);
            }
        };

        $scope.salaryFilter = function (blueprints) {
            // body...
            if(!$scope.user.profile_type){
                if($scope.salaryIncludes.length > 0){
                    if ($.inArray(blueprints.related_salary, $scope.salaryIncludes) < 0)
                        return;
                }
                return blueprints;                
            } else {
                if($scope.salaryIncludes.length > 0){
                    if ($.inArray(blueprints.blueprints.related_salary, $scope.salaryIncludes) < 0)
                        return;
                }
                return blueprints;                
            }
        };

        $scope.FilterExperience = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.experienceIncludes);
            if(i > -1 ){
                $scope.experienceIncludes.splice(i, 1);
            } else {
                $scope.experienceIncludes.push(filter);
            }
        };

        $scope.experienceFilter = function (blueprints) {
            // body...
            if(!$scope.user.profile_type){
                if($scope.experienceIncludes.length > 0){
                    if ($.inArray(blueprints.related_experience, $scope.experienceIncludes) < 0)
                        return;
                }
                return blueprints;                
            } else {
                if($scope.experienceIncludes.length > 0){
                    if ($.inArray(blueprints.blueprints.related_experience, $scope.experienceIncludes) < 0)
                        return;
                }
                return blueprints;                
            }
        };

        /* END OF FILTER PART */

        if (!$cookies.get('token')) {
            console.log('not found');
            setTimeout(function() {
                $state.go('root.home', { reload: true });
            }, 600);
        }

        $scope.$emit('metaTagsChanged', metaTags);

        $rootScope.image = '';

        /* WORK ENVIORMENT UPLOAD PHOTO */

        $scope.work_env1 = true;
        $scope.work_env2 = false;

        $scope.upload = function (file) {
            // body...
            if(!file){
                return;
            }
            Upload.upload({
                url: '/api/work-enviorment/',
                file: file
            }).success(function (data, status, headers, config) {
                // body...
                $scope.make_blueprint.work_enviorment = data.image;
                $scope.preview = data.image;
                $scope.errors = null;
                $scope.work_env1 = false;
                $scope.work_env2 = true;
            }).errors(function (data, status, headers, config) {
                // body...
                $scope.errors = data;
            });
        };

        $scope.upload2 = function (file) {
            // body...
            if(!file){
                return;
            }
            Upload.upload({
                url: '/api/work-enviorment2/',
                file: file
            }).success(function (data, status, headers, config) {
                // body...
                $scope.make_blueprint.work_enviorment2 = data.image;
                $scope.preview = data.image;
                $scope.errors = null;
            }).errors(function (data, status, headers, config) {
                // body...
                $scope.errors = data;
            });
        };

        /* END OF WORK ENVIRONMENT PHOTO UPLOAD */

        $scope.temp_tasks = [];
        $scope.enable_assign = true;
        $scope.enable_add = false;

        /* ADDING BLUEPRINT TASK */
        $scope.list_blueprint_tasks = [];
        $scope.addTask = function (task) {
            // body...
            $scope.no_employee_task_errors = false;
            if(angular.isUndefined($scope.new_employee[0])){
                $scope.no_employee_task_errors = true;
                $scope.no_employee_task_error = 'Please select employees for task first.'
            } else {
                $scope.temp_tasks.push(task);
                $scope.temp_tasks.push($scope.new_employee);
                $scope.list_blueprint_tasks.push($scope.temp_tasks);
                $scope.new_employee = [];
                $scope.temp_tasks = [];
                $scope.enable_add = true;
            }
        };

        /* REMOVING BLUEPRINT TASK */
        $scope.removeTask = function (task) {
            // body...
            angular.forEach($scope.list_blueprint_tasks, function (object, index) {
                // body...
                if(object.name === task) {
                    $scope.list_blueprint_tasks.splice(index, 1);
                }
            });
        };

        if($cookies.get('blueprint')){
            var cookie_blueprint_data = $cookies.get('blueprint');
            $scope.make_blueprint = angular.fromJson(cookie_blueprint_data);
            $cookies.remove('blueprint');
        }

        $scope.new_employee = [];

        /* CREATING BLUEPRINT */
        $scope.createBlueprint = function () {
            // body...
            $scope.no_task_errors = false;
            $scope.no_employee_errors = false;
            if(angular.isUndefined($scope.list_blueprint_tasks[0])){
                $scope.no_task_errors = true;
                $scope.no_task_error = 'Please select task for this blueprint.'
            } else {
                angular.forEach($scope.list_blueprint_tasks, function (value, key) {
                    if(angular.isUndefined(value[1][0])){
                        $scope.no_employee_errors = true;
                        $scope.no_employee_error = 'Please select employee for task first.'
                    }
                });
                if(!$scope.no_task_errors && !$scope.no_employee_errors){
                    if(angular.isUndefined($scope.make_blueprint.work_enviorment)){
                        $scope.no_work_env_errors = true;
                        $scope.no_work_env_error = 'Please add work environment picture.'
                    } else {
                        if(angular.isUndefined($scope.make_blueprint.work_enviorment2)) {
                            $scope.no_work_env_errors = true;
                            $scope.no_work_env_error = 'Please add another work environment picture.'
                        } else {
                            $scope.send_blueprint = [];
                            $scope.send_blueprint.push($scope.make_blueprint);
                            $scope.send_blueprint.push({tasks: $scope.list_blueprint_tasks});
                            CreateBlueprintRes.save($scope.send_blueprint, function (response) {
                                // body...
                                setTimeout(function () {
                                    $window.location.reload();
                                }, 500);
                            }, function (response) {
                                // body...
                                $scope.field_errors = true;
                                $scope.field_error = 'Please fill all blueprint fields.'
                            });
                        }
                    }
                }
            }
        };

        $scope.closeErrorCanvas = function () {
            if($scope.no_employee_task_errors){
                $scope.no_employee_task_errors = false;
            }
            if($scope.no_task_errors){
                $scope.no_task_errors = false;
            }
            if($scope.no_employee_errors){
                $scope.no_employee_errors = false;
            }
            if($scope.no_work_env_errors){
                $scope.no_work_env_errors = false;
            }
            if($scope.field_errors){
                $scope.field_errors = false;
            }
        };

        $scope.desiredEmployee = {};

        /* CREATING DESIRED EMPLOYEE */
        $scope.createDesiredEmployee = function () {
            // body...
            var expireTime = new Date(),
                blueprint_data = angular.toJson($scope.make_blueprint);
            expireTime.setDate(expireTime.getTime() + 1);
            $cookies.put('blueprint', blueprint_data, {'expires': expireTime});
            DesiredEmployeeRes.save($scope.desiredEmployee, function (response) {
                // body...
                $scope.data = response.data;
                setTimeout(function() {
                    $window.location.reload();
                }, 500);
            }, function (response) {
                // body...
                $scope.errors = response.data;
            });
        };

        $scope.addEmployeeId = function (id) {
            // body...
            var i = $.inArray(id, $scope.new_employee);
            if(i > -1 ){
                $scope.new_employee.splice(i, 1);
            } else {
                $scope.new_employee.push(id);
            }            
        };

        $scope.newBlueprintTask = {};

        /* CREATING BLUEPRINT TASK */
        $scope.createBlueprintTask = function () {
            // body...
            var expireTime = new Date(),
                blueprint_data = angular.toJson($scope.make_blueprint);
            expireTime.setDate(expireTime.getTime() + 1);
            $cookies.put('blueprint', blueprint_data, {'expires': expireTime});
            BlueprintTasksRes.save($scope.newBlueprintTask, function (response) {
                // body...
                setTimeout(function() {
                    $window.location.reload();
                }, 500);
            }, function (response) {
                // body...
                $scope.errors = response.data;
            });
        };

    }
})();

(function () {
    "use strict";

    angular.module('app').controller('HelpCtrl', HelpCtrl);

    HelpCtrl.$inject = ['$scope', '$rootScope', 'Help', 'metaTags'];

    function HelpCtrl($scope, $rootScope, Help, metaTags) {

        $scope.activatedTab = 1;
        $scope.setActivatedTab = function (setTab) {
            $scope.activatedTab = setTab;
        };

        $scope.help = Help;

        $scope.$emit('metaTagsChanged', metaTags);
        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$rootScope', 'metaTags'];

    function HomeCtrl($scope, $rootScope, metaTags) {

        $scope.$emit('metaTagsChanged', metaTags);
        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$scope', '$rootScope', '$state', 'AuthRes', 'metaTags', 'Pilots',
        'CheckUserRes', 'CheckUserNameRes'];

    function RegisterCtrl($scope, $rootScope, $state, AuthRes, metaTags, Pilots, CheckUserRes,
    CheckUserNameRes) {

        $scope.$emit('metaTagsChanged', metaTags);

        $scope.test_pilots = Pilots;

        $scope.reg = {};

        $scope.complete = false;

        $scope.page_1 = true;
        $scope.page_2 = false;
        $scope.page_3 = false;
        $scope.page_4 = false;
        $scope.page_5 = false;
        $scope.page_6 = false;

        $scope.total_pages = '6';

        if($scope.page_1){
            $scope.current_page = '1';
        }

        $scope.profile_types = [{profile_type: true, label: 'JobSeeker'}, {profile_type: false, label: 'Employer'}];

        $scope.prevPage = function () {
            if($scope.page_2){
                $scope.page_2 = false;
                $scope.page_1 = true;
                $scope.current_page = '1';
            }
            if($scope.page_3){
                $scope.page_3 = false;
                $scope.page_2 = true;
                $scope.current_page = '2';
            }
            if($scope.page_4){
                $scope.page_4 = false;
                $scope.page_3 = true;
                $scope.current_page = '3';
            }
            if($scope.page_5){
                $scope.page_5 = false;
                $scope.page_4 = true;
                $scope.current_page = '4';
            }
            if($scope.page_6){
                $scope.page_6 = false;
                $scope.page_5 = true;
                $scope.current_page = '5';
            }
        };

        $scope.checkUsername = function () {
            if(!$scope.reg.username){
                $scope.errors = true;
                $scope.error = "Please fill username";
            } else {
                CheckUserNameRes.save($scope.reg, function (response) {
                    $scope.errors = true;
                    $scope.error = "User with this username already exists."
                }, function (response) {
                    $scope.errors = false;
                    $scope.page_1 = false;
                    $scope.page_2 = true;
                    $scope.current_page = '2';
                });
            }
        };

        $scope.checkEmail = function () {
            // body...
            if(!$scope.reg.email){
                $scope.error = "Please fill email address";
                $scope.errors = true;
            } else {
                $scope.log = {};
                $scope.log.username = $scope.reg.email;
                CheckUserRes.save($scope.log, function (response) {
                    // body...
                    $scope.errors = true;
                    $scope.error = "User with this email address already exists.";
                }, function (response) {
                    // body...
                    $scope.errors = false;
                    $scope.page_2 = false;
                    $scope.page_3 = true;
                    $scope.current_page = '3';
                });
            }
        };

        $scope.checkProfileType = function () {
            if(!angular.isDefined($scope.reg.profile_type)){
                $scope.errors = true;
                $scope.error = "Please select profile type.";
            } else {
                $scope.errors = false;
                $scope.page_3 = false;
                $scope.page_4 = true;
                $scope.current_page = '4';
            }
        };

        $scope.checkPassword = function () {
            if(!$scope.reg.password){
                $scope.errors = true;
                $scope.error = "Please input password."
            } else {
                $scope.errors = false;
                $scope.page_5 = false;
                $scope.page_6 = true;
                $scope.current_page = '6';
            }
        };

        $scope.checkMobile = function () {
            if(!$scope.reg.mobile_number){
                $scope.errors = true;
                $scope.error = "Please input valid mobile number.";
            } else {
                $scope.errors = false;
                $scope.page_4 = false;
                $scope.page_5 = true;
                $scope.current_page = '5';
            }
        };

        $scope.registration = function () {
            if(!$scope.reg.confirm_password){
                $scope.errors = true;
                $scope.error = "Please confirm password."
            } else {
                $scope.errors = false;
                $scope.is_pilot = false;
                angular.forEach($scope.test_pilots, function (pilot) {
                    if(pilot.email === $scope.reg.email){
                        $scope.is_pilot = true;
                    }
                });
                if($scope.is_pilot){
                    AuthRes.save($scope.reg, function (response) {
                        $scope.complete = true;
                        $scope.data = response;
                    }, function (response) {
                        $scope.errors = response.data;
                    });
                } else {
                    $state.go('root.non_pilot', { reload: true });
                }
            }
        };

        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$rootScope', '$state', 'LoginRes', 'JWTTokenRes', 'CheckUserRes'];

    function LoginCtrl($scope, $rootScope, $state, LoginRes, JWTTokenRes, CheckUserRes) {

        var progBar = angular.element($('#progressBar'));

        $scope.page_1 = true;
        $scope.page_2 = false;

        if($scope.page_1){
            $scope.current_page = '1';
        }
        if($scope.page_2){
            $scope.current_page = '2';
        }
        $scope.total_pages = '2';

        $scope.log = {};

        $scope.errors = false;

        $scope.prevPage = function () {
            $scope.page_1 = true;
            $scope.page_2 = false;
            $scope.current_page = '1';
            if($scope.errors){
                $scope.errors = false;
            }
            progBar.css({
                width: 0 + '%'
            });
        };

        $scope.checkuser = function () {
            // body...
            if(!$scope.log.username){
                $scope.error = "Please fill email address";
                $scope.errors = true;
            } else {
                progBar.css({
                    width: 50 + '%'
                });
                CheckUserRes.save($scope.log, function (response) {
                    // body...
                    $scope.page_1 = false;
                    $scope.page_2 = true;
                    $scope.current_page = '2';
                    if($scope.errors){
                        $scope.errors = false;
                    }
                }, function (response) {
                    // body...
                    if (response.status === 400) {
                        setTimeout(function () {
                            $state.go('root.register', {reload: true});
                        }, 600);
                    } else {
                        setTimeout(function () {
                            // body...
                            $state.go('root.dashboard', {reload: true});
                        }, 600)
                    }
                });
            }
        };

        $scope.login = function() {
            LoginRes.login($scope.log.username, $scope.log.password).then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(response) {
                // body...
                if (response.status === 400) {
                    $scope.errors = true;
                    $scope.error = "Wrong password";
                } else {
                    JWTTokenRes.jwt($scope.log.username, $scope.log.password);
                    setTimeout(function () {
                        $state.go('root.dashboard', {reload: true});
                    }, 500);
                    progBar.css({
                        width: 100 + '%'
                    });
                }
            }
            function loginErrorFn(response) {
                // body...
                $scope.errors = response.data;
                $scope.logged_in = false;
           }
        };


        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('LogoutCtrl', LogoutCtrl);

    LogoutCtrl.$inject = ['$scope', '$state', '$window', 'LogoutRes', 'UserInfoRes'];

    function LogoutCtrl($scope, $state, $window, LogoutRes, UserInfoRes) {
        $scope.user = UserInfoRes.query();

        $scope.user.user_company = false;

        if($scope.user.is_superuser){
            $scope.user.user_company = true;
        }

        $scope.logoutNow = function () {
            // body...
            LogoutRes.logout().then(logoutSuccess, logoutFail);

            function logoutSuccess(response) {
                $state.go('root.home');
                setTimeout(function() {
                    $window.location.reload();
                }, 600);
            }

            function logoutFail(response) {
                return response
            }
        }
    }
})();

(function () {
    // body...
    "use strict";

    angular.module('app').controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['$rootScope', '$scope', '$state', 'metaTags', 'UserInfo', 'UserInfoRes'];

    function ProfileCtrl($rootScope, $scope, $state, metaTags, UserInfo, UserInfoRes) {
        // body...

        $scope.$emit('metaTagsChanged', metaTags);

        $scope.user_info = UserInfo;

        $scope.updateProfile = function () {
            // body...
            UserInfoRes.update($scope.user_info, function (response) {
                // body...
                $scope.data = response;
                $state.go('root.dashboard', { reload: true });
            }, function (response) {
                // body...
                $scope.errors = response.data;
            });
        };

        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('ActivationCtrl', ActivationCtrl);

    ActivationCtrl.$inject = ['$scope', '$rootScope', '$window', '$state', 'metaTags', 'params', 'ActivationRes'];

    function ActivationCtrl($scope, $rootScope, $window, $state, metaTags, params, ActivationRes) {
        $scope.$emit('metaTagsChanged', metaTags);

        var uid = params.split("?")[0],
            token = params.split("?")[1],
            activation_done = false;

        ActivationRes.activate(uid, token).then(ActivateSuccess, ActivateFail);

        function ActivateSuccess(response) {
            activation_done = true;
            $scope.activation_done = activation_done;
            $state.go('root.home', { 'reload': true });
            setTimeout(function () {
                $window.location.reload();
            }, 700);
            $scope.data = response.data;
        }

        function ActivateFail(response) {
            activation_done = false;
            $scope.activation_done = activation_done;
            $scope.errors = response.data;
        }

        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('NonPilotCtrl', NonPilotCtrl);

    NonPilotCtrl.$inject = ['$scope', '$rootScope', '$state', '$window', 'metaTags'];

    function NonPilotCtrl($scope, $rootScope, $state, $window, metaTags) {
        $scope.$emit('metaTagsChanged', metaTags);

        $scope.backToHome = function () {
            $state.go('root.home', { reload: true });
            setTimeout(function () {
                $window.location.reload();
            }, 700);
        };

        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('IntroCtrl', IntroCtrl);

    IntroCtrl.$inject = ['$scope', '$rootScope', 'JobFeed'];

    function IntroCtrl($scope, $rootScope, JobFeed) {
        $scope.$emit('metaTagsChanged', {
            title: JobFeed.name,
            description: 'Preview employer video intro'
        });
        $scope.blueprint = JobFeed;

        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('SimulatorUpdateCtrl', SimulatorUpdateCtrl);

    SimulatorUpdateCtrl.$inject = ['$scope', '$rootScope', '$state', 'UpdateSim', 'AppliedBlueprintsRes'];

    function SimulatorUpdateCtrl($scope, $rootScope, $state, UpdateSim, AppliedBlueprintsRes) {
        $scope.$emit('metaTagsChanged', {
            title: 'Simulator Updater',
            description: 'Manual updating simulator performances, reviews.'
        });
        $scope.simulator_update = UpdateSim;
        $scope.updated = false;

        $scope.completed_simulation = [{value: true, label: 'Has Completed'}, {value: false, label: 'Has Not Completed'}];
        $scope.failed_simulation = [{value: true, label: 'Has Failed'}, {value: false, label: 'Has Not Failed'}];

        $scope.Update = function () {
            AppliedBlueprintsRes.update({ name_slug: $scope.simulator_update.name_slug },
                $scope.simulator_update, function (response) {
                    $scope.data = response;
                    $scope.updated = true;
                    $state.go('root.dashboard', { reload: true });
                }, function (response) {
                    $scope.errors = response.data;
                });
        };

        $rootScope.image = '';
    }
})();
