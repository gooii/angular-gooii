app = angular.module 'gooii'

app.filter 'first', ->

  return (input, property) ->

    if !input
      return ""

    if input.length == 0
      return ""

    if !property
      return input[0]

    return input[0][property]