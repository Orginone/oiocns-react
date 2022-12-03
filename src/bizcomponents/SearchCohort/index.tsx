import React, { useState, useEffect } from 'react';
import { schema } from '@/ts/base';
import SearchInput from '../../../src/components/SearchInput';
import styles from './index.module.less';
import { Result, Row } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';
import CohortCard from './SearchCohortCard';
import userCtrl from '@/ts/controller/setting/userCtrl';
type CohortSearchTableProps = {
  [key: string]: any;
  setJoinKey?: (key: string) => void;
  setCohort: Function;
};

let tableProps: CohortSearchTableProps;

/* 
  弹出框表格查询
*/
const CohortSearchList: React.FC<CohortSearchTableProps> = (props) => {
  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<schema.XTarget[]>([]);

  useEffect(() => {
    tableProps = props;
  }, []);
  const renderCardFun = (dataArr: schema.XTarget[]): React.ReactNode[] => {
    return dataArr.map((item: schema.XTarget) => {
      return (
        <div
          style={{ display: 'inline-block', paddingTop: '20px', paddingLeft: '13px' }}
          key={item.id}>
          <Row>
            <CohortCard className="card" data={item} key={item.id} />
          </Row>
        </div>
      );
    });
  };

  // 查询数据
  const getList = async (searchKey?: string) => {
    const res = await userCtrl.User?.searchCohort(searchKey || '');
    setDataSource(res?.data.result || []);
  };

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder="请输入群组编码"
        onChange={(event) => {
          setSearchKey(event.target.value);
          if (event.target.value) {
            getList(event.target.value);
          } else {
            setDataSource([]);
          }
        }}
      />
      <div>{dataSource != [] && renderCardFun(dataSource)}</div>
      {searchKey && dataSource.length == 0 && (
        <Result icon={<MonitorOutlined />} title={`抱歉，没有查询到该编码的内容`} />
      )}
    </div>
  );
};
export default CohortSearchList;
