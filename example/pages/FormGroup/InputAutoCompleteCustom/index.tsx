import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { message } from 'antd';

interface InputAutoCompleteCustomType {
  /**
   * antd 按钮props 参数
   * 和antd 参数一样
   */
  fieldProps?: {} | undefined;
  /**
   * select选择数据
   * @default []
   */
  options?: [];
  /**
   * 默认值
   * 自定义必须要实现的
   */
  value?: any;
  /**
   * 切换触发方法
   * 自定义必须要实现的
   */
  onChange?: (value: any) => void;
  /**
   * 是否只读模式
   * 自定义必须要实现的
   * @default false
   */
  readonly?: boolean;
}

function InputAutoCompleteCustom(Props: InputAutoCompleteCustomType) {
  const [inputValue, setInputValue] = useState<any>(null);

  const { fieldProps, readonly, onChange, value, options } = Props;

  useEffect(() => {
    /**
     * 如果父级传有默认值则赋值默认值
     */
    setInputValue(value);
  }, []);

  /**
   * input切换值变换。如果父级传入监听方法调用
   * @param value
   */
  const onInputChange = (value: any) => {
    setInputValue(value);
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    } else {
      message.info('Input切换值' + value);
    }
  };

  /**
   * 如果直接使用下Input的默认值 文档说明看起好看一点
   */
  let defaultFieldProps = fieldProps
    ? {}
    : {
        style: {
          width: '300px',
        },
        placeholder: '请输入',
        allowClear: true,
      };

  let selectOptions = fieldProps
    ? options || []
    : [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
      ];

  return (
    <>
      {readonly ? (
        value
      ) : (
        <AutoComplete
          value={inputValue}
          {...defaultFieldProps}
          {...fieldProps}
          options={selectOptions}
          // onSelect={onSelect}
          // onSearch={onSearch}
          onChange={onInputChange}
        />
      )}
    </>
  );
}

export default InputAutoCompleteCustom;
