/**
 * itarget底下邀请单位或个人
 */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Input, Tooltip } from 'antd';
import { AiOutlineSearch } from 'react-icons/ai';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import cls from './index.module.less';

interface indexType<T> {
  placeholder?: string;
  columns: ProColumns<T>[];
  onFinish: (data: T[]) => void;
  datasource: any[];
}
const AssignModal: <T extends unknown>(props: indexType<T>) => React.ReactElement = (
  props,
) => {
  const [keyword, setKeyword] = useState('');
  const { datasource, onFinish, columns, placeholder } = props;

  return (
    <div className={cls.tableBox}>
      <div>
        <Input
          className={cls['search-person-input']}
          placeholder={placeholder || '请输入搜索内容'}
          suffix={
            <Tooltip>
              <AiOutlineSearch />
            </Tooltip>
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className={cls.tableContent}>
        <ProTable
          dataSource={datasource}
          cardProps={{ bodyStyle: { padding: 0 } }}
          scroll={{ y: 300 }}
          options={false}
          search={false}
          columns={columns as any}
          rowKey={'id'}
          pagination={{
            defaultCurrent: 0,
            defaultPageSize: 10,
          }}
          params={{ filter: keyword }}
          rowSelection={{
            onSelect: (_record: any, _selected: any, selectedRows: any) => {
              onFinish(selectedRows);
            },
          }}
        />
      </div>
    </div>
  );
};

export default AssignModal;
