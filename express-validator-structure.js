// 1.运行的原理
// 注入到express中间件中，给每一个中间件添加validator的所有可用函数。通过options参数传递参数，
// fields是使用path定义的字符串，可以用来取值。location是指定去哪个对象取值。
// 取得结果后，自行写入到validateErrors对象中，可以通过message注入错误提示，或者回调函数。
// 在进行操作之前，会先sanitizater一下，validator时再转为字符串验证，返回结果为 格式化后的结果。
// 2.如何使用validator
// 通过注入中间件，并调用中间件方法的形式使用
// 3.插入中间件的顺序
// 在check定义时，就是用赋值形式注入，按照field的定义顺序执行中间件。
// 4.如何格式化返回结果
// 在validator之后，获取错误信息，然后根据注入的message和loaction.field拼接一个错误数组
// 5.如何允许回调函数的检查形式
// 使用自定义custom函数，可以注入一个validator，在检查的时候，因为已经sanitizater，所以取到的值都是用户可以识别的。
// 如果返回错误的话，和普通的validator函数同样处理即可
// 6.如何指定location
// 可以直接写入到locations参数中，也可以通过构造函数指定Location,还可以通过schema的location参数指定。
// 在select-field时，通过req.xxx的location尝试获取。




// const { check, validationResult } = require('express-validator/check');

// app.post('/user', [
//   // username must be an email
//   check('username').isEmail(),
//   // password must be at least 5 chars long
//   check('password').isLength({ min: 5 })
// ], (req, res) => {
//   // Finds the validation errors in this request and wraps them in an object with handy functions
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

//   User.create({
//     username: req.body.username,
//     password: req.body.password
//   }).then(user => res.json(user));
// });

// check.js  
// 需要返回middleWare中间件，比如下面这种 中间件里面是(req,res,next) => {}
// [
//   // username must be an email
//   check('username').isEmail(),
//   // password must be at least 5 chars long
//   check('password').isLength({ min: 5 })
// ],
// 所以，所有的validator的方法通过Object.keys()注入到了middleware中，
// 但是这些同名的方法并不会立刻检验数据是否正确，只是push到了validators里面。将对应的参数加入进去
// 对应的方法传入的参数为...options，表示任意参数转为数组options.
// validators.push({
//   negated: middleware._context.negateNext,
//   validator: validationFn,
//   options
// });
// validators也存在与middleware._context里面，用于后续的取值使用
// sanitizers也是同理。
const validator = require('validator');

const runner = require('./runner');
const { isSanitizer, isValidator } = require('../utils/filters');

// module.exports = (fields, locations, message) => {
const check = (fields, locations, message) => {
  let optional;
  const validators = [];
  const sanitizers = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    return runner(req, middleware._context).then(errors => {
      req._validationContexts = (req._validationContexts || []).concat(middleware._context);
      req._validationErrors = (req._validationErrors || []).concat(errors);
      next();
    }, next);
  };

  Object.keys(validator)
    .filter(isValidator)
    .forEach(methodName => {
      const validationFn = validator[methodName];
      middleware[methodName] = (...options) => {
        validators.push({
          negated: middleware._context.negateNext,
          validator: validationFn,
          options
        });
        middleware._context.negateNext = false;
        return middleware;
      };
    });

  Object.keys(validator)
    .filter(isSanitizer)
    .forEach(methodName => {
      const sanitizerFn = validator[methodName];
      middleware[methodName] = (...options) => {
        sanitizers.push({
          sanitizer: sanitizerFn,
          options
        });
        return middleware;
      };
    });

  middleware.optional = (options = {}) => {
    optional = options;
    return middleware;
  };

  middleware.custom = validator => {
    validators.push({
      validator,
      custom: true,
      negated: middleware._context.negateNext,
      options: []
    });
    middleware._context.negateNext = false;
    return middleware;
  };

  middleware.customSanitizer = sanitizer => {
    sanitizers.push({
      sanitizer,
      custom: true,
      options: []
    });
    return middleware;
  };
