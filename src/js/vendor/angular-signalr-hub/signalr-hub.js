//angular.module('SignalR', [])
//.constant('$', $)
//.factory('Hub', ['$', function ($) {
//	//This will allow same connection to be used for all Hubs
//	//It also keeps connection as singleton.
//	var globalConnections = [];
//
//	function initNewConnection(options) {
//		var connection = null;
//		if (options && options.rootPath) {
//			connection = $.hubConnection(options.rootPath, { useDefaultPath: false });
//		} else {
//			connection = $.hubConnection();
//		}
//
//		connection.logging = (options && options.logging ? true : false);
//		return connection;
//	}
//
//	function getConnection(options) {
//		var useSharedConnection = !(options && options.useSharedConnection === false);
//		if (useSharedConnection) {
//			return typeof globalConnections[options.rootPath] === 'undefined' ?
//			globalConnections[options.rootPath] = initNewConnection(options) :
//			globalConnections[options.rootPath];
//		}
//		else {
//			return initNewConnection(options);
//		}
//	}
//
//	return function (hubName, options) {
//		var Hub = this;
//
//		Hub.connection = getConnection(options);
//		Hub.proxy = Hub.connection.createHubProxy(hubName);
//
//		Hub.on = function (event, fn) {
//			Hub.proxy.on(event, fn);
//		};
//		Hub.invoke = function (method, args) {
//			return Hub.proxy.invoke.apply(Hub.proxy, arguments)
//		};
//		Hub.disconnect = function () {
//			Hub.connection.stop();
//		};
//		Hub.connect = function () {
//			return Hub.connection.start(options.transport ? { transport: options.transport } : null);
//		};
//
//		if (options && options.listeners) {
//			angular.forEach(options.listeners, function (fn, event) {
//				Hub.on(event, fn);
//			});
//		}
//		if (options && options.methods) {
//			angular.forEach(options.methods, function (method) {
//				Hub[method] = function () {
//					var args = $.makeArray(arguments);
//					args.unshift(method);
//					return Hub.invoke.apply(Hub, args);
//				};
//			});
//		}
//		if (options && options.queryParams) {
//			Hub.connection.qs = options.queryParams;
//		}
//		if (options && options.errorHandler) {
//			Hub.connection.error(options.errorHandler);
//		}
//		//Allow for the user of the hub to easily implement actions upon disconnected.
//		//e.g. : Laptop/PC sleep and reopen, one might want to automatically reconnect
//		//by using the disconnected event on the connection as the starting point.
//		if (options && options.hubDisconnected) {
//		    Hub.connection.disconnected(options.hubDisconnected);
//		}
//
//		//Adding additional property of promise allows to access it in rest of the application.
//		Hub.promise = Hub.connect();
//		return Hub;
//	};
//}]);

angular.module("SignalR", []).constant("$", $).factory("Hub", ["$",
	function(a) {
		function c(b) {
			var c = null;
			return c = b && b.rootPath ? a.hubConnection(b.rootPath, {
				useDefaultPath: !1
			}) : a.hubConnection(), c.logging = b && b.logging ? !0 : !1, c
		}

		function d(a) {
			var d = !(a && a.useSharedConnection === !1);
			return d ? null === b ? b = c(a) : b : c(a)
		}
		var b = null;
		return function(b, c) {
			var e = this;
			return e.connection = d(c), e.proxy = e.connection.createHubProxy(b), e.on = function(a, b) {
				e.proxy.on(a, b)
			}, e.invoke = function() {
				return e.proxy.invoke.apply(e.proxy, arguments)
			}, e.disconnect = function() {
				e.connection.stop()
			}, e.connect = function() {
				e.connection.start()
			}, c && c.listeners && angular.forEach(c.listeners, function(a, b) {
				e.on(b, a)
			}), c && c.methods && angular.forEach(c.methods, function(b) {
				e[b] = function() {
					var c = a.makeArray(arguments);
					return c.unshift(b), e.invoke.apply(e, c)
				}
			}), c && c.queryParams && (e.connection.qs = c.queryParams), c && c.errorHandler && e.connection.error(c.errorHandler), e.promise = e.connection.start(), e
		}
	}
]);