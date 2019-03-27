### 注意点
1.函数输入都是字符串。所以，需要使用自己的方法进行[字符串]->[对象]的转换
2.由于采用了commonJs的导入导出方式，所以需要
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = xxxx;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
module.exports = exports.default;
module.exports.default = exports.default;
这种写法。
对于(0, xxxx.default)(input);
使用逗号运算符的返回值，设置对应的函数的this指向。
3.
4.


结合正则表达式进行翻译
```js
// blacklist.js
/**
 *  将对应的chars比如 hello  转化为  /[hello]/g，替换全部的黑名单的单词为''空
 */
function blacklist(str, chars) {
  (0, _assertString.default)(str);
  return str.replace(new RegExp("[".concat(chars, "]+"), 'g'), '');
}
```
```js
// isAscii.js
// 直接使用16进制的编码范围 0-127为ascii编码范围
/* eslint-disable no-control-regex */
var ascii = /^[\x00-\x7F]+$/;
/* eslint-enable no-control-regex */

function isAscii(str) {
  (0, _assertString.default)(str);
  return ascii.test(str);
}
```
```js
// isBase64.js
// 使用的字符包括大小写拉丁字母各26个、数字10个、加号+和斜杠/，共64个字符，等号=用来作为后缀用途。编码后的数据比原始数据略长，为原来的 {\displaystyle {\frac {4}{3}}} {\frac {4}{3}}
// 转换的时候，将3字节的数据，先后放入一个24位的缓冲区中，先来的字节占高位。数据不足3字节的话，于缓冲器中剩下的比特用0补足。每次取出6比特（因为 {\displaystyle 2^{6}=64} {\displaystyle 2^{6}=64}），按照其值选择ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/中的字符作为编码后的输出，直到全部输入数据转换完成。
// 若原数据长度不是3的倍数时且剩下1个输入数据，则在编码结果后加2个=；若剩下2个输入数据，则在编码结果后加1个=。
var notBase64 = /[^A-Z0-9+\/=]/i;// 不是base64允许的字符

function isBase64(str) {
  (0, _assertString.default)(str);
  var len = str.length;

  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  var firstPaddingChar = str.indexOf('=');
  // 若原数据长度不是3的倍数时且剩下1个输入数据，则在编码结果后加2个=；若剩下2个输入数据，则在编码结果后加1个=。
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}
```
```js
// isCreditCard.js

/* eslint-disable max-len */
// (?:exp)仅匹配，不占用组号
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14})$/;

/* eslint-enable max-len */
```

