!function(window,angular,undefined){"use strict";angular.module("App",["ngRoute","ngResource","ngCookies","ngMaterial","ngMessages","md.data.table","Expressive","Service","Controller"]).config(function($routeProvider,$locationProvider){$routeProvider.when("/dashboard",{title:"Expressive : Dashboard",templateUrl:"/templates/dashboard.html",controller:"DashboardCtrl"}).when("/login",{title:"Expressive : Login",templateUrl:"/templates/login.html",controller:"LoginCtrl"}).when("/users",{title:"Expressive : Users",templateUrl:"/templates/users.html",controller:"UsersCtrl"}).when("/groups",{title:"Expressive : Groups",templateUrl:"/templates/groups.html",controller:"GroupsCtrl"}).otherwise({redirectTo:"/dashboard"}),$locationProvider.html5Mode(!0)}).config(function($mdThemingProvider){$mdThemingProvider.theme("default").primaryPalette("blue").accentPalette("pink")})}(window,angular),function(window,angular,undefined){"use strict";angular.module("Controller",[]).controller("MainCtrl",function($scope,$mdSidenav,$location,$cookies,$window,$timeout,Auth){$scope.height=$window.innerHeight,Auth.get(function(res){$scope.loggedin=!0},function(err){$scope.loggedin=!1}),$scope.searchButton=function(){$scope.searchToolbar=!0,$timeout(function(){document.getElementById("searchToolbarFocus").focus()},100)},$scope.toggleLeft=function(){$mdSidenav("left").toggle()},$scope.close=function(){$mdSidenav("left").close()},$scope.logout=function(){$cookies.remove("token"),$window.location.href="/login"}}).controller("DashboardCtrl",function($scope,$location,$http){}).controller("LoginCtrl",function($scope,$window,$cookies,$location,Auth){$scope.promise=!1,$scope.noNav=!0,$scope.doLogin=function(){$scope.promise=!0,Auth.save(this.user,function(res){$cookies.put("token",res.token),res.success?$window.location.href="/dashboard":($scope.promise=!1,$scope.message=res.message)},function(err){$scope.promise=!1,console.log(err)})}}).controller("UsersCtrl",function($scope,$location,$q,$mdDialog,User,Group){function getUser(params){var deferred=$q.defer();$scope.promise=deferred.promise,params.attributes=["firstName","lastName","email","id"],params.order||(params.order="firstName"),User.get(params,function(res){$scope.users=res.users,$scope.pagination.total=res.countAll,deferred.resolve()},function(err){$location.path("/login")})}function reloadUser(){getUser({limit:$scope.pagination.limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.selected=[]}$scope.pagination={page:1,limit:5},$scope.order="firstName",$scope.selected=[];var offset=0,sort="ASC";$scope.onReorder=function(order){sort="ASC",order.indexOf("-")||(sort="DESC",order=order.replace("-","")),getUser({limit:$scope.pagination.limit,offset:offset,order:order,sort:sort,search:$scope.searchModel})},$scope.onPaginate=function(page,limit){offset=(page-1)*limit,getUser({limit:limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel})},$scope["delete"]=function(){var id=[];$scope.selected.forEach(function(element,index){id.push(element.id)});var params={ids:id};User["delete"](params,function(res){console.log(res),reloadUser()})},$scope.$watch("searchModel",function(){getUser($scope.searchModel?{limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}:{limit:$scope.pagination.limit})}),$scope.addUser=function(ev){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Add User",$scope.selected=[1],$scope.user={groups:"[1]"},Group.get(function(res){$scope.groups=res.groups}),$scope.toggle=function(item,list){var idx=list.indexOf(item);idx>-1?list.splice(idx,1):list.push(item),$scope.user.groups=JSON.stringify(list)},$scope.exists=function(item,list){return list.indexOf(item)>-1},$scope.save=function(){User.save(this.user,function(res){res.success?(reloadUser(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-user.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})},$scope.editUser=function(ev,id){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Edit User",$scope.password=!0,$scope.selected=[],Group.get(function(res){$scope.groups=res.groups}),$scope.toggle=function(item,list){var idx=list.indexOf(item);idx>-1?list.splice(idx,1):list.push(item),$scope.user.groups=JSON.stringify(list)},$scope.exists=function(item,list){return list.indexOf(item)>-1},User.get({id:id},function(res){res.password=null,$scope.user=res,$scope.selected=JSON.parse(res.groups)},function(err){console.log(err)}),$scope.save=function(){var id=this.user.id;User.update({id:id},this.user,function(res){res.success?(reloadUser(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-user.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})}}).controller("GroupsCtrl",function($scope,$location,$q,$mdDialog,Group){function getGroup(params){var deferred=$q.defer();$scope.promise=deferred.promise,params.attributes=["groupName","id"],params.order||(params.order="groupName"),Group.get(params,function(res){$scope.groups=res.groups,$scope.pagination.total=res.countAll,deferred.resolve()},function(err){$location.path("/login")})}function reloadGroup(){getGroup({limit:$scope.pagination.limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.selected=[]}$scope.pagination={page:1,limit:5},$scope.order="groupName",$scope.selected=[];var offset=0,sort="ASC";$scope.onReorder=function(order){sort="ASC",order.indexOf("-")||(sort="DESC",order=order.replace("-","")),getGroup({limit:$scope.pagination.limit,offset:offset,order:order,sort:sort,search:$scope.searchModel})},$scope.onPaginate=function(page,limit){offset=(page-1)*limit,getGroup({limit:limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel})},$scope["delete"]=function(){var id=[];$scope.selected.forEach(function(element,index){id.push(element.id)});var params={ids:id};Group["delete"](params,function(res){reloadGroup()})},$scope.$watch("searchModel",function(){$scope.searchModel?(getGroup({limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.pagination.page=1):(getGroup({limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.pagination.page=1)}),$scope.addGroup=function(ev){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Add Group",$scope.save=function(){Group.save(this.group,function(res){res.success?(reloadGroup(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-group.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})},$scope.editGroup=function(ev,id){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Edit Group",Group.get({id:id},function(res){$scope.group=res},function(err){console.log(err)}),$scope.save=function(){var id=this.group.id;Group.update({id:id},this.group,function(res){res.success?(reloadGroup(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-group.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})}})}(window,angular),function(window,angular,undefined){"use strict";window.onload=function(){var classExvScroll=document.querySelectorAll(".elm-scroll");[].forEach.call(classExvScroll,function(el){Ps.initialize(el)});var contentScroller=document.getElementById("contentScroller");if(contentScroller){var scope=angular.element(contentScroller).scope();Ps.initialize(contentScroller),scope.$on("$routeChangeStart",function(next,current){contentScroller.scrollTop=0,Ps.update(contentScroller)})}var menuListItem=document.getElementsByClassName("menu-list"),eleListItem=angular.element(menuListItem);[].forEach.call(eleListItem,function(el){angular.element(el).parent().find("exv-sidenav-child").length&&angular.element(el).append('<i class="zmdi zmdi-chevron-down zmdi-hc-lg exv-arrow-menu"></i>')})},angular.module("Expressive",[]).run(function($rootScope,$route){$rootScope.$on("$routeChangeSuccess",function(){var currPath=window.location.pathname.replace("#",""),menuList=document.getElementsByClassName("menu-list");"undefined"!=typeof $route.current.title&&(document.title=$route.current.title),[].forEach.call(menuList,function(el){if("undefined"!=typeof angular.element(el).attr("href")){var href=angular.element(el).attr("href").replace("#","");currPath===href?(angular.element(el).addClass("active"),angular.element(el).parent("exv-sidenav-item").parent().parent().parent().parent().parent().addClass("collapsed")):angular.element(el).removeClass("active")}})})}).directive("exvSidenavTitle",function(){return{restrict:"E",transclude:!0,template:'<div class="exv-sidenav-title" ng-transclude></div>'}}).directive("exvSidenavParent",function(){return{restrict:"E",transclude:!0,template:'<ul class="exv-sidenav-content" ng-transclude></ul>'}}).directive("exvSidenavChild",function(){return{restrict:"E",transclude:!0,template:'<ul class="exv-sidenav-child" ng-transclude></ul>'}}).directive("exvSidenavItem",function(){return{restrict:"E",transclude:!0,controller:function($scope,$element){$scope.clickMenu=function(){var contentScroller=document.getElementsByClassName("exv-sidenav-item"),collapsed=!1;$element.hasClass("collapsed")&&(collapsed=!0),angular.element(contentScroller).parent().removeClass("collapsed");var childrend=$element.find("exv-sidenav-child");0!==childrend.length&&(collapsed||$element.addClass("collapsed"))}},template:['<li class="exv-sidenav-item" ng-click="clickMenu()" ng-transclude>',"</li>"].join("")}}).directive("exvFullHeight",function($window){return{restrict:"A",link:function(scope,element,attrs){var d=0;attrs.exvFullHeight&&(d=parseInt(attrs.exvFullHeight)),element.css("height",[$window.innerHeight+d,"px"].join("")),angular.element($window).bind("resize",function(){element.css("height",[$window.innerHeight+d,"px"].join(""))})}}}).directive("exvScroll",function(){return{restrict:"E",transclude:!0,template:'<div class="elm-scroll" ng-transclude></div>'}})}(window,angular),function(window,angular,undefined){"use strict";angular.module("Service",[]).factory("Auth",function($resource){return $resource("/api/auth")}).factory("User",function($resource){return $resource("/api/user/:id",{id:"@_id"},{update:{method:"PUT"}})}).factory("Group",function($resource){return $resource("/api/group/:id",{id:"@_id"},{update:{method:"PUT"}})}).service("group",function($http){var url="/api/group";this.saveGroup=function(data){return $http.post(url,data)},this.getGroups=function(params){return $http.get(url,{params:params})},this.getGroup=function(id){return $http.get(url+"/"+id)},this.deleteGroup=function(params){return $http["delete"](url,{params:params})}})}(window,angular);