module.exports = (ngModule) ->
    ngModule.filter 'gooiiSort', ->

      return (items, field, reverse) ->

        filtered = []

        angular.forEach(items, (item , key) ->
          item["key"] = key
          filtered.push(item)
        )

        filtered.sort( (a, b) ->
          if(a[field] > b[field])
            return 1
          if(a[field] < b[field])
            return -1

          return 0;
        )

        if reverse
          filtered.reverse()

        return filtered