```js
// isCurrecy.js

var default_currency_options = {
  symbol: '$',
  require_symbol: false,
  allow_space_after_symbol: false,
  symbol_after_digits: false,
  allow_negatives: true,
  parens_for_negatives: false,
  negative_sign_before_digits: false,
  negative_sign_after_digits: false,
  allow_negative_sign_placeholder: false,
  thousands_separator: ',',
  decimal_separator: '.',
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2],
  allow_space_after_digits: false
};

// 为什么会有   "\\d{" 这种语句，因为 这个代表了 \d{3}之类的长度限制参数，通过new RegExp时，该字符串不能使用\d，必须为\\d
function currencyRegex(options) {
  // 限制小数点后的位数为digits_after_decimal 一个数组，可以为数组里面任意的数组
  // 比如[1,2,3]那么使用 "|\\d{" 中的 | 条件表示 后面可以为1,2,3位小数
  // 生成的表达式为 "\\d{1}|\\d{2}|\\{d{3}"
  var decimal_digits = "\\d{".concat(options.digits_after_decimal[0], "}");
  options.digits_after_decimal.forEach(function (digit, index) {
    if (index !== 0) decimal_digits = "".concat(decimal_digits, "|\\d{").concat(digit, "}");
  });
  // symbol 符号是否是需要的：通过?决定 生成表达式为(\\$)? 
  var symbol = "(\\".concat(options.symbol.replace(/\./g, '\\.'), ")").concat(options.require_symbol ? '' : '?'),
      negative = '-?',
      whole_dollar_amount_without_sep = '[1-9]\\d*',
      // 是否有千位分隔符  [1-9]\\d{0,2}(\\,\\d{3})* 只能以1-9开头,然后数量为1，2,3（d{0,2}重复0到2次的数字）
      whole_dollar_amount_with_sep = "[1-9]\\d{0,2}(\\".concat(options.thousands_separator, "\\d{3})*"),
      valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep],
      // (0|[1-9]\\d{0,2}(\\,\\d{3})*|[1-9]\\d*)?
      whole_dollar_amount = "(".concat(valid_whole_dollar_amounts.join('|'), ")?"),
      // (\\.(\\d{1}|\\d{2}|\\{d{3}))? 这里是小数点后的判断
      decimal_amount = "(\\".concat(options.decimal_separator, "(").concat(decimal_digits, "))").concat(options.require_decimal ? '' : '?');
  var pattern = whole_dollar_amount + (options.allow_decimal || options.require_decimal ? decimal_amount : ''); // default is negative sign before symbol, but there are two other options (besides parens)

  // pattern为  (0|[1-9]\\d{0,2}(\\,\\d{3})*|[1-9]\\d*)?(\\.(\\d{1}|\\d{2}|\\{d{3}))?

  // 这里加上正负判断
  if (options.allow_negatives && !options.parens_for_negatives) {
    if (options.negative_sign_after_digits) {
      pattern += negative;
    } else if (options.negative_sign_before_digits) {
      pattern = negative + pattern;
    }
  } // South African Rand, for example, uses R 123 (space) and R-123 (no space)


  if (options.allow_negative_sign_placeholder) {
    // (?!exp)	匹配后面跟的不是exp的位置
    pattern = "( (?!\\-))?".concat(pattern);
  } else if (options.allow_space_after_symbol) {
    pattern = " ?".concat(pattern);
  } else if (options.allow_space_after_digits) {
    pattern += '( (?!$))?';
  }

  if (options.symbol_after_digits) {
    pattern += symbol;
  } else {
    pattern = symbol + pattern;
  }

  if (options.allow_negatives) {
    if (options.parens_for_negatives) {
      pattern = "(\\(".concat(pattern, "\\)|").concat(pattern, ")");
    } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
      pattern = negative + pattern;
    }
  } // ensure there's a dollar and/or decimal amount, and that
  // it doesn't start with a space or a negative sign followed by a space

  // 不是  以  （后面不是符号 ）或者 （后面是.*\\d）一个或者多个数字
  return new RegExp("^(?!-? )(?=.*\\d)".concat(pattern, "$"));
}
```

```js
// isDataURI
// 即前缀为 data: 协议的的URL，其允许内容创建者向文档中嵌入小文件。
// 由四个部分组成：前缀(data:)、指示数据类型的MIME类型、如果非文本则为可选的base64标记、数据本身：

// data:[<mediatype>][;base64],<data>
// mediatype 是个 MIME 类型的字符串，例如 "image/jpeg" 表示 JPEG 图像文件。如果被省略，则默认值为 text/plain;charset=US-ASCII

// 如果数据是文本类型，你可以直接将文本嵌入 (根据文档类型，使用合适的实体字符或转义字符)。如果是二进制数据，你可以将数据进行base64编码之后再进行嵌入。

var validMediaType = /^[a-z]+\/[a-z0-9\-\+]+$/i;
var validAttribute = /^[a-z\-]+=[a-z0-9\-]+$/i;
var validData = /^[a-z0-9!\$&'\(\)\*\+,;=\-\._~:@\/\?%\s]*$/i;

function isDataURI(str) {
  (0, _assertString.default)(str);
  var data = str.split(',');

  if (data.length < 2) {
    return false;
  }

  var attributes = data.shift().trim().split(';');
  var schemeAndMediaType = attributes.shift();

  if (schemeAndMediaType.substr(0, 5) !== 'data:') {
    return false;
  }

  var mediaType = schemeAndMediaType.substr(5);
  // 如果有mediaType，需要判断是否符合格式
  if (mediaType !== '' && !validMediaType.test(mediaType)) {
    return false;
  }
  // 因为前面已经提取schemeMediaType，已经保证全部的attributes正确存在
  for (var i = 0; i < attributes.length; i++) {
    if (i === attributes.length - 1 && attributes[i].toLowerCase() === 'base64') {// ok
    } else if (!validAttribute.test(attributes[i])) {
      return false;
    }
  }
  // data是以,分割的字符串，但是不影响正则表达式的判断，有可能是base64编码，也可能是普通的字符串
  for (var _i = 0; _i < data.length; _i++) {
    if (!validData.test(data[_i])) {
      return false;
    }
  }

  return true;
}

```

