export const accountConfig: any[] = [
  {
    valueType: 'text',
    name: 'account',
    title: '账号',
    fieldProps: {
      placeholder: '请输入账号',
      maxLength: 20,
    },
    formItemProps: {
      rules: [{ required: true, message: '请输入账号' }],
    },
  },
  {
    valueType: 'Test3Custom',
    name: 'captcha',
    title: '验证码',
    width: 'auto',
    fieldProps: {
      phoneName: 'mobile',
      placeholder: '请输入验证码',
      name: 'captcha',
      maxLength: 6,
    },
    formItemProps: {
      rules: [{ required: true, message: '请输入验证码' }],
    },
  },
];
