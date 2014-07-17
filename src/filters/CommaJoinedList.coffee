app = angular.module 'gooii'

app.filter 'commaJoinedList', ->

  return (input) ->

    if _.isArray(input)
      if input.length > 0
        return input.join(', ')
      else return ''
    else
      return input
