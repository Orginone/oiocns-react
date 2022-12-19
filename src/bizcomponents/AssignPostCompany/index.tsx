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
import { schema } from '@/ts/base';
import { ITarget, TargetType } from '@/ts/core';
import userCtrl from '@/ts/controller/setting/userCtrl';
// import userCtrl from '@/ts/controller/setting/userCtrl';

interface indexType {
  searchFn: Function;
  // 邀请的数据来源 集团或者单位
  source: ITarget;
  columns: ProColumns<schema.XTarget>[];
}

const MemberList: React.FC<indexType> = (props) => {
  const { searchFn, source } = props;
  useEffect(() => {
    getTableList(1, 10);
  }, []);

  const [data, setData] = useState<schema.XTarget[]>([]);
  const [value, setValue] = useState<string>();
  const [page, setPage] = useState<number>(1);

  const getTableList = async (page: number, pageSize: number) => {
    const data = await source.loadMembers(resetParams({ page, pageSize }));
    if (data.total > 0 && data.result) {
      setData(data.result);
    } else {
      setData([]);
    }
  };

  const keyWordChange = async (e: any) => {
    setValue(e.target.value);
    if (e.target.value) {
      let res: schema.XTargetArray;
      // 判断是公司还是集团。
      if (source.target.typeName == TargetType.Group) {
        res = await userCtrl.user.searchCompany(e.target.value);
        if (res?.total > 0 && res.result) {
          setData([res.result[0]]);
        } else {
          getTableList(page, 10);
        }
      } else if (source.target.typeName == TargetType.Department) {
        res = await userCtrl.user.searchPerson(e.target.value);
        if (res?.total > 0 && res.result) {
          setData([res.result[0]]);
        } else {
          getTableList(page, 10);
        }
      }
    }
  };

  return (
    <div className={cls.tableBox}>
      <div>
        <Input
          className={cls['search-person-input']}
          placeholder="请输入用户账号"
          suffix={
            <Tooltip title="搜索用户">
              <SearchOutlined />
            </Tooltip>
          }
          value={value}
          onChange={keyWordChange}
        />
      </div>
      <div className={cls.tableContent}>
        <ProTable<schema.XTarget>
          dataSource={data}
          rowSelection={{
            onSelect: (record: any, selected: any, selectedRows: any) => {
              searchFn(selectedRows);
            },
          }}
          request={async (params) => {
            const { pageIndex, pageSize } = params;
            setPage(pageIndex);
            const res = await source.loadMembers(
              resetParams({ page: pageIndex, pageSize }),
            );
            if (res.result) {
              return { data: res.result, total: res.total, success: true };
            }
            return { data: [], total: 0, success: true };
          }}
          cardProps={{ bodyStyle: { padding: 0 } }}
          scroll={{ y: 300 }}
          options={false}
          search={false}
          columns={props.columns}
          rowKey={'id'}
        />
      </div>
    </div>
  );
};

export default MemberList;
