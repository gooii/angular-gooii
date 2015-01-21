class TimeoutService
    @$inject: ['$window', '$timeout', 'configuration', 'LoggerService', '$location']

    constructor: (@$window, @$timeout, @config, logFactory, @location) ->
        @log = logFactory.getLogger('timeoutService')
        @timeoutSeconds = 60 * 55
#        @timeoutSeconds = 5
        @timeouts = []
        @startNewTimeout()

    startNewTimeout: =>
        @log.log('Start new timeout')
        @t = @$timeout @doTimeout, @timeoutSeconds * 1000

    addTimeoutHandler: (t) =>
        @timeouts.push(t)
        @log.log('Added timeout handler %O', @timeouts)

    removeTimeoutHandler: (t) =>
        _.remove @timeouts, t

    doTimeout: =>
        @log.log('Do timeout %O', @timeouts)
        _.each @timeouts, (t) =>
            @log.log('Call timeout %O',t)
            t()

    # http interceptor
    response: (response) =>
        @$timeout.cancel(@t)
        @startNewTimeout()
        return response

app = angular.module 'gooii'

app.service 'TimeoutService', TimeoutService
