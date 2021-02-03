import { winPath, componentsCount, loaderDocs } from './utils';
import { join, resolve } from 'path';

test('winPath', () => {
  expect(winPath('\\home\\path')).toEqual('/home/path');
});

test('loaderDocs', () => {
  let autoTipsCounts: [] = [];
  let autoTipsComponents: [] = [];
  componentsCount(
    join(__dirname, '/fixtures'),
    autoTipsCounts,
    autoTipsComponents,
  );
  loaderDocs(autoTipsCounts, autoTipsComponents, [
    {
      __dumiRoot: true,
      layout: false,
      path: '/~docs',
      routes: [
        {
          path: '/~docs/form-group/input-auto-complete-custom',
          exact: true,
          meta: {
            filePath: 'pages/FormGroup/InputAutoCompleteCustom/index.md',
            updatedTime: 1611906574000,
            componentName: 'InputAutoCompleteCustom',
            title: 'Input自动完成',
            nav: {
              title: '组件',
            },
            group: {
              title: '基础业务组件-FormGroup',
              path: '/~docs/form-group',
            },
            slugs: [
              {
                depth: 2,
                value: 'API',
                heading: 'api',
              },
            ],
          },
          title: 'Input自动完成',
        },
        {
          path: '/~docs/form-group/input-select-custom',
          exact: true,
          meta: {
            filePath: 'pages/FormGroup/InputSelectCustom/index.md',
            updatedTime: 1611906574000,
            componentName: 'InputSelectCustom',
            title: 'Input组合Select',
            nav: {
              title: '组件',
            },
            group: {
              title: '基础业务组件-FormGroup',
              path: '/~docs/form-group',
            },
            slugs: [
              {
                depth: 2,
                value: 'API',
                heading: 'api',
              },
            ],
          },
          title: 'Input组合Select',
        },
        {
          path: '/~docs/form-group/input-tooltip-custom',
          exact: true,
          meta: {
            filePath: 'pages/FormGroup/InputTooltipCustom/index.md',
            updatedTime: 1611906574000,
            componentName: 'InputTooltipCustom',
            title: 'Input组合Tooltip',
            nav: {
              title: '组件',
            },
            group: {
              title: '基础业务组件-FormGroup',
              path: '/~docs/form-group',
            },
            slugs: [
              {
                depth: 2,
                value: 'API',
                heading: 'api',
              },
            ],
          },
          title: 'Input组合Tooltip',
        },
        {
          path: '/~docs/form-group',
          meta: {},
          exact: true,
          redirect: '/~docs/form-group/input-auto-complete-custom',
        },
      ],
      title: 'dumi',
    },
    {
      path: '/FormGroup/InputAutoCompleteCustom',
      exact: true,
    },
    {
      path: '/FormGroup/InputSelectCustom',
      exact: true,
      component: '@/pages/FormGroup/InputSelectCustom/index.tsx',
    },
    {
      path: '/FormGroup/InputTooltipCustom',
      exact: true,
      component: '@/pages/FormGroup/InputTooltipCustom/index.tsx',
    },
    {
      path: '/',
      exact: true,
      component: '@/pages/index.tsx',
    },
  ]);
  setTimeout(() => {
    expect(autoTipsCounts).toContain('InputAutoCompleteCustom');
  }, 1000);
});

test('componentsCount', () => {
  let autoTipsCounts: [] = [];
  let autoTipsComponents: [] = [];
  componentsCount(
    join(__dirname, '/fixtures'),
    autoTipsCounts,
    autoTipsComponents,
  );
  setTimeout(() => {
    expect(autoTipsCounts).toContain('InputAutoCompleteCustom');
  }, 1000);
});
