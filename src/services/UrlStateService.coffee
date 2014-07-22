# service allowing controllers to persist application state to the URL
class UrlStateService
  # configure dependency injection
  #
  @$inject: ['$rootScope', '$window', '$location', '$timeout', '$q', 'LoggerService', '$cookieStore']

  # Static property for retrieval and storeage of layout cookie
  @cookieId: 'urlState'

  @useCookie: true

  # create service
  #
  constructor: (@$rootScope, @$window, @$location, @$timeout, @$q, logFactory, @$cookieStore) ->
    # initialise logger
    #
    @log = logFactory.getLogger('service.UrlStateService')


    cookie = @$cookieStore.get @cookieId

    # Setup application cookie object
    if not cookie
      # Create the layout cookie with defaults
      cookie =
        query:null
      # Store the cookie
      @$cookieStore.put(UrlStateService.cookieId, cookie)
    else
      @log.info 'Retrieved query state cookie %O', cookie
      if cookie.query
        @log.info 'Cookie has non null query. Restore it'

  autoCookie: (auto) =>
    @useCookie = auto

  # allows controllers to store the current state of their model type
  # in the browser URL (without affecting other query parameters); it
  # would be nice if we had interfaces but we expect the model passed
  # to implement a toRouteModel method
  #
  store: (model, immediate) =>

    if not model
      @log.error('Cant store null model')
    else
      @log.log('Store model in url %O', model)
    # cancel any previous timeout promise operations
    #
    @cancel()

    # if the model passed in already represents our cached instance
    # no need to do any further work
    #
    if (@currentModel and _.isEqual(@currentModel, model))
      @log.log('Current model and new are equal. %O %O', @currentModel, model)
      # create a new deferred object
      #
      deferred = @$q.defer()

      # resolve the promise immediately with the model
      #
      deferred.resolve(model)

      # return the resolved promise
      #
      return deferred.promise

    # cache (a copy!) of this new model instance
    #
    @log.log('Cache copy of model %O', model)
    @currentModel = angular.copy model

    # set default timeout or zero
    #
    timeout = if immediate is true then 0 else 3000

    # keep a reference to the promise returned by the $timeout service
    # so we can cancel it later if a new request comes in
    #
    @timeoutPromise = @$timeout () =>
      # need to start with a fresh set of $location search parameters
      #
      newSearch = {}
      # extend it with the new set of query parameters converted to a route
      # model instance
      #
      angular.extend newSearch, model

      @log.log('New search %O from model %O', angular.copy newSearch, model)
      # further extend it, with parameters present in the current
      # $location WHICH ARE NOT PRESENT in the new instance
      #
      angular.extend newSearch, _.transform @$location.search(), (result, val, key) =>
        result[key] = val if _.has(model, key) is false
        return result

      @log.log('New search is now %O', angular.copy newSearch)

      # update $location
      #
      @$location.search(newSearch)

      @log.log('Storing query state in cookie %O', newSearch)
      # update the cookie
      if @useCookie
        @$cookieStore.put(UrlStateService.cookieId, newSearch)

      # resolve our promise with the saved model
      #
      return model
    , timeout

    return @timeoutPromise

  restoreFromCookie: (path) =>

    cookie = @$cookieStore.get UrlStateService.cookieId

    if cookie
      @log.log('Got state cookie %O', cookie)
      @$location.path(path)
      @$location.search(cookie)

  # private (by '_' convention) to cancel any pending model persist
  # operations if one is already in progress
  #
  cancel: =>
    if @timeoutPromise
      # request that the timeout service cancels the operation associated
      # with this promise
      #
      @$timeout.cancel @timeoutPromise

      # clear the current promise until the next timeout operation
      #
      @timeoutPromise = null


# reference to our application module
#
app = angular.module 'gooii'

# register service
#
app.service 'UrlStateService', UrlStateService