```js
// isDecimal.js
function decimalRegExp(options) {
  // 以正负符号开头的 对应的locale的金额符号 对应的小数位
  // /^[-+]?([0-9]+)?(\$[0-9]{1,})?$
  var regExp = new RegExp("^[-+]?([0-9]+)?(\\".concat(_alpha.decimal[options.locale], "[0-9]{").concat(options.decimal_digits, "})").concat(options.force_decimal ? '' : '?', "$"));
  return regExp;
}

var default_decimal_options = {
  force_decimal: false,
  decimal_digits: '1,',
  locale: 'en-US'
};
var blacklist = ['', '-', '+'];

function isDecimal(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_decimal_options);

  if (options.locale in _alpha.decimal) {
    // 不包含blacklist，并且通过正则验证
    return !(0, _includes.default)(blacklist, str.replace(/ /g, '')) && decimalRegExp(options).test(str);
  }

  throw new Error("Invalid locale '".concat(options.locale, "'"));
}
```

```js
// isEmail.js
// 电子邮件地址的域内部分可以使用以下任何ASCII字符：
// 大小写拉丁字母A到Z和a到z；
// 数字0到9；
// 除了字母与数字之外的可打印字符，!#$%&'*+-/=?^_`{|}~；
// 点.，但不能作为首尾字符，也不能连续出现，若放在引号中则不受这些限制（例如John..Doe@example.com是不允许的，而"John..Doe"@example.com是允许的）。[6]
// 注意，某些邮件服务器对域内部分使用通配符，比较典型的是跟在加号后面的字符，少数情况是跟在减号后面的字符，因此fred+bah@domain和fred+foo@domain有可能指向同一个收件箱，fred+@domain可能也是一样，甚至fred@domain也可能一样。这可以用于标记电子邮件以达到分类的目的，见下文，及用于垃圾邮件控制。括号{和}也被用于这种方式，虽然较少。
// 空格和特殊字符"(),:;<>@[\]被允许有限制地使用（域内部分字符串必须放在引号中，后面的段落将会描述，并且，反斜杠或双引号之前，必须加一个反斜杠来转义）；
// 允许将注释放在小括号内，并放在域内部分的开头或结尾，例如john.smith(comment)@example.com和(comment)john.smith@example.com都等同于john.smith@example.com。
// 除上述ASCII字符之外，RFC 6531 还允许以UTF-8编码的U+007F以上的国际字符，但即使是支持SMTPUTF8和8BITMIME的邮件系统，在分配域内部分时也可能会限制使用的字符。

var default_email_options = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true
};
/* eslint-disable max-len */

/* eslint-disable no-control-regex */
// 一个正确的字符 加上 （零个或者多个有空格的正确字符）<(一个或多个任意字符)>
var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var gmailUserPart = /^[a-z\d]+$/;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
/* eslint-enable max-len */

/* eslint-enable no-control-regex */

