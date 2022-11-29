import React, { useState, useEffect } from 'react';
import { schema } from '../../ts/base';
import SearchInput from '../../../src/components/SearchInput';
import styles from './index.module.less';
import { Avatar, Col, Result, Row } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { UserOutlined } from '@ant-design/icons';
import CohortController from '../../ts/controller/cohort/index';
import Person from '../../ts/core/target/person';
import CohortCard from './SearchCohortCard';
type CohortSearchTableProps = {
  [key: string]: any;
  setJoinKey?: (key: string) => void;
  setCohort: Function;
  person: Person;
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
        <div style={{ display: 'inline-block', paddingTop: '20px', paddingLeft: '13px' }}>
          <Row>
            <CohortCard
              className="card"
              data={item}
              key={item.id}
              defaultKey={{
                name: 'caption',
                size: 'price',
                type: 'sellAuth',
                desc: 'remark',
                creatTime: 'createTime',
              }}
              onClick={() => console.log('按钮测试')}
            />
          </Row>
        </div>
      );
    });
  };

  // 查询数据
  const getList = async (searchKey?: string) => {
    const res = CohortController.searchCohort(props.person, searchKey ? searchKey : '');
    console.log((await res).data.result);
    setDataSource((await res).data.result || []);
    console.log('输出值', dataSource);
  };

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder="请输入群组编码"
        // extra={`找到${dataSource?.length}家单位`}
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
        <Result icon={<MonitorOutlined />} title={`抱歉，没有查询到该编码相关的单位`} />
      )}
    </div>
  );
};
export default CohortSearchList;
