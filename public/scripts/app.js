!function(window,angular,undefined){"use strict";angular.module("App",["ngRoute","ngResource","ngCookies","ngMaterial","ngMessages","md.data.table","Expressive","exvTodo","Service","Controller"]).config(function($routeProvider,$locationProvider){$routeProvider.when("/",{title:"Expressive : Introduction",templateUrl:"/templates/introduction.html",controller:"IntroductionCtrl"}).when("/signin",{title:"Expressive : Sign in",templateUrl:"/templates/signin.html",controller:"SignInCtrl"}).when("/signup",{title:"Expressive : Sign Up",templateUrl:"/templates/signup.html",controller:"SignUpCtrl"}).when("/dashboard",{title:"Expressive : Dashboard",templateUrl:"/templates/dashboard.html",controller:"DashboardCtrl"}).when("/sandbox",{title:"Expressive : Sandbox",templateUrl:"/templates/sandbox.html",controller:"SandboxCtrl"}).when("/to-do",{title:"Expressive : To-Do",templateUrl:"/templates/to-do.html",controller:"ToDoCtrl"}).when("/users",{title:"Expressive : Users",templateUrl:"/templates/users.html",controller:"UsersCtrl"}).when("/groups",{title:"Expressive : Groups",templateUrl:"/templates/groups.html",controller:"GroupsCtrl"}).otherwise({redirectTo:"/"}),$locationProvider.html5Mode(!0)}).config(function($mdThemingProvider){$mdThemingProvider.theme("default").primaryPalette("blue").accentPalette("pink")})}(window,angular),function(window,angular,undefined){"use strict";var app=angular.module("Controller",[]);app.controller("MainCtrl",function($scope,$mdSidenav,$location,$cookies,$window,$timeout,Auth){$scope.height=$window.innerHeight,Auth.get(function(res){var adminUser=JSON.parse(res.user.groups),adminId=1,username=res.user.name.split(" ");$scope.loggedin=!0,$scope.username=username[0],adminUser.indexOf(adminId)<0?$scope.admin=!1:$scope.admin=!0},function(err){$scope.loggedin=!1}),$scope.searchButton=function(){$scope.searchToolbar=!0,$timeout(function(){document.getElementById("searchToolbarFocus").focus()},100)},$scope.toggleLeft=function(){$mdSidenav("left").toggle()},$scope.close=function(){$mdSidenav("left").close()},$scope.logout=function(){$cookies.remove("token"),$window.location.href="/signin"}}),app.controller("IntroductionCtrl",function($scope){}),app.controller("DashboardCtrl",function($scope){}),app.controller("ToDoCtrl",function($scope){var todos=[{id:1,title:"Title",todo:"Lorem",color:"#64B5F6",check:[]},{id:2,title:"Title 2",todo:"Lorem",color:"#fff",check:[]},{id:3,title:"Title 3",todo:"",color:"#FFF176",check:["Test baru sadjlk uwhau","asdklj wljawd","awdjlakwd"]}];$scope.todos=todos.reverse(),$scope.todoSubmit=function(todo){$scope.todos.unshift(todo),$scope.$apply()},$scope.todoUpdate=function(todo){console.log(todo)},$scope.todoDelete=function(todo){var id=$scope.todos.indexOf(todo);$scope.todos.splice(id,1)}}),app.controller("SignInCtrl",function($scope,$window,$cookies,$location,Auth){$scope.promise=!1,$scope.noNav=!0,$scope.doLogin=function(){$scope.message=!1,$scope.promise=!0,Auth.save(this.user,function(res){$cookies.put("token",res.token),res.success?$window.location.href="/":($scope.promise=!1,$scope.message=res.message)},function(err){$scope.promise=!1,console.log(err)})}}),app.controller("SignUpCtrl",function($scope,$window,$cookies,$location,User,Auth){$scope.doSignUp=function(){$scope.message=!1,User.save(this.user,function(res){res.success?($scope.promise=!0,Auth.save($scope.user,function(res){$cookies.put("token",res.token),res.success?$window.location.href="/dashboard":($scope.promise=!1,$scope.message=res.message)},function(err){$scope.promise=!1,console.log(err)})):$scope.message=res.message})}}),app.controller("SandboxCtrl",function($scope,$window,$q,$mdDialog,Sandbox){function getSandbox(params){var deferred=$q.defer();$scope.promise=deferred.promise,params.attributes=["name","id","address","gender"],params.order||(params.order="name"),Sandbox.get(params,function(res){$scope.sandbox=res.sandbox,$scope.pagination.total=res.countAll,deferred.resolve()},function(err){$window.location.href="/signin"})}function reloadSandbox(){getSandbox({limit:$scope.pagination.limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.selected=[]}$scope.pagination={page:1,limit:5},$scope.order="name",$scope.selected=[];var offset=0,sort="ASC";$scope.onReorder=function(order){sort="ASC",order.indexOf("-")||(sort="DESC",order=order.replace("-","")),getSandbox({limit:$scope.pagination.limit,offset:offset,order:order,sort:sort,search:$scope.searchModel})},$scope.onPaginate=function(page,limit){offset=(page-1)*limit,getSandbox({limit:limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel})},$scope["delete"]=function(){var id=[];$scope.selected.forEach(function(element,index){id.push(element.id)});var params={ids:id};Sandbox["delete"](params,function(res){reloadSandbox()})},$scope.$watch("searchModel",function(){$scope.searchModel?(getSandbox({limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.pagination.page=1):(getSandbox({limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.pagination.page=1)}),$scope.addSandbox=function(ev){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Add Sandbox",$scope.save=function(){Sandbox.save(this.sandbox,function(res){res.success?(reloadSandbox(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-sandbox.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})},$scope.editSandbox=function(ev,id){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Edit Sandbox",Sandbox.get({id:id},function(res){$scope.sandbox=res},function(err){console.log(err)}),$scope.save=function(){var id=this.sandbox.id;Sandbox.update({id:id},this.sandbox,function(res){res.success?(reloadSandbox(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-sandbox.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})}}),app.controller("UsersCtrl",function($scope,$window,$q,$mdDialog,User,Group){function getUser(params){var deferred=$q.defer();$scope.promise=deferred.promise,params.attributes=["name","email","id"],params.order||(params.order="name"),User.get(params,function(res){$scope.users=res.users,$scope.pagination.total=res.countAll,deferred.resolve()},function(err){$window.location.href="/signin"})}function reloadUser(){getUser({limit:$scope.pagination.limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.selected=[]}$scope.pagination={page:1,limit:5},$scope.order="name",$scope.selected=[];var offset=0,sort="ASC";$scope.onReorder=function(order){sort="ASC",order.indexOf("-")||(sort="DESC",order=order.replace("-","")),getUser({limit:$scope.pagination.limit,offset:offset,order:order,sort:sort,search:$scope.searchModel})},$scope.onPaginate=function(page,limit){offset=(page-1)*limit,getUser({limit:limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel})},$scope["delete"]=function(){var id=[];$scope.selected.forEach(function(element,index){id.push(element.id)});var params={ids:id};User["delete"](params,function(res){reloadUser()})},$scope.$watch("searchModel",function(){getUser($scope.searchModel?{limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}:{limit:$scope.pagination.limit})}),$scope.addUser=function(ev){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Add User",$scope.selected=[1],$scope.user={groups:"[1]"},Group.get(function(res){$scope.groups=res.groups}),$scope.toggle=function(item,list){var idx=list.indexOf(item);idx>-1?list.splice(idx,1):list.push(item),$scope.user.groups=JSON.stringify(list)},$scope.exists=function(item,list){return list.indexOf(item)>-1},$scope.save=function(){User.save(this.user,function(res){res.success?(reloadUser(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-user.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})},$scope.editUser=function(ev,id){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Edit User",$scope.password=!0,$scope.selected=[],Group.get(function(res){$scope.groups=res.groups}),$scope.toggle=function(item,list){var idx=list.indexOf(item);idx>-1?list.splice(idx,1):list.push(item),$scope.user.groups=JSON.stringify(list)},$scope.exists=function(item,list){return list.indexOf(item)>-1},User.get({id:id},function(res){res.password=null,$scope.user=res,$scope.selected=JSON.parse(res.groups)},function(err){console.log(err)}),$scope.save=function(){var id=this.user.id;User.update({id:id},this.user,function(res){res.success?(reloadUser(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-user.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})}}),app.controller("GroupsCtrl",function($scope,$window,$q,$mdDialog,Group){function getGroup(params){var deferred=$q.defer();$scope.promise=deferred.promise,params.attributes=["groupName","id"],params.order||(params.order="groupName"),Group.get(params,function(res){$scope.groups=res.groups,$scope.pagination.total=res.countAll,deferred.resolve()},function(err){$window.location.href="/signin"})}function reloadGroup(){getGroup({limit:$scope.pagination.limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.selected=[]}$scope.pagination={page:1,limit:5},$scope.order="groupName",$scope.selected=[];var offset=0,sort="ASC";$scope.onReorder=function(order){sort="ASC",order.indexOf("-")||(sort="DESC",order=order.replace("-","")),getGroup({limit:$scope.pagination.limit,offset:offset,order:order,sort:sort,search:$scope.searchModel})},$scope.onPaginate=function(page,limit){offset=(page-1)*limit,getGroup({limit:limit,offset:offset,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel})},$scope["delete"]=function(){var id=[];$scope.selected.forEach(function(element,index){id.push(element.id)});var params={ids:id};Group["delete"](params,function(res){reloadGroup()})},$scope.$watch("searchModel",function(){$scope.searchModel?(getGroup({limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.pagination.page=1):(getGroup({limit:$scope.pagination.limit,order:$scope.order.replace("-",""),sort:sort,search:$scope.searchModel}),$scope.pagination.page=1)}),$scope.addGroup=function(ev){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Add Group",$scope.save=function(){Group.save(this.group,function(res){res.success?(reloadGroup(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-group.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})},$scope.editGroup=function(ev,id){$mdDialog.show({controller:function($scope,$mdDialog){$scope.title="Edit Group",Group.get({id:id},function(res){$scope.group=res},function(err){console.log(err)}),$scope.save=function(){var id=this.group.id;Group.update({id:id},this.group,function(res){res.success?(reloadGroup(),$mdDialog.hide()):$scope.formMessage=res.message})},$scope.close=function(){$mdDialog.cancel()}},templateUrl:"templates/form-group.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!0})}})}(window,angular),function(window,angular,undefined){"use strict";$(".menu-list").each(function(){$(this).parent().find("exv-sidenav-child").length&&$(this).append('<i class="zmdi zmdi-chevron-down zmdi-hc-lg exv-arrow-menu"></i>')});var app=angular.module("Expressive",[]);app.run(function($rootScope,$route){$rootScope.$on("$routeChangeSuccess",function(){var currPath=window.location.pathname.replace("#",""),menuList=document.getElementsByClassName("menu-list"),content=$("#mainContent").children(),subTitle=$("exv-sub-title").children();subTitle.text(""),content.scrollTop(0),"undefined"!=typeof $route.current.title&&(document.title=$route.current.title),[].forEach.call(menuList,function(el){if("undefined"!=typeof angular.element(el).attr("href")){var href=angular.element(el).attr("href").replace("#","");currPath===href?(angular.element(el).addClass("active"),angular.element(el).parent("exv-sidenav-item").parent().parent().parent().parent().parent().addClass("collapsed")):angular.element(el).removeClass("active")}})})}),app.directive("exvSidenavTitle",function(){return{restrict:"E",transclude:!0,template:'<div class="exv-sidenav-title" ng-transclude></div>'}}),app.directive("exvSidenavParent",function(){return{restrict:"E",transclude:!0,template:'<ul class="exv-sidenav-content" ng-transclude></ul>'}}),app.directive("exvSidenavChild",function(){return{restrict:"E",transclude:!0,template:'<ul class="exv-sidenav-child" ng-transclude></ul>'}}),app.directive("exvSidenavItem",function(){return{restrict:"E",transclude:!0,link:function(scope,element){element.bind("click",function(){var contentScroller=document.getElementsByClassName("exv-sidenav-item"),collapsed=!1;element.hasClass("collapsed")&&(collapsed=!0),angular.element(contentScroller).parent().removeClass("collapsed");var childrend=element.find("exv-sidenav-child");0!==childrend.length&&(collapsed||element.addClass("collapsed"))})},template:['<li class="exv-sidenav-item" ng-transclude>',"</li>"].join("")}}),app.directive("exvFullHeight",function($window){return{restrict:"A",link:function(scope,element,attrs){var d=0;attrs.exvFullHeight&&(d=parseInt(attrs.exvFullHeight)),element.css("height",[$window.innerHeight+d,"px"].join("")),angular.element($window).bind("resize",function(){element.css("height",[$window.innerHeight+d,"px"].join(""))})}}}),app.directive("exvScroll",function(){return{restrict:"E",transclude:!0,template:'<div class="elm-scroll" ng-transclude></div>',link:function(scope,element,attrs){"true"===attrs.mainContent&&element.attr("id","mainContent")}}}),app.directive("exvBackgroundTop",function(){return{restrict:"E",transclude:!0,template:'<div class="exv-background-top" ng-transclude></div>',link:function(scope,element,attrs){attrs.background&&element.children().css("background",attrs.background),attrs.color&&element.children().css("color",attrs.color)}}}),app.directive("exvTitle",function(){return{restrict:"E",transclude:!0,template:'<h1 class="exv-title" ng-transclude></h1>',link:function(scope,element,attrs){var subTitle=$("exv-sub-title").children();subTitle.text(element.text()),$(element).closest("exv-scroll").children().scroll(function(){$(this).scrollTop()>=70?subTitle.hasClass("active")||subTitle.addClass("active"):$(this).scrollTop()<=70&&subTitle.hasClass("active")&&subTitle.removeClass("active")})}}}),app.directive("exvSubTitle",function(){return{restrict:"E",template:'<span class="exv-sub-title"></span>'}}),app.directive("exvWidgetInfo",function(){return{restrict:"A",link:function(scope,element,attrs){switch(element.addClass("exv-widget-info"),attrs.exvWidgetInfo){case"success":element.find("md-card-title").addClass("success");break;case"warning":element.find("md-card-title").addClass("warning");break;case"danger":element.find("md-card-title").addClass("danger")}}}})}(window,angular),function(window,angular,undefined){"use strict";var toDo=angular.module("exvTodo",[]);toDo.run(function($templateCache){$templateCache.put("todo-form.html",['<md-card class="todo-card">','<div class="todo-trigger" layout="row">','<span class="todo-title" flex>','<md-tooltip md-direction="down">',"New Image","</md-tooltip>","New To Do</span>",'<div flex layout="row" layout-align="end center">','<md-button class="md-icon-button todo-check-new">','<md-tooltip md-direction="down">',"New Checklist","</md-tooltip>",'<md-icon md-font-icon="zmdi-format-list-bulleted" class="zmdi zmdi-hc-lg"></md-icon>',"</md-button>",'<md-button class="md-icon-button todo-image-new">','<md-tooltip md-direction="down">',"New Image","</md-tooltip>",'<md-icon md-font-icon="zmdi-image" class="zmdi zmdi-hc-lg exv-menu-icon"></md-icon>',"</md-button>","</div>","</div>",'<div class="todo-form">','<form><div class="form-padding"><md-input-container md-no-float class="md-block">','<input class="todo-title-card" ng-model="todo.title" placeholder="Title">',"</md-input-container>","<exv-todo-text></exv-todo-text>","<exv-todo-list></exv-todo-list>",'<md-card-actions layout="row">',"<exv-todo-tools flex>as</exv-todo-tools>",'<div flex layout="row" layout-align="end center">','<md-button class="cancel-todo">Cancel</md-button>','<md-button type="submit">Add</md-button>',"</div>","</md-card-actions></div></form>","</div>","</md-card>"].join("")),$templateCache.put("todo-text.html",['<md-input-container class="md-block todo-text">',"<label>To-do</label>",'<textarea class="todo-content" ng-model="todo.todo" md-maxlength="150" rows="5" md-select-on-focus></textarea>',"</md-input-container>"].join("")),$templateCache.put("todo-list.html",['<ul class="todo-list">','<li ng-repeat="item in checkList" layout="row" class="todo-check-item">',"<md-checkbox aria-label=\"check-item\" ng-click=\"checked($index)\" ng-class=\"item.item === 'done' ? 'md-checked' : ''\">",'</md-checkbox><md-input-container flex md-no-float class="md-block">','<input value="{{item.item}}" ng-class="item.item === \'done\' ? \'todo-done\' : \'\'" class="todo-item" placeholder="List item">',"</md-input-container>",'<md-button class="md-icon-button todo-delete-check" ng-click="deleteCheck($index)">','<md-icon md-font-icon="zmdi-close" class="zmdi zmdi-hc-lg"></md-icon>',"</md-button>","</li>",'<div class="todo-new-list">','<md-icon md-font-icon="zmdi-plus" class="zmdi zmdi-hc-lg"></md-icon>',"New list</div></ul>"].join("")),$templateCache.put("todo-tools.html",["<md-menu>",'<md-button aria-label="Open demo menu" class="md-icon-button" ng-click="$mdOpenMenu()">','<md-tooltip md-direction="down">',"Change Color","</md-tooltip>",'<md-icon md-font-icon="zmdi-palette" class="zmdi zmdi-hc-lg"></md-icon>',"</md-button>",'<md-menu-content width="3">','<md-menu-item class="todo-palette-list">','<div class="todo-color" ng-repeat="color in palette.first" style="background-color: {{color}}" ng-click="changeColor(color)">',"</div>","</md-menu-item>",'<md-menu-item class="todo-palette-list">','<div class="todo-color" ng-repeat="color in palette.second" style="background-color: {{color}}" ng-click="changeColor(color)">',"</div>","</md-menu-item>","</md-menu-content>","</md-menu>"].join("")),$templateCache.put("todo-card.html",['<md-card class="todo-card" layout-padding ng-repeat="todo in todos track by $index" style="background-color: {{todo.color}}">','<div class="todo-container" ng-click="todoEdit($event, todo)">','<div class="todo-title-card">',"{{todo.title}}","</div>",'<div class="todo-form">','<p ng-if="todo.todo != \'\'" ng-bind="todo.todo"></p>','<ul ng-if="todo.check.length !== 0" ng-repeat="check in todo.check track by $index">','<li ng-bind="check"></li>',"</ul></div></div>",'<div layout="row" class="todo-card-tool">',"<exv-todo-tools></exv-todo-tools>",'<md-button aria-label="Open demo menu" class="md-icon-button" ng-click="todoArchive(todo)">','<md-tooltip md-direction="down">',"Archive","</md-tooltip>",'<md-icon md-font-icon="zmdi-archive" class="zmdi zmdi-hc-lg"></md-icon>',"</md-button>","</div>","</md-card>"].join("")),$templateCache.put("todo-edit-form.html",['<md-dialog aria-label="Todo dialog">','<md-dialog-content class="todo-dialog">','<form><div class="form-padding"><md-input-container md-no-float class="md-block">','<input class="todo-title-card" ng-model="todo.title" placeholder="Title">',"</md-input-container>","<exv-todo-text></exv-todo-text>","<exv-todo-list></exv-todo-list>","<exv-todo-tools flex>as</exv-todo-tools>","</div></form>","</md-dialog-content>","</md-dialog>"].join(""))}),toDo.directive("exvTodoForm",function($templateCache){return{restrict:"E",scope:{todoSubmit:"="},templateUrl:"todo-form.html",link:function(scope,element,attrs){function cancelTodo(){form.hide(),form.find("input").val(""),form.find("textarea").val(""),element.children().removeAttr("style"),scope.checkList=[1],todoTrigger.show()}var form=element.find("form"),todoTrigger=element.find(".todo-trigger");form.find(".todo-text"),form.find(".todo-list");scope.todo={title:"",todo:"",check:[],color:""},form.hide(),form.submit(function(){var item=element.find(".todo-item"),card=element.children().attr("style"),color=!1;item.each(function(index,el){var value=$(el).val();""!==value&&scope.todo.check.push(value)}),card&&(card=card.replace(" ",""),color=card.split(":"),color=color[1].replace(";","")),scope.todo.color=color,cancelTodo(),scope.todoSubmit(angular.copy(scope.todo)),scope.todo={check:[]}}),element.find(".todo-title").click(function(){todoTrigger.hide(),form.show(),form.find("exv-todo-text").show(),form.find("exv-todo-list").hide(),form.find(".todo-content").focus()}),element.find(".todo-check-new").click(function(event){todoTrigger.hide(),form.show(),form.find("exv-todo-text").hide(),form.find("exv-todo-list").show(),form.find(".todo-content").focus(),form.find(".todo-check-item:last").find("input").focus()}),element.find(".todo-image-new").click(function(event){todoTrigger.hide(),form.show()}),element.find(".cancel-todo").click(cancelTodo)}}}),toDo.directive("exvTodoText",function(){return{restrict:"E",templateUrl:"todo-text.html"}}),toDo.directive("exvTodoList",function($templateCache){return{restrict:"E",templateUrl:"todo-list.html",link:function(scope,element,attrs){scope.checkList=[{item:"",value:""}],element.find(".todo-trigger").hide(),element.find(".todo-new-list").bind("click",function(event){scope.checkList.push({item:"",value:""}),scope.$apply(),element.find(".todo-check-item").find("input").focus()}),scope.checked=function(index){var check=element.find(".todo-check-item:eq("+index+")");check.find("md-checkbox").hasClass("md-checked")?check.find("input").removeClass("todo-done"):check.find("input").addClass("todo-done")},scope.deleteCheck=function(index){scope.checkList.splice(index,1)}}}}),toDo.directive("exvTodoTools",function(){return{restrict:"E",templateUrl:"todo-tools.html",link:function(scope,element,attrs){scope.palette={first:["#fff","#FFF176","#64B5F6"],second:["#E57373","#90A4AE","#81C784"]},scope.changeColor=function(color){element.closest(".todo-card").css("background-color",color)}}}}),toDo.directive("exvTodoCard",function($mdDialog){return{restrict:"E",templateUrl:"todo-card.html",scope:{todos:"=",todoUpdate:"=",todoDelete:"="},link:function(scope,element,attrs){scope.todoEdit=function(ev,todo){function todoData($scope,$mdDialog){$scope.todo=todo}$mdDialog.show({templateUrl:"todo-edit-form.html",targetEvent:ev,clickOutsideToClose:!0,controller:todoData}),scope.todoUpdate(todo)},scope.todoArchive=function(todo){scope.todoDelete(todo)}}}})}(window,angular),function(window,angular,undefined){"use strict";var app=angular.module("Service",[]);app.factory("Auth",function($resource){return $resource("/api/auth")}),app.factory("Sandbox",function($resource){return $resource("/api/sandbox/:id",{id:"@_id"},{update:{method:"PUT"}})}),app.factory("User",function($resource){return $resource("/api/user/:id",{id:"@_id"},{update:{method:"PUT"}})}),app.factory("Group",function($resource){return $resource("/api/group/:id",{id:"@_id"},{update:{method:"PUT"}})}),app.service("group",function($http){var url="/api/group";this.saveGroup=function(data){return $http.post(url,data)},this.getGroups=function(params){return $http.get(url,{params:params})},this.getGroup=function(id){return $http.get(url+"/"+id)},this.deleteGroup=function(params){return $http["delete"](url,{params:params})}})}(window,angular);