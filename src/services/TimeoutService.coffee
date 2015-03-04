class TimeoutService
    @$inject: ['$window', '$timeout', 'configuration', 'LoggerService', '$location']
    constructor: (@_$window, @_$timeout, @_config, _logFactory, @_location) ->
        @_log               = _logFactory.getLogger('timeoutService')
        @_timeoutSeconds    = @_config.timeoutSeconds or (60 * 55)
        @_timeoutHandlers   = []
        # trigger processing of any timeoutHandlers in n seconds time
        #
        @startNewTimeout()

        # done
        #
        return

    startNewTimeout: =>
        # start our internal timeout process which on expiration will invoked
        # 'doTimeout' on any registered handlers
        #
        @_$timeout(@_doTimeout, @_timeoutSeconds * 1000)

        # done
        #
        return

    # adds a timeout handler to our internal list of handlers
    #
    addTimeoutHandler: (t) =>
        @_timeoutHandlers.push(t)
        # done
        #
        return

    # removes a timeout handler
    #
    removeTimeoutHandler: (t) =>
        # remove the handler
        #
        _.remove @_timeoutHandlers, t
        # done
        #
        return

    # performs the internal timeout processing by invoking 'doTimeout' on each
    # registered handler
    #
    _doTimeout: =>
        _.each @_timeoutHandlers, (t) => t.doTimeout()
        # done
        #
        return

app = angular.module 'gooii'

app.service 'TimeoutService', TimeoutService
