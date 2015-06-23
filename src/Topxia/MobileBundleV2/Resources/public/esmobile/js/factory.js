var appFactory = angular.module('AppFactory', []);
appFactory.factory('AppUtil', ['$rootScope', '$timeout', function($rootScope, $timeout) {
	var utils = {
		createArray : function(count) {
			var arr = [];
			for (var i = count- 1; i >= 0; i--) {
				arr.unshift(i);
			};

			return arr;
		},
		coverCategoty : function(categoryTree) {
			var categorys = [];
			for (var i = categoryTree.length - 1; i >= 0; i--) {
				categorys.unshift(categoryTree[i]);
			};
		},
		showPop : function(opts, callback) {
			var confirmPopup = $ionicPopup.confirm({
			     title: opts.title,
			     template: opts.template,
			     okText : opts.okText || "确定",
			     cancelText : opts.cancelText || "取消"
			});
			
			confirmPopup.then(function(res) {
				callback(res);
			});
		},
		createDialog : function(title, template, btns, modalInitFunc) {
			
			var dia=$.dialog({
			        title: title,
			        content: template,
			        button: btns || ["确认"]
			});

			dia.on("dialog:action",function(e){
			       modalInitFunc(e.index);
			       dia.dialog("hide");
			});
		},
		inArray : function(elem, arr, i) {
			    var len;
			    var deletedIds = [];
			    var indexOf = deletedIds.indexOf;
			    if ( arr ) {
			        if ( indexOf ) {
			            return indexOf.call( arr, elem, i );
			        }
			        len = arr.length;
			        i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
			        for ( ; i < len; i++ ) {
			            if ( i in arr && arr[ i ] === elem ) {
			                return i;
			            }
			        }
			    }

			    return -1;
		}
	};
	
	return utils;
}]).
factory('ServcieUtil', function() {

	return {
		getService : function(name) {
			return angular.injector(["AppService", "ng"]).get(name);
		}
	}
}).
factory('VipUtil', function() {

	var payByYear = {
		title : "按年支付",
		type : 20
	};

	var payByMonth  ={
		title : "按月支付",
		type : 30
	};

	return {
		getPayType : function() {
			return {
				byYead : 20,
				byMonth : 30
			}
		},
		getPayMode : function(buyType) {
			
			if (buyType == 10) {
				return [payByYear, payByMonth];
			} else if (buyType == 20) {
				return [payByYear];
			} else {
				return [payByMonth];
			}
		}
	}
}).
factory('broadCast', ['$rootScope', function($rootScope) {
	angular.broadQueue = [];
	var broadCastService = {
		bind : function(event, callback){
			angular.broadQueue[event] = callback;
		},
		send : function(event, msg){
			callback = angular.broadQueue[event];
			//delete angular.broadQueue[event];
			callback(event, msg);
		}
	};
	return broadCastService;
}]).
factory('CourseUtil', ['$rootScope', 'CourseService', 'ClassRoomService' ,function(
	$rootScope, CourseService, ClassRoomService) {
	
	return {
		getFavoriteListTypes : function() {
			return {
				'course' : {
					url : "Course/getFavoriteNormalCourse",
					data : [],
					start : 0,
					canLoad : true
				},
				'live' : {
					url : "Course/getFavoriteLiveCourse",
					data : [],
					start : 0,
					canLoad : true
				}
			}
		},

		getCourseListTypes  : function() {
			return [
		  		{
		  			name : "课程",
		  			type : "normal"
		  		},
		  		{
		  			name : "班级",
		  			type : "classroom"
		  		},
		  		{
		  			name : "直播",
		  			type : "live"
		  		}
		  	]
		},

		getCourseListSorts : function() {
			return [
		  		{
		  			name : "最新",
		  			type : "latest"
		  		},
		  		{
		  			name : "最热",
		  			type : "popular"
		  		},
		  		{
		  			name : "推荐",
		  			type : "recommendedSeq"
		  		}
		  	]
		}
	};
}]).
factory('ImageUtil', ['$rootScope', function($rootScope){
	function getScreenWidth() {
		var width = window.screen.width;
		switch (window.orientation) {
		case 0:
			width = window.screen.width;
			break;
		case 90:
		case - 90 : width = window.screen.height;
			break
		}
		width = width * 0.96;
		return width
	}
	function zoomImage(img, width) {
		var oldH = img.height;
		var oldW = img.width;
		img.width = width;
		img.height = width / oldW * oldH
	}
	function adaptationImage() {
		var width = getScreenWidth();
		var imgs = angular.element(document.images);
		for (var i = 0; i < imgs.length; i++) {
			zoomImage(imgs[i], width)
		}
	}

	var util = {
		zoom : function(){
			var imageArray = new Array();
			var imgs = angular.element(document.images);
			for (var i = 0; i < imgs.length; i++) {
				var img = imgs[i];
				img.addEventListener('load',
				function() {
					var width = getScreenWidth();
					zoomImage(this, width)
				});
				img.alt = i;
				imageArray.push(img.src);
				img.addEventListener('click',
				function() {
					window.location = 'imageIndexNUrls://?' + this.alt + '.partation.' + imageArray.join('.partation.');
					window.jsobj.showImages(this.alt,imageArray);
				})
			}
			window.addEventListener('orientationchange',
			function() {
				adaptationImage()
			},
			false);
		}
	};

	return util;
	
}]);