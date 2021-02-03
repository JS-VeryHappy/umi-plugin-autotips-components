import { join } from 'path';
import { Service } from 'umi';
import { render, fireEvent, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

const fixtures = join(__dirname, './fixtures');

test('显示页面', async () => {
  const cwd = join(fixtures, 'normal');
  const reactNode = require(join(cwd, 'pages', 'index.tsx')).default();
  render(reactNode);
  expect(screen.queryByText('Hello Umi!')).not.toBeNull();
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
