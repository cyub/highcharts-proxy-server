const toolkit = {};

(function (toolkit) {
    toolkit.addslashes = function (str) {
        return str.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
    };

    toolkit.parse = function(str) {
      return JSON.parse(str, function (k, v) {
        if (typeof v != 'string') return v;

        return (v.substring(0, 6) == '__fn__') ?
        eval('(' + v.replace(/^__fn__/, 'function') + ')') : v;

      });
    };

    toolkit.stringify = function(obj) {
        return JSON.stringify(obj, function (k, v) {

          return (typeof v === 'function') ?
          v.toString().replace(/^function/, '__fn__') : v;

        });
    };

})(toolkit);

module.exports = toolkit;