// check('access_token').exists()
// 这里在对应的中间件上添加方法，比如exists,isArray,isString等
  middleware.exists = (options = {}) => {
    const validator = options.checkFalsy
      ? existsValidatorCheckFalsy
      : (options.checkNull ? existsValidatorCheckNull : existsValidator);

    return middleware.custom(validator);
  };

  middleware.isArray = () => middleware.custom(value => Array.isArray(value));
  middleware.isString = () => middleware.custom(value => typeof value === 'string');

  middleware.optionalityFilter = message => {
    const lastValidator = validators[validators.length - 1];
    if (lastValidator) {
      lastValidator.message = message;
    }

    return middleware;
  };

  middleware.not = () => {
    middleware._context.negateNext = true;
    return middleware;
  };

  middleware._context = {
    get optional() {
      return optional;
    },
    negateNext: false,
    message,
    fields,
    locations,
    sanitizers,
    validators
  };

  return middleware;
};

function existsValidator(value) {
  return value !== undefined;
}

function existsValidatorCheckNull(value) {
  return value != null;
}

function existsValidatorCheckFalsy(value) {
  return !!value;
}

// runner.js
// 这里是middleware里面的执行代码，是一个promise化的返回
// const middleware = (req, res, next) => {
//   return runner(req, middleware._context).then(errors => {
//     req._validationContexts = (req._validationContexts || []).concat(middleware._context);
//     req._validationErrors = (req._validationErrors || []).concat(errors);
//     next();
//   }, next);
// };
const toString = require('../utils/to-string');
const selectFields = require('../utils/select-fields');

// middleware._context = {
//   get optional() {
//     return optional;
//   },
//   negateNext: false,
//   message,
//   fields,
//   locations,
//   sanitizers,
//   validators
// };
// module.exports = (req, context) => {
const runner = (req, context) => {
  const validationErrors = [];
  const promises = selectFields(req, context).map(field => {
    // 将select-field中的每一个field的location, path, value, originalValue拿出来，
    // select-field其实做了格式化操作
    const { location, path, value } = field;
    // 现在开始验证数据是否正确.
    // 初始化数据为Promise.resolve(),然后开始reduce
    return context.validators.reduce((promise, validatorCfg) => promise.then(() => {
      // validatorCfg也就是当前的validator
      // validators.push({
      //   validator,
      //   custom: true,
      //   negated: middleware._context.negateNext,
      //   options: []
      // });
      // 如果custom为true，说明是自定义的函数，并不是validator.js这个库的函数，比如isArray,exisits
      const result = validatorCfg.custom ?
        validatorCfg.validator(value, { req, location, path }) :
        validatorCfg.validator(toString(value), ...validatorCfg.options);

      return getActualResult(result).then(result => {
        // 判断是否是必选的，如果必须并且没有结果，如果不是必须并且有结果 都reject
        if ((!validatorCfg.negated && !result) || (validatorCfg.negated && result)) {
          return Promise.reject();
        }
      });
    }).catch(err => {
      validationErrors.push({
        location,
        param: path,
        value: field.originalValue,
        msg: getDynamicMessage([
          validatorCfg.message,
          err && err.message,
          err,
          context.message,
          'Invalid value'
        ], field, req)
      });
    }), Promise.resolve());
  });

  return Promise.all(promises).then(() => validationErrors);
};

function getActualResult(result) {
  const promiseLike = result && !!result.then;
  // &&的运算符优先级高于?:
  // 如果result未定义并且是promiseLike的话，返回true,否则，返回结果即可，比如0,‘’等
  // return (result === undefined && promiseLike) ? true : result;
  return Promise.resolve(result).then(result => {
    return result === undefined && promiseLike ? true : result;
  });
}

function getDynamicMessage(messageSources, field, req) {
  const message = messageSources.find(message => !!message);
  if (typeof message !== 'function') {
    return message;
  }
  // 允许用户以回调函数的形式定义 error时的报错信息。比如
  return message(field.originalValue, {
    req,
    location: field.location,
    path: field.path
  });
}

