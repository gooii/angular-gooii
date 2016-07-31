(function() {
  var ngArrays, ngLogging, ngObjects, ngPersistence, ngStrings, ngTime, ngUrl;

  ngArrays = angular.module('gooii.ng.arrays', []);

  ngObjects = angular.module('gooii.ng.objects', []);

  ngStrings = angular.module('gooii.ng.strings', []);

  ngUrl = angular.module('gooii.ng.url', []);

  ngPersistence = angular.module('gooii.ng.persistence', []);

  ngLogging = angular.module('gooii.ng.logging', []);

  ngTime = angular.module('gooii.ng.time', []);

  angular.module('gooii.ng', ['gooii.ng.arrays', 'gooii.ng.objects', 'gooii.ng.strings', 'gooii.ng.url', 'gooii.ng.persistence', 'gooii.ng.logging', 'gooii.ng.time']);

}).call(this);
;(function() {
  module.exports = function(ngModule) {
    return ngModule.filter('gooiiFirst', function() {
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
  };

}).call(this);
;(function() {
  module.exports = function(ngModule) {
    return ngModule.filter('gooiiJoin', function() {
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
  };

}).call(this);
;(function() {
  var LoggerService,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require('woodman');

  LoggerService = (function() {
    LoggerService.$inject = ['$window', 'gooii.ng.CONFIG'];

    function LoggerService($window, CONFIG) {
      var logPattern, loggingConfig;
      this.$window = $window;
      this.CONFIG = CONFIG;
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
            level: this.CONFIG.logLevel,
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

  module.exports = function(ngModule) {
    return ngModule.service('gooii.ng.loggerService', LoggerService);
  };

}).call(this);
;(function() {
  module.exports = function(ngModule) {
    return ngModule.filter('gooiiSort', function() {
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
  };

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

  module.exports = function(ngModule) {
    return ngModule.service('gooii.ng.cookieStoreService', ['$cookieStore', 'gooii.ng.loggerService', CookieStoreFactoryService]);
  };

}).call(this);
;(function() {
  module.exports = function(ngModule) {
    return ngModule.filter('gooiiCapitalise', function() {
      return function(input) {
        if (!angular.isDefined(input)) {
          return '';
        }
        return input.replace(/([^\W_]+[^\s-]*) */g, (function(txt) {
          return "" + (txt.charAt(0).toUpperCase()) + (txt.substr(1).toLowerCase());
        }));
      };
    });
  };

}).call(this);
;(function() {
  var TimeoutService,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TimeoutService = (function() {
    TimeoutService.$inject = ['$window', '$timeout', 'gooii.ng.CONFIG', 'gooii.ng.loggerService', '$location'];

    function TimeoutService(_$window, _$timeout, _CONFIG, _logFactory, _location) {
      this._$window = _$window;
      this._$timeout = _$timeout;
      this._CONFIG = _CONFIG;
      this._location = _location;
      this._doTimeout = __bind(this._doTimeout, this);
      this.removeTimeoutHandler = __bind(this.removeTimeoutHandler, this);
      this.addTimeoutHandler = __bind(this.addTimeoutHandler, this);
      this.startNewTimeout = __bind(this.startNewTimeout, this);
      this._log = _logFactory.getLogger('timeoutService');
      this._timeoutSeconds = this._CONFIG.timeoutSeconds || (60 * 55);
      this._timeoutHandlers = [];
      this.startNewTimeout();
      return;
    }

    TimeoutService.prototype.startNewTimeout = function() {
      this._$timeout(this._doTimeout, this._timeoutSeconds * 1000);
    };

    TimeoutService.prototype.addTimeoutHandler = function(t) {
      this._timeoutHandlers.push(t);
    };

    TimeoutService.prototype.removeTimeoutHandler = function(t) {
      _.remove(this._timeoutHandlers, t);
    };

    TimeoutService.prototype._doTimeout = function() {
      var _this = this;
      _.each(this._timeoutHandlers, function(t) {
        return t.doTimeout();
      });
    };

    return TimeoutService;

  })();

  module.exports = function(ngModule) {
    return ngModule.service('gooii.ng.timeoutService', TimeoutService);
  };

}).call(this);
;(function() {
  module.exports = function(ngModule) {
    return ngModule.filter('gooiiEncodeQueryParams', function() {
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
  };

}).call(this);
