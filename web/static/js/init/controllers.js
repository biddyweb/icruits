(function () {
    "use strict";

    angular.module('app').controller('BluprintDetailsCtrl', BluprintDetailsCtrl);

    BluprintDetailsCtrl.$inject = ['$scope', '$rootScope', '$cookies', '$state', '$window', 'JobFeed', 'UserInfoRes', 
    'SalaryInfo', 'JobType', 'VisaStatusInfo', 'JobFeedsRes', 'QueueRes', 'QueueInfo', 'UserInfo', 'QueueStackInfo', 
    'AppliedBlueprintsInfo', 'AppliedBlueprintsRes', 'QueueStackRes', 'ReviewResultsRes', 'PrehiredEmpRes',
    'PrehiredEmpInfo', 'HiredEmpRes'];

    function BluprintDetailsCtrl ($scope, $rootScope, $cookies, $state, $window, JobFeed, UserInfoRes, 
        SalaryInfo, JobType, VisaStatusInfo, JobFeedsRes, QueueRes, QueueInfo, UserInfo, QueueStackInfo,
        AppliedBlueprintsInfo, AppliedBlueprintsRes, QueueStackRes, ReviewResultsRes, PrehiredEmpRes,
        PrehiredEmpInfo, HiredEmpRes) {

        $scope.queue_resource = QueueInfo;

        $scope.prehired_employee_info = PrehiredEmpInfo;

        $scope.queue_stack_resource = QueueStackInfo;

        $scope.applied_blueprints_resource = AppliedBlueprintsInfo;

        $scope.user = UserInfo;

        $scope.blueprint = JobFeed;

        $scope.salary = SalaryInfo;

        $scope.type = JobType;

        $scope.visa_status = VisaStatusInfo;

        $scope.sent_mail = false;

        $scope.has_applied = false;

        $scope.is_icruited = false;

        $scope.has_accepted = false;

        $scope.has_interview = false;

        $scope.is_hired = false;

        $scope.blueprint_in_queue = false;

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
                    $scope.has_icruited = first_candidate.has_icruited;
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
                    elementAccept = angular.element($('#accept-interview-btn')),
                    elementReject = angular.element($('#reject-interview-btn')),
                    elementiCruit = angular.element(event.target),
                    send_mail_context = {
                        blueprint: $scope.blueprint.id,
                        user: first_candidate
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
                }, 500);
            }, function (response) {
                // body...
                $scope.errors = response.data;
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
            angular.forEach($scope.queue_resource, function (qu_value, qu_key) {
                if (qu_value.blueprint === $scope.blueprint.id) {
                    angular.forEach(qu_value.stacks, function (st_value, st_key) {
                        if (st_value.candidate === $scope.user.id) {
                            $scope.current_queue = st_value.candidate_position;
                            $scope.current_queue_id = st_value.id;
                            $scope.has_applied = st_value.has_applied;
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
            if(value.blueprint === $scope.blueprint.id && value.candidate === $scope.user.id){
                $scope.has_applied = true;
                $scope.applied_bluprint_name_slug = value.name_slug;
            }
            if(value.has_completed_simulation && !value.has_failed){
                $scope.is_icruited = true;
            }
        });

        $scope.applyForBlueprint = function () {
            // body...
            $scope.apply_for_blueprint_data = {
                related_candidate: $scope.user.id,
                related_blueprint: $scope.blueprint.id
            };
            AppliedBlueprintsRes.save($scope.apply_for_blueprint_data, function (response) {
                // body...
                $window.location.reload();
                $scope.sent_mail = true;
            }, function (response) {
                // body...
                $scope.errors = response.data;
            });
        };

        $scope.unapplyFromBlueprint = function () {
            // body...
            AppliedBlueprintsRes.delete({ name_slug: $scope.applied_bluprint_name_slug }, function (response) {
                // body...
                $scope.has_applied = false;
                setTimeout(function () {
                    $window.location.reload();
                }, 500);
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
    'HiredEmpInfo'];

    function DashboardCtrl ($scope, $rootScope, $state, $cookies, $window, metaTags, BluePrints, UserInfo,
    IndustryInfo, LocationInfo, SalaryInfo, ExperienceInfo, CompanyTypeInfo, WaitIntervalInfo, OnJobSuccessInfo,
    JobTypeInfo, JobDurationInfo, ExperienceLevelInfo, BlueprintTasksInfo, VisaStatusInfo, UserListInfo, Upload, CreateBlueprintRes,
    DesiredEmployeeRes, DesiredEmployeesInfo, BlueprintTasksRes, QueueInfo, QueueStackInfo, AppliedBlueprintsInfo,
    HiredEmpInfo) {

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
            if($scope.show_closed_jobs){
                $scope.blueprints = $scope.closed_blueprints;
            } else {
                $scope.blueprints = $scope.not_closed_blueprints;
            }
        } else {
            // jobseeker queue data
            angular.forEach($scope.queue_resource, function (que_value, que_key) {
                // body...
                $scope.queue_resource[que_key].blueprints = [];
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
                        $scope.queue_resource[que_key].blueprints.push(blueprint_value);
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
            angular.forEach($scope.queue_resource, function (value, key) {
                angular.forEach($scope.hired_employee_info, function (hired_val, hired_key) {
                    if(value.blueprint !== hired_val.blueprint) {
                        $scope.blueprints.push(value);
                    }
                    if(value.blueprint === hired_val.blueprint && hired_val.employee === $scope.user.id){
                        $scope.hired_blueprints.push(value);
                    }
                });
            });
            $scope.queue_resource = $scope.blueprints;
            if(!$scope.user.preference_filter){
                console.log('no preferences');
            } else {
                console.log('has preference');
            }
        }

        $scope.tupleAppliedJobs = function () {
            // body...
            if($scope.show_new_jobs){
                $scope.blueprints = [];
                $scope.unneeded = [];
                angular.forEach($scope.applied_blueprints_resource, function (value, key) {
                    // body...
                    angular.forEach($scope.queue_resource, function (stack_value, stack_key) {
                        // body...
                        if(value.candidate === $scope.user.id && value.blueprint === stack_value.blueprints[0].id){
                            angular.forEach(stack_value.stacks, function (get_val, get_key) {
                                if(get_val.has_interview || get_val.has_icruited){
                                    $scope.unneeded.push(stack_value);
                                }
                                $scope.blueprints.push(stack_value);
                            });
                            if(value.has_applied){
                                angular.forEach($scope.unneeded, function (rem_value, rem_key) {
                                    $scope.blueprints.splice(rem_value, 1);
                                });
                            }
                        }
                    });
                });
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
                angular.forEach($scope.applied_blueprints_resource, function (value, key) {
                    // body...
                    angular.forEach($scope.queue_resource, function (stack_value, stack_key) {
                        // body...
                        if(value.candidate === $scope.user.id && value.blueprint === stack_value.blueprints[0].id){
                            angular.forEach(stack_value.stacks, function (get_val, get_key) {
                                if(get_val.has_icruited){
                                    $scope.blueprints.push(stack_value);
                                }
                            });
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
                        if(value.candidate === $scope.user.id && value.blueprint === stack_value.blueprints[0].id){
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

        $scope.industryIncludes = [];

        $scope.locationIncludes = [];

        $scope.salaryIncludes = [];

        $scope.experienceIncludes = [];

        $scope.FilterIndustry = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.industryIncludes);
            if(i > -1 ){
                $scope.industryIncludes.splice(i, 1);
            } else {
                $scope.industryIncludes.push(filter);
            }
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
                    if ($.inArray(blueprints.blueprints[0].related_industry, $scope.industryIncludes) < 0)
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
                    if ($.inArray(blueprints.blueprints[0].related_location, $scope.locationIncludes) < 0)
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
                    if ($.inArray(blueprints.blueprints[0].related_salary, $scope.salaryIncludes) < 0)
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
                    if ($.inArray(blueprints.blueprints[0].related_experience, $scope.experienceIncludes) < 0)
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
            }).errors(function (data, status, headers, config) {
                // body...
                $scope.errors = data;
            });
        };

        /* END OF WORK ENVIORMENT PHOTO UPLOAD */

        $scope.temp_tasks = [];

        /* ADDING BLUEPRINT TASK */
        $scope.list_blueprint_tasks = [];
        $scope.addTask = function (task) {
            // body...z
            $scope.temp_tasks.push(task);
            $scope.temp_tasks.push($scope.new_employee);
            $scope.list_blueprint_tasks.push($scope.temp_tasks);
            $scope.new_employee = [];
            $scope.temp_tasks = [];
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
        }

        $scope.new_employee = [];

        /* CREATING BLUEPRINT */
        $scope.createBlueprint = function () {
            // body...
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
                $scope.errors = response.data;
            });
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

    RegisterCtrl.$inject = ['$scope', '$rootScope', '$state', '$window', 'AuthRes', 'metaTags', 'Pilots'];

    function RegisterCtrl($scope, $rootScope, $state, $window, AuthRes, metaTags, Pilots) {

        $scope.$emit('metaTagsChanged', metaTags);

        $scope.test_pilots = Pilots;

        $scope.reg = {};

        $scope.complete = false;

        $scope.profile_types = [{profile_type: true, label: 'JobSeeker'}, {profile_type: false, label: 'Employer'}];

        $scope.registration = function () {
            angular.forEach($scope.test_pilots, function (pilot) {
                if(pilot.email === $scope.reg.email){

                    AuthRes.save($scope.reg, function (resource) {
                        $scope.complete = true;
                    }, function (response) {
                        $scope.errors = response.data;
                    });
                }
                if(pilot.email !== $scope.reg.email){
                    $state.go('root.non_pilot', { reload: true });
                }
            });
        };

        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'LoginRes', 'JWTTokenRes', 'CheckUserRes'];

    function LoginCtrl($scope, $rootScope, $state, $timeout, LoginRes, JWTTokenRes, CheckUserRes) {


        $scope.checkuser = function (data) {
            // body...
            CheckUserRes.save(data, function (response) {
                // body...
            }, function (response) {
                // body...
                if(response.status === 400){
                    setTimeout(function() {
                        $state.go('root.register', { reload: true });
                    }, 600);
                } else {
                    setTimeout(function () {
                        // body...
                        $state.go('root.dashboard', { reload: true });
                    }, 600)
                }
            });
        };

        $scope.login = function() {
            LoginRes.login($scope.log.username, $scope.log.password).then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(response) {
                // body...
                console.log(response);
                if(response.status === "Unauthorized"){
                    console.log('bad password');
                    $scope.errors = true;
                    $scope.error = "Wrong password";
                } else {
                    JWTTokenRes.jwt($scope.log.username, $scope.log.password);
                    setTimeout(function () {
                        $state.go('root.dashboard', { reload: true });
                    }, 500);
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

(function () {
    // body...
    "use strict";

    angular.module('app').controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['$rootScope', '$scope', 'metaTags', 'UserInfo', 'UserInfoRes'];

    function ProfileCtrl($rootScope, $scope, metaTags, UserInfo, UserInfoRes) {
        // body...

        $scope.$on('metaTagsChanged', metaTags);

        $scope.user_info = UserInfo;

        $scope.updateProfile = function () {
            // body...
            UserInfoRes.update($scope.user_info, function (response) {
                // body...
                $scope.data = response;
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
        $scope.$on('metaTagsChanged', metaTags);

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
        $scope.$on('metaTagsChanged', metaTags);

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

    angular.module('app').directive('addDivDirective', function () {
        return {
            restrict: 'A',
            scope: true,
            template: `<a class='btn add-btn' id='addNewRow' ng-click="clickToClone('hiddenTasks', 'clonedTasks')"><span id='apply-span'>Add Task</span><span id='apply-span-2' class='hover hide-button'>Add Task</span></a>`,
            controller: function ($scope, $element, $compile) {
                $scope.clicked = 0;
                /*$scope.addNewTaskClick = function () {
                        $('#TasksBlueprint').append($compile($('#hiddenTasks:last').clone())($scope));
                        console.log($scope.new_employee);
                        $('#TasksBlueprint:last button:last').css({
                            display: 'inline'
                        });
                        $('#selectTask:last').find("option").val("");
                        var task = {name: $('#selectTask option:selected').text(), expert: $scope.new_employee, task_status: "Active"};
                        $scope.addTask(task);
                }*/
                $scope.clickToClone = function (sourceId, cloneId) {
                    var sourceHtml = angular.element(document.getElementById(sourceId)).html();
                    angular.element(document.getElementById(cloneId)).append(sourceHtml);
                        $('#TasksBlueprint:last button:last').css({
                            display: 'inline'
                        });
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