// select-field.js 验证参数field的选择器
const _ = require('lodash');
const formatParamOutput = require('./format-param-output');
const persistValues = require('./persist-values');

module.exports = (req, context, options = {}) => {
  let allFields = [];
  const optionalityFilter = options.filterOptionals == null || options.filterOptionals
    ? createOptionalityFilter(context)
    : Boolean;
  const sanitizerMapper = createSanitizerMapper(req, context, options);
  // fields like ['body', '*', 'query']
  context.fields.map(field => field == null ? '' : field).forEach(field => {
    let instances = _(context.locations)
      .flatMap(createFieldExpander(req, field))
      .map(sanitizerMapper)
      .filter(optionalityFilter)
      .value();

    // #331 - When multiple locations are involved, all of them must pass the validation.
    // If none of the locations contain the field, we at least include one for error reporting.
    // #458, #531 - Wildcards are an exception though: they may yield 0..* instances with different
    // paths, so we may want to skip this filtering.
    if (instances.length > 1 && context.locations.length > 1 && !field.includes('*')) {
      const withValue = instances.filter(field => field.value !== undefined);
      instances = withValue.length ? withValue : [instances[0]];
    }

    allFields = allFields.concat(instances);
  });

  persistValues(req, allFields);
  return _.uniqWith(allFields, _.isEqual);
};
// 对传入的field进行解析，允许为a.b.*.d等各种形式的数据，只要符合path即可。
function createFieldExpander(req, field) {
  // 对location所在的req[location]进行field扩展，
  return location => {
    const fieldPath = location === 'headers' ? field.toLowerCase() : field;
    return expand(req[location], fieldPath, []).map(path => ({
      location,
      path: path,
      value: path === '' ? req[location] : _.get(req[location], path)
    })).map(field => Object.assign(field, {
      originalValue: field.value
    }));
  };
}
// path其实相当于field object相当于req.params, req.query, req.hedaders等
function expand(object, path, paths) {
  const segments = _.toPath(path); // 将一个字符串用数组进行表示
  const wildcard = segments.indexOf('*');

  if (wildcard > -1) {
    // 如果*出现的位置大于0 ，表示如 a.b.* => segements = ['a','b','*'] wilcard = 2
    // 先使用_.get方法获取*前面的object
    // 如果是× segments = [*] wildcard=0
    const subObject = wildcard ? _.get(object, segments.slice(0, wildcard)) : object;
    if (!subObject) {
      return paths;
    }
    // 取出全部的*的子属性 如：
    // a.b.c.d=> a.b.d.d之类的，重新扩展全部的path
    Object.keys(subObject)
      .map(key => segments
        .slice(0, wildcard)
        .concat(key)
        .concat(segments.slice(wildcard + 1)))
      .forEach(path => expand(object, path, paths));
  } else {
    // [a,b,c]
    paths.push(formatParamOutput(segments));
  }

  return paths;
}

function createSanitizerMapper(req, { sanitizers = [] }, { sanitize = true }) {
  // 通过middleware的sanitizers初始化一个格式化函数包装器
  // 只对字符串做调整，如果是对象之类的，不处理
  return !sanitize ? field => field : field => sanitizers.reduce((prev, sanitizer) => {
    const value = typeof prev.value === 'string' ?
      callSanitizer(sanitizer, prev) :
      prev.value;

    return Object.assign({}, prev, { value });
  }, field);

  function callSanitizer(config, field) {
    return !config.custom ?
      config.sanitizer(field.value, ...config.options) :
      config.sanitizer(field.value, {
        req,
        location: field.location,
        path: field.path
      });
  }
}

function createOptionalityFilter({ optional }) {
  // 这里是拿middleware._context.optional 去初始化一个filter
  const checks = [
    value => value !== undefined,
    value => optional.nullable ? value != null : true,
    value => optional.checkFalsy ? value : true
  ];

  return field => {
    if (!optional) {
      return true;
    }

    return checks.every(check => check(field.value));
  };
}


