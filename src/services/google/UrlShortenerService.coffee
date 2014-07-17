class UrlShortenerService
  @$inject: ['$window', '$q', '$rootScope', 'LoggerService', '$timeout', 'configuration']

  constructor: (@$window, @$q, @$rootScope, logFactory, @$timeout, @config) ->
    @log = logFactory.getLogger('service.UrlShortener')

    if not @init()
      @gapiCheck = @$timeout @init, 1000

  init: () =>
    if not @$window.gapi and not @$window.gapi.client
      @log.log('GAPI Not ready')
      return false
    else if @gapiCheck
      @$timeout.cancel(@gapiCheck)

    @gapi = @$window.gapi
    @gapiKey       = @config.gapi_key or 'AIzaSyD0u7QEzocaS5WC7Z1aJpeqwt2EuJz5c7I'
    @gapi_deferred = @$q.defer()
    @gapi_loaded   = @gapi_deferred.promise

    # we assume that the google javascript library is ready
    #
    @gapi.client.setApiKey(@gapiKey)
    @gapi.client.load 'urlshortener', 'v1', =>
      @$rootScope.$apply =>
        @gapi_deferred.resolve('loaded')

    return true

  expand: (url) =>
    deferred = @$q.defer()

    # ensure api is loaded then make request
    @gapi_loaded
    .then =>
      request = @gapi.client.urlshortener.url.get 'shortUrl': url
      request.execute (response) ->
        deferred.resolved(response.longUrl)

    return deferred

  shorten: (url) ->
    deferred = @$q.defer()

    # ensure api is loaded then make request
    @gapi_loaded.then =>
      request = @gapi.client.urlshortener.url.insert 'resource':'longUrl': url
      request.execute (response) ->
        deferred.resolve(response.id)

    return deferred.promise

app = angular.module 'gooii'

app.service 'UrlShortenerService', UrlShortenerService