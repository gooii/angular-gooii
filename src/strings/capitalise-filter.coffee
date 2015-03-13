app = angular.module 'gooii.ng.strings'

app.filter 'gooii.ng.strings.capitalise', ->
    return (input) ->
        unless angular.isDefined input
            return ''
        return input.replace(/([^\W_]+[^\s-]*) */g, ((txt) ->
                return "#{txt.charAt(0).toUpperCase()}#{txt.substr(1).toLowerCase()}")
        )
