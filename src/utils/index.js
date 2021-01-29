const fs = require("fs");
const path = require("path");


const winPath = (path) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
}
/**
 * 获取dumi文档 和 处理地址信息
 * @param {*} autoTipsCounts  //文件使用组件次数和路径集合
 * @param {*} autoTipsComponents //组件信息集合
 * @param {*} routes //当前路由
 */
const loaderDumi = (autoTipsCounts, autoTipsComponents, routes) => {
  const dumiRoutes = routes.find(item => item.__dumiRoot).routes;

  for (let index in autoTipsCounts) {

    //遍历路由获取组件对应dumi文档准确地址
    const DumiRoute = dumiRoutes.find((route) => {
      return route.meta.componentName === index;
    })
    autoTipsCounts[index].dumiDocPath = null;
    if (DumiRoute) {
      autoTipsCounts[index].dumiDocPath = DumiRoute.path;
    }

    //遍历路由获取组件对应url路由和页面路径
    autoTipsCounts[index].paths.forEach((item) => {
      const pages = item.path.match(/\/pages\/.*/g);
      item.pagePath = pages[0] || null;
      item.pageRoute = null;
      item.pageRouteName = null;
      if (item.pagePath) {
        const pagePathRoute = routes.find((route) => {
          return route.component && route.component.indexOf(item.pagePath) !== -1;
        })
        if (pagePathRoute) {
          item.pageRoute = pagePathRoute.path;
          item.pageRouteName = pagePathRoute.name || null;
        }
      }
     
    })
    if(autoTipsComponents[autoTipsCounts[index].componentName]){
      autoTipsCounts[index] = {
        ...autoTipsCounts[index],
        ...autoTipsComponents[autoTipsCounts[index].componentName]
      }
    }
  };
}

/**
 * 读取所有src下面文件、统计组件次数路径、读取组件信息
 * @param {*} filePath 
 * @param {*} autoTipsCounts  //文件使用组件次数和路径集合
 * @param {*} autoTipsComponents //组件信息集合
 */
const componentsCount = (filePath, autoTipsCounts, autoTipsComponents) => {
  //排除.umi文件夹
  if (filePath.indexOf('/.umi/') !== -1) {
    return;
  }
  //读取文件夹
  const files = fs.readdirSync(filePath);
  if (!files) {
    console.warn('no page');
    return;
  }
  files.forEach((filename) => {
    // path.join得到当前文件的绝对路径
    const filepath = path.join(filePath, filename);
    // 根据文件路径获取文件信息
    const stats = fs.statSync(filepath);
    if (!stats) {
      console.warn('获取文件stats失败');
      return;
    }
    const isFile = stats.isFile(); // 是否为文件
    const isDir = stats.isDirectory(); // 是否为文件夹
    //如果是文件 并且 是tsx后缀名
    if (isFile && (/.*(\.tsx)$/g).test(filepath)) {
      //如果文件是组件、保存组件信息
      if ((/([a-zA-z0-9]|\s)*Custom\/.*(\.tsx)$/g).test(filepath)) {
        const arr = filepath.split('/');
        const name = arr[arr.length - 2];
        if (!autoTipsComponents[name]) {
          autoTipsComponents[name] = {
            componentName: name,
            path: filepath,
            fileStats: {
              size: (stats.size / 1024).toFixed(2),
              mtimeMs: stats.mtimeMs
            }
          }
        }
      }
      //匹配文件里面出现的组件的次数和路径
      const source = fs.readFileSync(filepath, 'utf-8');
      const countArr = source.match(/<([a-zA-z0-9]|\s)*Custom/g);
      if (countArr) {
        countArr.forEach((item) => {
          item = item.replace('<', '');
          if (autoTipsCounts[item]) {
            autoTipsCounts[item].count = autoTipsCounts[item].count + 1;
            autoTipsCounts[item].paths.push({
              path: winPath(filepath)
            });
          } else {
            autoTipsCounts[item] = {
              count: 1,
              componentName: item,
              paths: [{
                path: winPath(filepath)
              }]
            };
          }
        })
      }
    }
    if (isDir) {
      componentsCount(filepath, autoTipsCounts,autoTipsComponents); // 递归，如果是文件夹，就继续遍历该文件夹里面的文件；
    }
  });
}
module.exports = {
  componentsCount,
  loaderDumi
}