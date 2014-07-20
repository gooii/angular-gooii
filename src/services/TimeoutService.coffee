class TimeoutService
  @$inject: ['$window', '$timeout','configuration', 'LoggerService', '$location']

  constructor: (@$window, @$timeout, @config, logFactory, @location) ->
    @log = logFactory.getLogger('timeoutService')
    @timeoutSeconds = 60 * 55
    @startNewTimeout()
    @timeouts = []

  startNewTimeout: =>
    @t = @$timeout @doTimeout, @timeoutSeconds * 1000

  addTimeoutHandler: (t) =>
    @timeouts.push(t)

  removeTimeoutHandler: (t) =>
    _.remove @timeouts, t

  doTimeout: =>
    _.each @timeouts, (t) =>
      t.doTimeout()

  # http interceptor
  response: (response) =>
    @$timeout.cancel(@t)
    @startNewTimeout()
    return response

app = angular.module 'gooii'

app.service 'TimeoutService', TimeoutService