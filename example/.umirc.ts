import { defineConfig } from 'umi';

export default defineConfig({
  resolve: {
    includes: ['pages'],
  },
  plugins: [require.resolve('../lib')],
  autotipsComponents: {
    enable: true,
  },
});
