/**
 * itarget底下邀请单位或个人
 */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import cls from './index.module.less';
import { resetParams } from '@/utils/tools';
import { common } from '@/ts/base';

interface indexType<T> {
  columns: ProColumns<T>[];
  placeholder: string;
  request: (page: any) => Promise<T[]>;
  onFinish: (data: T[]) => void;
}
const AssignModal: <T extends unknown>(props: indexType<T>) => React.ReactElement = (
  props,
) => {
  const { request, onFinish, columns, placeholder } = props;
  const [data, setData] = useState<any>([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setTimeout(async () => {
      let data = await request({
        offect: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: keyword,
      });
      setData(data);
    }, 100);
  }, [keyword]);

  return (
    <div className={cls.tableBox}>
      <div>
        <Input
          className={cls['search-person-input']}
          placeholder={placeholder}
          suffix={
            <Tooltip>
              <SearchOutlined />
            </Tooltip>
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className={cls.tableContent}>
        <ProTable
          dataSource={data}
          rowSelection={{
            onSelect: (_record: any, _selected: any, selectedRows: any) => {
              onFinish(selectedRows);
            },
          }}
          request={async (params) =>
            request(
              resetParams({
                page: params.pageIndex,
                pageSize: params.pageSize,
                filter: keyword,
              }),
            )
          }
          cardProps={{ bodyStyle: { padding: 0 } }}
          scroll={{ y: 300 }}
          options={false}
          search={false}
          columns={columns as any}
          rowKey={'id'}
        />
      </div>
    </div>
  );
};

export default AssignModal;
