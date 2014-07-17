# simple wrapper around our woodman logger
#
class LoggerService
  # configure dependency injection
  #
  @$inject: ['$window', 'configuration']

  constructor: (@$window, @config) ->
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
        level: @config.logLevel
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

app = angular.module 'gooii'

app.service 'LoggerService', LoggerService