(function() {
  var lib;

  lib = angular.module('gooii', []);

}).call(this);
;(function() {
  var app;

  app = angular.module('gooii');

  app.filter('capitalise', function() {
    return function(input, all) {
      if (!angular.isDefined(input)) {
        return '';
      }
      return input.replace(/([^\W_]+[^\s-]*) */g, (function(txt) {
        return "" + (txt.charAt(0).toUpperCase()) + (txt.substr(1).toLowerCase());
      }));
    };
  });

}).call(this);
;(function() {
  var app;

  app = angular.module('gooii');

  app.filter('commaJoinedList', function() {
    return function(input) {
      if (_.isArray(input)) {
        if (input.length > 0) {
          return input.join(', ');
        } else {
          return '';
        }
      } else {
        return input;
      }
    };
  });

}).call(this);
;(function() {
  var app;

  app = angular.module('gooii');

  app.filter('encodeQueryParams', function() {
    return function(query) {
      var delimiter, encoded, params, separator;
      encoded = "";
      separator = "=";
      delimiter = "&";
      params = [];
      _.forOwn(query, function(value, key) {
        if (angular.isString(value)) {
          return params.push("" + (encodeURIComponent(key)) + separator + (encodeURIComponent(value)));
        } else if (angular.isArray(value)) {
          return _.each(value, function(element) {
            return params.push("" + (encodeURIComponent(key)) + separator + (encodeURIComponent(element)));
          });
        } else if (angular.isNumber(value)) {
          return params.push("" + (encodeURIComponent(key)) + separator + value);
        } else if (_.isBoolean(value)) {
          return params.push("" + (encodeURIComponent(key)) + separator + value);
        }
      });
      if (params.length > 0) {
        encoded = params.join(delimiter);
      }
      return encoded;
    };
  });

}).call(this);
;(function() {
  var app;

  app = angular.module('gooii');

  app.filter('first', function() {
    return function(input, property) {
      if (!input) {
        return "";
      }
      if (input.length === 0) {
        return "";
      }
      if (!property) {
        return input[0];
      }
      return input[0][property];
    };
  });

}).call(this);
;(function() {
  var app;

  app = angular.module('gooii');

  app.filter('orderObjectsBy', function() {
    return function(items, field, reverse) {
      var filtered;
      filtered = [];
      angular.forEach(items, function(item, key) {
        item["key"] = key;
        return filtered.push(item);
      });
      filtered.sort(function(a, b) {
        if (a[field] > b[field]) {
          return 1;
        }
        if (a[field] < b[field]) {
          return -1;
        }
        return 0;
      });
      if (reverse) {
        filtered.reverse();
      }
      return filtered;
    };
  });

}).call(this);
;(function() {
  var CookieStoreFactoryService, CookieStoreService,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CookieStoreFactoryService = (function() {
    function CookieStoreFactoryService($cookieStore, logFactory) {
      this.$cookieStore = $cookieStore;
      this.logFactory = logFactory;
      this.remove = __bind(this.remove, this);
      this.getCookieStore = __bind(this.getCookieStore, this);
      this.log = this.logFactory.getLogger('service.cookieStoreFactory');
      this.log.log('Create Cookie Store Factory');
      this.cache = {};
    }

    CookieStoreFactoryService.prototype.getCookieStore = function(id) {
      if (!this.cache[id]) {
        this.log.log('Create Cookie Store %s', id);
        this.cache[id] = new CookieStoreService(this.$cookieStore, this.logFactory, id);
      } else {
        this.log.log('Get Cookie Store from cache %s', id);
      }
      return this.cache[id];
    };

    CookieStoreFactoryService.prototype.remove = function(cookies) {
      var _this = this;
      return _.each(cookies, function(cookieName) {
        return _this.$cookieStore.remove(cookieName);
      });
    };

    return CookieStoreFactoryService;

  })();

  CookieStoreService = (function() {
    CookieStoreService.cookieId = '';

    function CookieStoreService($cookieStore, logFactory, cookieId) {
      this.$cookieStore = $cookieStore;
      this.cookieId = cookieId;
      this.save = __bind(this.save, this);
      this.put = __bind(this.put, this);
      this.get = __bind(this.get, this);
      this.getCookie = __bind(this.getCookie, this);
      this.log = logFactory.getLogger('service.CookieStore.' + this.cookieId);
      this.log.log('Created cookie store with ID : %s', this.cookieId);
    }

    CookieStoreService.prototype.getCookie = function() {
      var cookie;
      if (!this.cookieId) {
        this.log.error('Cookie ID not defined');
        return;
      }
      if (this.cookie) {
        return this.cookie;
      }
      cookie = this.$cookieStore.get(this.cookieId);
      if (!cookie) {
        cookie = {};
        this.$cookieStore.put(this.cookieId, cookie);
      }
      this.cookie = cookie;
      return this.cookie;
    };

    CookieStoreService.prototype.get = function(key, defaultValue) {
      if (!this.cookie) {
        this.getCookie();
      }
      if (!this.cookie[key]) {
        this.cookie[key] = defaultValue;
        this.save();
      }
      return this.cookie[key];
    };

    CookieStoreService.prototype.put = function(key, value) {
      this.cookie[key] = value;
      return this.save();
    };

    CookieStoreService.prototype.save = function() {
      return this.$cookieStore.put(this.cookieId, this.cookie);
    };

    return CookieStoreService;

  })();

  angular.module('gooii').service('CookieStoreFactoryService', ['$cookieStore', 'LoggerService', CookieStoreFactoryService]);

}).call(this);
;(function() {
  var LoggerService, app,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  LoggerService = (function() {
    LoggerService.$inject = ['$window', 'configuration'];

    function LoggerService($window, config) {
      var logPattern, loggingConfig;
      this.$window = $window;
      this.config = config;
      this.getLogger = __bind(this.getLogger, this);
      this.init = __bind(this.init, this);
      logPattern = "[%logger] %m%n";
      loggingConfig = {
        appenders: [
          {
            name: "theconsole",
            type: "Console",
            appendStrings: false,
            layout: {
              type: "PatternLayout",
              pattern: logPattern
            }
          }
        ],
        loggers: [
          {
            root: true,
            level: this.config.logLevel,
            appenders: ["theconsole"]
          }
        ]
      };
      this.init(loggingConfig);
      return;
    }

    LoggerService.prototype.init = function(loggingConfig) {
      this.$window.woodman.load(loggingConfig);
    };

    LoggerService.prototype.getLogger = function(loggerName) {
      return this.$window.woodman.getLogger(loggerName);
    };

    return LoggerService;

  })();

  app = angular.module('gooii');

  app.service('LoggerService', LoggerService);

}).call(this);
;(function() {
  var TimeoutService, app,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TimeoutService = (function() {
    TimeoutService.$inject = ['$window', '$timeout', 'configuration', 'LoggerService', '$location'];

    function TimeoutService($window, $timeout, config, logFactory, location) {
      this.$window = $window;
      this.$timeout = $timeout;
      this.config = config;
      this.location = location;
      this.response = __bind(this.response, this);
      this.doTimeout = __bind(this.doTimeout, this);
      this.removeTimeoutHandler = __bind(this.removeTimeoutHandler, this);
      this.addTimeoutHandler = __bind(this.addTimeoutHandler, this);
      this.startNewTimeout = __bind(this.startNewTimeout, this);
      this.log = logFactory.getLogger('timeoutService');
      this.timeoutSeconds = 60 * 55;
      this.startNewTimeout();
      this.timeouts = [];
    }

    TimeoutService.prototype.startNewTimeout = function() {
      return this.t = this.$timeout(this.doTimeout, this.timeoutSeconds * 1000);
    };

    TimeoutService.prototype.addTimeoutHandler = function(t) {
      return this.timeouts.push(t);
    };

    TimeoutService.prototype.removeTimeoutHandler = function(t) {
      return _.remove(this.timeouts, t);
    };

    TimeoutService.prototype.doTimeout = function() {
      var _this = this;
      return _.each(this.timeouts, function(t) {
        return t.doTimeout();
      });
    };

    TimeoutService.prototype.response = function(response) {
      this.$timeout.cancel(this.t);
      this.startNewTimeout();
      return response;
    };

    return TimeoutService;

  })();

  app = angular.module('gooii');

  app.service('TimeoutService', TimeoutService);

}).call(this);
;(function() {
  var UrlStateService, app,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  UrlStateService = (function() {
    UrlStateService.$inject = ['$rootScope', '$window', '$location', '$timeout', '$q', 'LoggerService', '$cookieStore'];

    UrlStateService.cookieId = 'urlState';

    UrlStateService.useCookie = true;

    function UrlStateService($rootScope, $window, $location, $timeout, $q, logFactory, $cookieStore) {
      var cookie;
      this.$rootScope = $rootScope;
      this.$window = $window;
      this.$location = $location;
      this.$timeout = $timeout;
      this.$q = $q;
      this.$cookieStore = $cookieStore;
      this.cancel = __bind(this.cancel, this);
      this.restoreFromCookie = __bind(this.restoreFromCookie, this);
      this.store = __bind(this.store, this);
      this.autoCookie = __bind(this.autoCookie, this);
      this.log = logFactory.getLogger('service.UrlStateService');
      cookie = this.$cookieStore.get(this.cookieId);
      if (!cookie) {
        cookie = {
          query: null
        };
        this.$cookieStore.put(UrlStateService.cookieId, cookie);
      } else {
        this.log.info('Retrieved query state cookie %O', cookie);
        if (cookie.query) {
          this.log.info('Cookie has non null query. Restore it');
        }
      }
    }

    UrlStateService.prototype.autoCookie = function(auto) {
      return this.useCookie = auto;
    };

    UrlStateService.prototype.store = function(model, immediate) {
      var deferred, timeout,
        _this = this;
      if (!model) {
        this.log.error('Cant store null model');
      } else {
        this.log.log('Store model in url %O', model);
      }
      this.cancel();
      if (this.currentModel && _.isEqual(this.currentModel, model)) {
        this.log.log('Current model and new are equal. %O %O', this.currentModel, model);
        deferred = this.$q.defer();
        deferred.resolve(model);
        return deferred.promise;
      }
      this.log.log('Cache copy of model %O', model);
      this.currentModel = angular.copy(model);
      timeout = immediate === true ? 0 : 3000;
      this.timeoutPromise = this.$timeout(function() {
        var newSearch;
        newSearch = {};
        angular.extend(newSearch, model);
        _this.log.log('New search %O from model %O', angular.copy(newSearch, model));
        angular.extend(newSearch, _.transform(_this.$location.search(), function(result, val, key) {
          if (_.has(model, key) === false) {
            result[key] = val;
          }
          return result;
        }));
        _this.log.log('New search is now %O', angular.copy(newSearch));
        _this.$location.search(newSearch);
        _this.log.log('Storing query state in cookie %O', newSearch);
        if (_this.useCookie) {
          _this.$cookieStore.put(UrlStateService.cookieId, newSearch);
        }
        return model;
      }, timeout);
      return this.timeoutPromise;
    };

    UrlStateService.prototype.restoreFromCookie = function(path) {
      var cookie;
      cookie = this.$cookieStore.get(UrlStateService.cookieId);
      if (cookie) {
        this.log.log('Got state cookie %O', cookie);
        this.$location.path(path);
        return this.$location.search(cookie);
      }
    };

    UrlStateService.prototype.cancel = function() {
      if (this.timeoutPromise) {
        this.$timeout.cancel(this.timeoutPromise);
        return this.timeoutPromise = null;
      }
    };

    return UrlStateService;

  })();

  app = angular.module('gooii');

  app.service('UrlStateService', UrlStateService);

}).call(this);
;(function() {
  var UrlShortenerService, app,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  UrlShortenerService = (function() {
    UrlShortenerService.$inject = ['$window', '$q', '$rootScope', 'LoggerService', '$timeout', 'configuration'];

    function UrlShortenerService($window, $q, $rootScope, logFactory, $timeout, config) {
      this.$window = $window;
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.config = config;
      this.expand = __bind(this.expand, this);
      this.init = __bind(this.init, this);
      this.log = logFactory.getLogger('service.UrlShortener');
      if (!this.init()) {
        this.gapiCheck = this.$timeout(this.init, 1000);
      }
    }

    UrlShortenerService.prototype.init = function() {
      var _this = this;
      if (!this.$window.gapi && !this.$window.gapi.client) {
        this.log.log('GAPI Not ready');
        return false;
      } else if (this.gapiCheck) {
        this.$timeout.cancel(this.gapiCheck);
      }
      this.gapi = this.$window.gapi;
      this.gapiKey = this.config.gapi_key || 'AIzaSyD0u7QEzocaS5WC7Z1aJpeqwt2EuJz5c7I';
      this.gapi_deferred = this.$q.defer();
      this.gapi_loaded = this.gapi_deferred.promise;
      this.gapi.client.setApiKey(this.gapiKey);
      this.gapi.client.load('urlshortener', 'v1', function() {
        return _this.$rootScope.$apply(function() {
          return _this.gapi_deferred.resolve('loaded');
        });
      });
      return true;
    };

    UrlShortenerService.prototype.expand = function(url) {
      var deferred,
        _this = this;
      deferred = this.$q.defer();
      this.gapi_loaded.then(function() {
        var request;
        request = _this.gapi.client.urlshortener.url.get({
          'shortUrl': url
        });
        return request.execute(function(response) {
          return deferred.resolved(response.longUrl);
        });
      });
      return deferred;
    };

    UrlShortenerService.prototype.shorten = function(url) {
      var deferred,
        _this = this;
      deferred = this.$q.defer();
      this.gapi_loaded.then(function() {
        var request;
        request = _this.gapi.client.urlshortener.url.insert({
          'resource': {
            'longUrl': url
          }
        });
        return request.execute(function(response) {
          return deferred.resolve(response.id);
        });
      });
      return deferred.promise;
    };

    return UrlShortenerService;

  })();

  app = angular.module('gooii');

  app.service('UrlShortenerService', UrlShortenerService);

}).call(this);
