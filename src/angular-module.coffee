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

