module.exports = (ngModule) ->

    # generic filter which takes a javascript object and encodes each key/value
    # pair into a URL encoded string in the standard format:-
    #
    #   key=value&key=value
    #
    ngModule.filter 'gooiiEncodeQueryParams', ->
      return (query) ->
        encoded   = ""
        separator = "="
        delimiter = "&"
        params    = []

        _.forOwn query, (value, key) ->
          if angular.isString(value)
            params.push """#{encodeURIComponent(key)}#{separator}#{encodeURIComponent(value)}"""
          else if angular.isArray(value)
            _.each value, (element) ->
              params.push """#{encodeURIComponent(key)}#{separator}#{encodeURIComponent(element)}"""
          else if angular.isNumber(value)
            params.push """#{encodeURIComponent(key)}#{separator}#{value}"""
          else if _.isBoolean(value)
            params.push """#{encodeURIComponent(key)}#{separator}#{value}"""

        if params.length > 0
          encoded = params.join(delimiter)

        return encoded
