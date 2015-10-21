ngArrays =      angular.module('gooii.ng.arrays'        , []);
ngObjects =     angular.module('gooii.ng.objects'       , []);
ngStrings =     angular.module('gooii.ng.strings'       , []);
ngUrl =         angular.module('gooii.ng.url'           , []);
ngPersistence = angular.module('gooii.ng.persistence'   , []);
ngLogging =     angular.module('gooii.ng.logging'       , []);
ngTime =        angular.module('gooii.ng.time'          , []);

angular.module('gooii.ng', [
    'gooii.ng.arrays',
    'gooii.ng.objects',
    'gooii.ng.strings',
    'gooii.ng.url',
    'gooii.ng.persistence',
    'gooii.ng.logging',
    'gooii.ng.time'
]);

require('./arrays/first-filter.coffee')(ngArrays)
require('./arrays/join-filter.coffee')(ngArrays)
require('./logging/logger-service.coffee')(ngLogging)
require('./objects/sort-by-filter.coffee')(ngObjects)
require('./persistence/cookie-store-service.coffee')(ngPersistence)
require('./strings/capitalise-filter.coffee')(ngStrings)
require('./time/timeout-service.coffee')(ngTime)
require('./url/encode-query-params-filter.coffee')(ngUrl)
