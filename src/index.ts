// ref:
// - https://umijs.org/plugins/api
import { readFileSync, readdirSync, statSync } from 'fs';
import { IApi } from '@umijs/types';
import { join, resolve } from 'path';
import { componentsCount, loaderDumi } from './utils/index';
import { init as socketInit } from './socket';


export default function (api: IApi) {
  const { utils } = api;
  const { winPath } = utils;
  const port = 6000;
  //建立socket
  socketInit(port);

  //定义扩展接收的参数
  api.describe({
    key: 'autotipsComponents',
    config: {
      default: {
        enable: true,//默认开启扩展
      },
      schema(joi) {
        return joi.object();
      }
    }
  });

  //创建组件插入.umi文件内
  api.onGenerateFiles(() => {
    const tpl = readFileSync(join(winPath(__dirname), 'templates/AutoTipsComponents.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'autotips-components/AutoTipsComponents.tsx',
      content: tpl,
    });

    const css = readFileSync(join(winPath(__dirname), 'templates/index.less.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'autotips-components/index.less',
      content: css,
    });
  });

  //注入全局组件
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: '../autotips-components/AutoTipsComponents',
    }
  ]);

  //插入插件ui显示
  api.addEntryCode(async () => {
    //如果没有开启插件使用
    if (!api.config.autotipsComponents || !api.config.autotipsComponents.enable) {
      return '';
    }
    //每一次编译都会运行一下代码实时更新、如果考虑性能、可能放入扩展加载api里面重新编译更新
    let autoTipsCounts = {};
    let autoTipsComponents = {};
    //@ts-ignore
    await componentsCount(api.paths.absSrcPath, autoTipsCounts, autoTipsComponents)

    const hasDumi = api.hasPresets(['@umijs/preset-dumi']);
    if (hasDumi) {
      const routes = await api.getRoutes()
      await loaderDumi(autoTipsCounts, autoTipsComponents, routes);
    }

    api.writeTmpFile({
      path: 'autotips-components/data.json',
      content: JSON.stringify(autoTipsCounts),
    });

    return `
    (() => {
      try {
        require('${winPath(join(__dirname, './ui'))}').default({
            hasDumi:${hasDumi},
            socketPort:${port}
        });
      } catch (e) {
        console.warn('Umi UI render error:', e);
      }
    })();
  `
  });

  // @ts-ignore
  api.chainWebpack(config => {
    //如果开启插件使用
    if (api.config.autotipsComponents && api.config.autotipsComponents.enable) {
      config.module
        .rule('autotips-components-loader')
        .test(/(\.tsx)$/)
        .pre()
        .use('autotips-components-loader')
        .loader(resolve('./src/loader/autotips-components-loader'))
        .end();
    }

  });


}
