require('woodman')

# simple wrapper around our woodman logger
#
class LoggerService
  # configure dependency injection
  #
  @$inject: ['$window', 'gooii.ng.CONFIG']
  constructor: (@$window, @CONFIG) ->
    # logger configuration
    #
    logPattern    = "[%logger] %m%n"
    loggingConfig = {
      appenders: [{
        name: "theconsole"
        type: "Console"
        appendStrings: false
        layout: {
          type: "PatternLayout"
          pattern: logPattern
        }
      }]
      loggers: [{
        root: true
        level: @CONFIG.logLevel
        appenders: [
          "theconsole"
        ]
      }]
    }

    # load and initialise logger
    #
    @init(loggingConfig)

    return

  init: (loggingConfig) =>
    # init woodman
    #
    @$window.woodman.load(loggingConfig);

    return

  getLogger: (loggerName) =>
    return @$window.woodman.getLogger(loggerName)

module.exports = (ngModule) ->
    ngModule.service 'gooii.ng.loggerService', LoggerService
