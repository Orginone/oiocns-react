/**
 * itarget底下邀请单位或个人
 */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Input, Tooltip } from 'antd';
import { AiOutlineSearch } from 'react-icons/ai';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import cls from './index.module.less';
import { PageRequest } from '@/ts/base/model';

interface indexType<T> {
  placeholder?: string;
  columns: ProColumns<T>[];
  onFinish: (data: T[]) => void;
  request: (params: PageRequest & { [key: string]: any }) => Promise<
    | {
        result: T[] | undefined;
        offset: number;
        limit: number;
        total: number;
      }
    | undefined
  >;
}
const AssignModal: <T extends unknown>(props: indexType<T>) => React.ReactElement = (
  props,
) => {
  const [keyword, setKeyword] = useState('');
  const { request, onFinish, columns, placeholder } = props;

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
          request={async (params) => {
            const {
              current: pageIndex = 1,
              pageSize = 10,
              filter = '',
              ...other
            } = params;
            const page: PageRequest = {
              filter: filter,
              limit: pageSize,
              offset: (pageIndex - 1) * pageSize,
            };
            const res = await request(other ? { ...other, ...page } : page);
            if (res) {
              return {
                total: res.total || 0,
                data: (res.result as []) || [],
                success: true,
              };
            }
            return { total: 0, data: [], success: true };
          }}
        />
      </div>
    </div>
  );
};

export default AssignModal;