function isEmail(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(displayName);

    if (display_email) {
      str = display_email[1];
    } else if (options.require_display_name) {
      return false;
    }
  }

  var parts = str.split('@');
  var domain = parts.pop();// 最后的@的后面为domain域名
  var user = parts.join('@'); // 用户名不会包含@字符串，这里回到原来的字符串
  var lower_domain = domain.toLowerCase();

  if (options.domain_specific_validation && (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')) {
    /*
      Previously we removed dots for gmail addresses before validating.
      This was removed because it allows `multiple..dots@gmail.com`
      to be reported as valid, but it is not.
      Gmail only normalizes single dots, removing them from here is pointless,
      should be done in normalizeEmail
    */
   // 点.，但不能作为首尾字符，也不能连续出现，若放在引号中则不受这些限制（例如John..Doe@example.com是不允许的，而"John..Doe"@example.com是允许的）。[6]
    user = user.toLowerCase(); // Removing sub-address from username before gmail validation

    var username = user.split('+')[0]; // Dots are not included in gmail length restriction

    if (!(0, _isByteLength.default)(username.replace('.', ''), {
      min: 6,
      max: 30
    })) {
      return false;
    }

    var _user_parts = username.split('.');

    for (var i = 0; i < _user_parts.length; i++) {
      if (!gmailUserPart.test(_user_parts[i])) {
        return false;
      }
    }
  }

  if (!(0, _isByteLength.default)(user, {
    max: 64
  }) || !(0, _isByteLength.default)(domain, {
    max: 254
  })) {
    return false;
  }
// 电子邮件地址的域名部分必须符合严格的规则：它必须满足对主机名的要求，一个以点分隔的DNS标签序列，每个标签被限定为长度不超过63个字符，且只能由下列字符组成：[6]:§2
// 大小写拉丁字母A到Z和a到z；
// 数字0到9，但顶级域名不能是纯数字；
// 连字符-，但不能作为首尾字符。
  if (!(0, _isFQDN.default)(domain, {
    require_tld: options.require_tld
  })) {
    if (!options.allow_ip_domain) {
      return false;
    }

    if (!(0, _isIP.default)(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false;
      }

      var noBracketdomain = domain.substr(1, domain.length - 2);

      if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) {
        return false;
      }
    }
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
  var user_parts = user.split('.');

  for (var _i = 0; _i < user_parts.length; _i++) {
    if (!pattern.test(user_parts[_i])) {
      return false;
    }
  }

  return true;
}
```

```js
// isFQDN
// 完整域名由主机名称与母域名两部分所组成，例如有一部服务器的本地主机名为myhost，而其母域名为example.com，那指向该服务器的完整域名就是myhost.example.com。虽然世界上可能有很多服务器的本地主机名是myhost，但myhost.example.com是唯一的，因此完整域名能识别该特定服务器。

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false
};

function isFQDN(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_fqdn_options);
  /* Remove the optional trailing dot before checking validity */

  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }

  var parts = str.split('.');

  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length > 63) {
      return false;
    }
  }

  if (options.require_tld) {
    var tld = parts.pop();
    // 检查顶级域 一般为.com 可以参考 https://zh.wikipedia.org/wiki/%E9%A0%82%E7%B4%9A%E5%9F%9F  https://www.iana.org/domains/root/db 
    // 以xn开头的只有 普通的域名，别的允许utf8字符，比如中文字符
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    } // disallow spaces


    if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
      return false;
    }
  }

  for (var part, _i = 0; _i < parts.length; _i++) {
    part = parts[_i];

    if (options.allow_underscores) {
      part = part.replace(/_/g, '');
    }

    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    } // disallow full-width chars


    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }
    // 不允许以-开头结尾
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }

  return true;
}
```

```js
// isHash.js

// **isHash(str, algorithm)**              | check if the string is a hash of type algorithm.<br/><br/>Algorithm is one of `['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128', 'tiger160', 'tiger192', 'crc32', 'crc32b']`
var lengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8
};

function isHash(str, algorithm) {
  (0, _assertString.default)(str);
  // /^[a-f0-9]{32}$/
  // 只要长度和里面的字符符合格式即可
  var hash = new RegExp("^[a-f0-9]{".concat(lengths[algorithm], "}$"));
  return hash.test(str);
}
```

```js
// isHexadecimal.js
// isHexColor.js
var hexadecimal = /^[0-9A-F]+$/i;

function isHexadecimal(str) {
  (0, _assertString.default)(str);
  return hexadecimal.test(str);
}
// 必须是#开头的16进制数字长度为3或者6
var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

function isHexColor(str) {
  (0, _assertString.default)(str);
  return hexcolor.test(str);
}

```

```js
// isISBN
// 仅匹配，不占用组号 9位数字加X 或者10位数字
var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
// 仅匹配，不占用组号，13位数字
var isbn13Maybe = /^(?:[0-9]{13})$/;

