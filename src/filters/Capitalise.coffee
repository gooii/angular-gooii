app = angular.module 'gooii'

app.filter 'capitalise', ->
    return (input, all) ->
        unless angular.isDefined input
            return ''
        return input.replace(/([^\W_]+[^\s-]*) */g, ((txt) ->
            return "#{txt.charAt(0).toUpperCase()}#{txt.substr(1).toLowerCase()}")
        )

