import React, { useState, useEffect } from 'react';
import { Cohort } from '../../module/org/index';
import SearchInput from '../../../src/components/SearchInput';
import styles from './index.module.less';
import { Avatar, Col, Result, Row } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { UserOutlined } from '@ant-design/icons';
import CohortController from '../../ts/controller/cohort/index'
import Person from '../../ts/core/target/person';
type CohortSearchTableProps = {
  [key: string]: any;
  setJoinKey?: (key: string) => void;
  setCohort: Function;
  person:Person
};

let tableProps: CohortSearchTableProps;

/* 
  弹出框表格查询
*/
const CohortSearchList: React.FC<CohortSearchTableProps> = (props) => {
  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<Cohort[]>([]);

  useEffect(() => {
    tableProps = props;
  }, []);

  // 单位卡片渲染
  const companyCardList = () => {
    console.log('开始渲染');
    return (
      <CheckCard.Group
        onChange={(value) => {
          props.setCohort(value);
          console.log('value', value);
        }}
        style={{ width: '100%', marginTop: '50px' }}
        size="large"
        defaultValue={['A']}>
        <Row gutter={16}>
          {dataSource.map((item) => (
            <Col span={12} key={item.id}>
              <CheckCard
                style={{ marginInlineEnd: 8, marginInlineStart: 55, width: '300px' }}
                title={item.name}
                avatar={
                  <Avatar
                    style={{ backgroundColor: '#7265e6' }}
                    icon={<UserOutlined />}
                    size="default"
                  />
                }
                value={item}
                description={item.team.remark}
              />
            </Col>
          ))}
        </Row>
      </CheckCard.Group>
    );
  };

  // 查询数据
  const getList = async (searchKey?: string) => {
    
    const res = CohortController.searchCohort(props.person,searchKey?searchKey:'')
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

      {dataSource.length > 0 && companyCardList()}
      {searchKey && dataSource.length == 0 && (
        <Result icon={<MonitorOutlined />} title={`抱歉，没有查询到该编码相关的单位`} />
      )}
    </div>
  );
};
export default CohortSearchList;
