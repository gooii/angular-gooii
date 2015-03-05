app = angular.module 'gooii.ng.arrays'

app.filter 'gooiiJoin', ->

  return (input) ->

    if _.isArray(input)
      if input.length > 0
        return input.join(', ')
      else return ''
    else
      return input