```

```js
// isJWT.js JSON Web Token
// [A-Za-z0-9\-_~+\/] 符合条件的字符
// ([A-Za-z0-9\-_~+\/]+[=]{0,2}) 解析：（一个或者多个（符合条件字符） 0个到2个（=） 为一个组）
// 以 （.)为分割
// 最后的是仅匹配（零个或者一个）
// The three parts are encoded separately using Base64url Encoding, and concatenated using periods to produce the JWT:

// const token = base64urlEncoding(header) + '.' + base64urlEncoding(payload) + '.' + base64urlEncoding(signature)
// The above data and the secret of "secretkey" creates the token:

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI
// This resulting token can be easily passed into HTML and HTTP.[3]


var jwt = /^([A-Za-z0-9\-_~+\/]+[=]{0,2})\.([A-Za-z0-9\-_~+\/]+[=]{0,2})(?:\.([A-Za-z0-9\-_~+\/]+[=]{0,2}))?$/;

function isJWT(str) {
  (0, _assertString.default)(str);
  return jwt.test(str);
}
```

```js
// isLatLong.js
// 左括号开头，0或者1个-+， （90.xxx不限小数）或者（0或者1个 1-8 一个数字， 0或者1个 .数字） 结尾
var lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
// 0或者1个空格开头 0或者1个-+ （180.xxx不限小数) 或者 100.xxx-179.xxx开头的不限小数的数字 或者 一位两位数字.xxxx不限小数
var long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;

function _default(str) {
  (0, _assertString.default)(str);
  if (!str.includes(',')) return false;
  var pair = str.split(',');
  return lat.test(pair[0]) && long.test(pair[1]);
}

```

```js
// isMAXAddress.js

var macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
var macAddressNoColons = /^([0-9a-fA-F]){12}$/;

function isMACAddress(str, options) {
  (0, _assertString.default)(str);

  if (options && options.no_colons) {
    return macAddressNoColons.test(str);
  }

  return macAddress.test(str);
}
```

```js
// isMagnetURI.js
// 必须是magnet:?xt=urn:开头的 （32-40位字符） &dn=一个以上任意字符&tr=一个以上任意字符结尾
var magnetURI = /^magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32,40}&dn=.+&tr=.+$/i;

function isMagnetURI(url) {
  (0, _assertString.default)(url);
  return magnetURI.test(url.trim());
}
```

```js
// isMimeType.js
// Match simple MIME types
// NB :
//   Subtype length must not exceed 100 characters.
//   This rule does not comply to the RFC specs (what is the max length ?).
// 比如说image/png.
var mimeTypeSimple = /^(application|audio|font|image|message|model|multipart|text|video)\/[a-zA-Z0-9\.\-\+]{1,100}$/i; // eslint-disable-line max-len
// Handle "charset" in "text/*"

var mimeTypeText = /^text\/[a-zA-Z0-9\.\-\+]{1,100};\s?charset=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?$/i; // eslint-disable-line max-len
// Handle "boundary" in "multipart/*"
// \s 可以有一个空格
var mimeTypeMultipart = /^multipart\/[a-zA-Z0-9\.\-\+]{1,100}(;\s?(boundary|charset)=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?){0,2}$/i; // eslint-disable-line max-len

function isMimeType(str) {
  (0, _assertString.default)(str);
  return mimeTypeSimple.test(str) || mimeTypeText.test(str) || mimeTypeMultipart.test(str);
}
```

```js
// isMobilePhone.js
/* eslint-disable max-len */
var phones = {
  // ((\+1|1)?( |-)?)? 表示   0或者1个 可能以+1或者1开头，有可能紧接着空格或者-
  'en-US': /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,

  //  ((\+|00)86)? 可能以+86 0086开头的
  // 1([358][0-9]|4[579]|66|7[0135678]|9[89])表示以下数字
  // 130-139 150-159 180-189 
  // 145 147 149 
  // 166
  // 170 171 173 175 176 177 178 
  // 198 199
  'zh-CN': /^((\+|00)86)?1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
  'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
};
```

```js

```


