class CookieStoreFactoryService

  constructor: (@$cookieStore, @logFactory) ->
    @log = @logFactory.getLogger('service.cookieStoreFactory')
    @log.log('Create Cookie Store Factory')
    @cache = {}

  getCookieStore: (id) =>
    if not @cache[id]
      @log.log('Create Cookie Store %s',id)
      @cache[id] = new CookieStoreService(@$cookieStore, @logFactory, id)
    else
      @log.log('Get Cookie Store from cache %s',id)

    return @cache[id]

class CookieStoreService

  @cookieId: ''

  constructor: (@$cookieStore, logFactory, @cookieId) ->
    @log = logFactory.getLogger('service.CookieStore.' + @cookieId)
    @log.log('Created cookie store with ID : %s', @cookieId)

  getCookie: () =>

    if not @cookieId
      @log.error 'Cookie ID not defined'
      return

    if @cookie
      return @cookie

    cookie = @$cookieStore.get @cookieId

    if not cookie
      cookie = {}
      @$cookieStore.put(@cookieId, cookie)

    @cookie = cookie
    
    return @cookie

  get:(key, defaultValue) =>
    if !@cookie
      @getCookie()

    if !@cookie[key]
      @cookie[key] = defaultValue
      @save()

    return @cookie[key]

  put:(key, value) =>
    @cookie[key] = value
    @save()

  save: () =>
    @$cookieStore.put(@cookieId, @cookie)

angular.module('gooii').service 'CookieStoreFactoryService', ['$cookieStore', 'LoggerService', CookieStoreFactoryService]