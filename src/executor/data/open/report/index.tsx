import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import HotTableView from './components/hotTable';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import cls from './index.module.less';
import { IForm } from '@/ts/core';
import { kernel } from '@/ts/base';
import { Form, Button, Input, Pagination } from 'antd';
import * as config from './config';

interface IProps {
  current: IForm;
  finished: () => void;
}

const ReportView: React.FC<IProps> = ({ current, finished }) => {
  const [total, setTotal] = useState<number>(1);
  const [info, setInfo] = useState<any>();
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    () => config.loadSpeciesItemMenu(current),
  );
  if (!selectMenu || !rootMenu) return <></>;
  
  const getData = async (page: number) => {
    let request: any = {
      filter: undefined,
      group: null,
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: page,
      take: 1,
      userData:[]
    }
    const result = await kernel.loadThing<any>(current.belongId, request);
    if (result.success) {
      setTotal(result.data?.totalCount)
      setInfo(result.data?.data[0])
    }
  }

  const onChange = (page: number) => {
    getData(page)
  }

  const loadContent = () => {
    return (
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
        <HotTableView key={key} info={info} current={current}></HotTableView>
        <div className={cls['report-pagination-box']}>
          <Pagination hideOnSinglePage={true} defaultCurrent={1} defaultPageSize={1} onChange={onChange} total={total} />
        </div>
      </div>
    )
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
      <MainLayout
        selectMenu={selectMenu}
        onSelect={(data) => {
          setSelectMenu(data);
        }}
        siderMenuData={rootMenu}>
          {loadContent()}
      </MainLayout>
    </FullScreenModal>
  );
};
export default ReportView;
