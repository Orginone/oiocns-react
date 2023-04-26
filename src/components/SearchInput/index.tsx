import { AiOutlineSearch } from 'react-icons/ai';
import { Col, Input, Row } from 'antd';
import React from 'react';
import styles from './index.module.less';

type SearchInputProps = {
  extra?: string | React.ReactNode; // 组件右侧自定义
  value?: string; // 搜索框的值
  placeholder?: string; // 搜索框的值
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined; // 值发生改变的监听事件
};
/*  搜索弹出框
    头部搜索功能组件
*/
const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { extra, placeholder, onChange, value } = props;
  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={extra ? 16 : 24}>
        <div className={styles[`search-input`]}>
          <Input
            prefix={<AiOutlineSearch className={styles.icon} />}
            placeholder={placeholder || '请输入'}
            bordered={false}
            onChange={onChange}
            value={value}
          />
        </div>
      </Col>
      {extra && (
        <Col span={8} style={{ textAlign: 'right' }}>
          {extra}
        </Col>
      )}
    </Row>
  );
};

export default SearchInput;
