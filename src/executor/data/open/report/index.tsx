import React, { useEffect, useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import HotTableView from './components/hotTable';
import cls from './index.module.less';
import { IForm } from '@/ts/core';
import { kernel } from '@/ts/base';
import { Form, Button, Input, Pagination } from 'antd';

interface IProps {
  current: IForm;
  finished: () => void;
}

const ReportView: React.FC<IProps> = ({ current, finished }) => {
  const [dataInfo, setDataInfo] = useState<any>();
  const [info, setInfo] = useState<any>();

  useEffect(() => {
    getData()
  }, [current])

  const getData = async () => {
    let request: any = {
      filter: undefined,
      group: null,
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      take: 9999,
      userData:[]
    }
    const result = await kernel.loadThing<any>(current.belongId, request);
    if (result.success) {
      setDataInfo(result.data)
      setInfo(result.data?.data[0])
    } else {
      setDataInfo([]);
    }
  }

  const onChange = (page: number) => {
    setInfo(dataInfo?.data[page - 1])
  }

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title="报表"
      footer={[]}
      onCancel={finished}
    >
      <div className={cls['report-content-box']}>
        <div className={cls['report-search-box']}>
          <Form layout="inline">
            <Form.Item>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
        </div>
        {info ?
          <HotTableView info={info} current={current}></HotTableView>
          : ''}
        {dataInfo ?
          <div className={cls['report-pagination-box']}>
            <Pagination hideOnSinglePage={true} defaultCurrent={1} defaultPageSize={1} onChange={onChange} total={dataInfo.totalCount} />
          </div>
          : ''}
      </div>
    </FullScreenModal>
  );
};
export default ReportView;
