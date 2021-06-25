import { defineConfig } from 'umi';
import { join } from 'path';

export default defineConfig({
  resolve: {
    includes: ['pages'],
  },
  plugins: [require.resolve('../src')],
  autotipsComponents: {
    enable: true,
    exclude: ['/Test1Custom'],
  },
  layout: {
    locale: true,
  },
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     // 或者使用在线的版本
  //     // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
  //     schemaPath: join(__dirname, 'oneapi.json'),
  //     mock: false,
  //   },
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
  //     projectName: 'swagger',
  //   },
  // ],
});
