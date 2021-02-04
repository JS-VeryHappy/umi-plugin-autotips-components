import { join } from 'path';
import { Service } from 'umi';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { readFileSync } from 'fs';

const fixtures = join(__dirname, './fixtures');

test('显示页面', async () => {
  const cwd = join(fixtures, 'normal');
  const reactNode = require(join(cwd, 'pages', 'index.tsx')).default();
  render(reactNode);
  expect(screen.queryByText('Hello autotips components!')).not.toBeNull();
});

test('生成临时文件', async () => {
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });
  // 用于产生临时文件
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });

  const data = require(join(
    cwd,
    '.umi-test',
    'autotips-components',
    'data.json',
  ));

  expect(data).toHaveProperty('InputAutoCompleteCustom');
});

test('测试生成html', async () => {
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'html'],
    },
  });
  const html = readFileSync(join(cwd, 'dist', 'index.html'), 'utf-8');
  expect(html).toMatch(/umi\.js/);
});
