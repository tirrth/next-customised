"use strict";
var _loaderUtils = _interopRequireDefault(require("next/dist/compiled/loader-utils"));
var _path = _interopRequireDefault(require("path"));
var _schemaUtils3 = require("next/dist/compiled/schema-utils3");
var _isEqualLocals = _interopRequireDefault(require("./runtime/isEqualLocals"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const schema = {
    type: 'object',
    properties: {
        injectType: {
            description: 'Allows to setup how styles will be injected into DOM (https://github.com/webpack-contrib/style-loader#injecttype).',
            enum: [
                'styleTag',
                'singletonStyleTag',
                'lazyStyleTag',
                'lazySingletonStyleTag',
                'linkTag', 
            ]
        },
        attributes: {
            description: 'Adds custom attributes to tag (https://github.com/webpack-contrib/style-loader#attributes).',
            type: 'object'
        },
        insert: {
            description: 'Inserts `<style>`/`<link>` at the given position (https://github.com/webpack-contrib/style-loader#insert).',
            anyOf: [
                {
                    type: 'string'
                },
                {
                    instanceof: 'Function'
                }, 
            ]
        },
        base: {
            description: 'Sets module ID base for DLLPlugin (https://github.com/webpack-contrib/style-loader#base).',
            type: 'number'
        },
        esModule: {
            description: 'Use the ES modules syntax (https://github.com/webpack-contrib/css-loader#esmodule).',
            type: 'boolean'
        }
    },
    additionalProperties: false
};
const loaderApi = ()=>{
};
loaderApi.pitch = function loader(request) {
    const options = _loaderUtils.default.getOptions(this);
    (0, _schemaUtils3).validate(schema, options, {
        name: 'Style Loader',
        baseDataPath: 'options'
    });
    const insert = typeof options.insert === 'undefined' ? '"head"' : typeof options.insert === 'string' ? JSON.stringify(options.insert) : options.insert.toString();
    const injectType = options.injectType || 'styleTag';
    const esModule = typeof options.esModule !== 'undefined' ? options.esModule : false;
    delete options.esModule;
    switch(injectType){
        case 'linkTag':
            {
                const hmrCode = this.hot ? `
if (module.hot) {
  module.hot.accept(
    ${_loaderUtils.default.stringifyRequest(this, `!!${request}`)},
    function() {
     ${esModule ? 'update(content);' : `content = require(${_loaderUtils.default.stringifyRequest(this, `!!${request}`)});

           content = content.__esModule ? content.default : content;

           update(content);`}
    }
  );

  module.hot.dispose(function() {
    update();
  });
}` : '';
                return `${esModule ? `import api from ${_loaderUtils.default.stringifyRequest(this, `!${_path.default.join(__dirname, 'runtime/injectStylesIntoLinkTag.js')}`)};
            import content from ${_loaderUtils.default.stringifyRequest(this, `!!${request}`)};` : `var api = require(${_loaderUtils.default.stringifyRequest(this, `!${_path.default.join(__dirname, 'runtime/injectStylesIntoLinkTag.js')}`)});
            var content = require(${_loaderUtils.default.stringifyRequest(this, `!!${request}`)});

            content = content.__esModule ? content.default : content;`}

var options = ${JSON.stringify(options)};

options.insert = ${insert};

var update = api(content, options);

${hmrCode}

${esModule ? 'export default {}' : ''}`;
            }
        case 'lazyStyleTag':
        case 'lazySingletonStyleTag':
            {
                const isSingleton = injectType === 'lazySingletonStyleTag';
                const hmrCode = this.hot ? `
if (module.hot) {
  if (!content.locals || module.hot.invalidate) {
    var isEqualLocals = ${_isEqualLocals.default.toString()};
    var oldLocals = content.locals;

    module.hot.accept(
      ${_loaderUtils.default.stringifyRequest(this, `!!${request}`)},
      function () {
        ${esModule ? `if (!isEqualLocals(oldLocals, content.locals)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = content.locals;

              if (update && refs > 0) {
                update(content);
              }` : `content = require(${_loaderUtils.default.stringifyRequest(this, `!!${request}`)});

              content = content.__esModule ? content.default : content;

              if (!isEqualLocals(oldLocals, content.locals)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = content.locals;

              if (update && refs > 0) {
                update(content);
              }`}
      }
    )
  }

  module.hot.dispose(function() {
    if (update) {
      update();
    }
  });
}` : '';
                return `${esModule ? `import api from ${_loaderUtils.default.stringifyRequest(this, `!${_path.default.join(__dirname, 'runtime/injectStylesIntoStyleTag.js')}`)};
            import content from ${_loaderUtils.default.stringifyRequest(this, `!!${request}`)};` : `var api = require(${_loaderUtils.default.stringifyRequest(this, `!${_path.default.join(__dirname, 'runtime/injectStylesIntoStyleTag.js')}`)});
            var content = require(${_loaderUtils.default.stringifyRequest(this, `!!${request}`)});

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }`}

var refs = 0;
var update;
var options = ${JSON.stringify(options)};

options.insert = ${insert};
options.singleton = ${isSingleton};

var exported = {};

exported.locals = content.locals || {};
exported.use = function() {
  if (!(refs++)) {
    update = api(content, options);
  }

  return exported;
};
exported.unuse = function() {
  if (refs > 0 && !--refs) {
    update();
    update = null;
  }
};

${hmrCode}

${esModule ? 'export default' : 'module.exports ='} exported;`;
            }
        case 'styleTag':
        case 'singletonStyleTag':
        default:
            {
                const isSingleton = injectType === 'singletonStyleTag';
                const hmrCode = this.hot ? `
if (module.hot) {
  if (!content.locals || module.hot.invalidate) {
    var isEqualLocals = ${_isEqualLocals.default.toString()};
    var oldLocals = content.locals;

    module.hot.accept(
      ${_loaderUtils.default.stringifyRequest(this, `!!${request}`)},
      function () {
        ${esModule ? `if (!isEqualLocals(oldLocals, content.locals)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = content.locals;

              update(content);` : `content = require(${_loaderUtils.default.stringifyRequest(this, `!!${request}`)});

              content = content.__esModule ? content.default : content;

              if (typeof content === 'string') {
                content = [[module.id, content, '']];
              }

              if (!isEqualLocals(oldLocals, content.locals)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = content.locals;

              update(content);`}
      }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}` : '';
                return `${esModule ? `import api from ${_loaderUtils.default.stringifyRequest(this, `!${_path.default.join(__dirname, 'runtime/injectStylesIntoStyleTag.js')}`)};
            import content from ${_loaderUtils.default.stringifyRequest(this, `!!${request}`)};` : `var api = require(${_loaderUtils.default.stringifyRequest(this, `!${_path.default.join(__dirname, 'runtime/injectStylesIntoStyleTag.js')}`)});
            var content = require(${_loaderUtils.default.stringifyRequest(this, `!!${request}`)});

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }`}

var options = ${JSON.stringify(options)};

options.insert = ${insert};
options.singleton = ${isSingleton};

var update = api(content, options);

${hmrCode}

${esModule ? 'export default' : 'module.exports ='} content.locals || {};`;
            }
    }
};
module.exports = loaderApi;

//# sourceMappingURL=index.js.map