const loaderUtils = require('loader-utils');
const { winPath } = require('../utils');

const insertStr = function(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start);
};

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);

  const path = this.resourcePath;

  const reg = /.*Custom\/.*(\.tsx)$/g;

  if (reg.test(winPath(path))) {
    source = insertStr(
      source,
      0,
      `import { AutoTipsComponents } from 'umi';\r\n`,
    );
    source = source.replace(/<>/, ` <><AutoTipsComponents>`);
    source = source.replace(/<\/>/, `</AutoTipsComponents></>`);
  }

  return source;
};
