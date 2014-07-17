app = angular.module 'gooii'

# generic filter which takes a javascript object and encodes each key/value
# pair into a URL encoded string in the standard format:-
#
#   key=value&key=value
#
app.filter 'encodeQueryParams', ->

  return (query) ->
    encoded   = ""
    separator = "="
    delimiter = "&"
    params    = []

    _.forOwn query, (value, key) ->
      if angular.isString(value)
        params.push """#{encodeURIComponent(key)}#{separator}#{encodeURIComponent(value)}"""

      if angular.isArray(value)
        _.each value, (element) ->
          params.push """#{encodeURIComponent(key)}#{separator}#{encodeURIComponent(element)}"""

      if angular.isNumber(value)
        params.push """#{encodeURIComponent(key)}#{separator}#{value}"""

    if params.length > 0
      encoded = params.join(delimiter)

    return encoded