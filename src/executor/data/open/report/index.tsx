import React, { useState, useEffect } from 'react';
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
  const [selectItem, setSelectedItem] = useState<any>();
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(() =>
    config.loadSpeciesItemMenu(current),
  ); /** 渲染左侧树状结构 */
  let sheetList: any = current.metadata?.rule ? JSON.parse(current.metadata?.rule) : {};
  delete sheetList?.list; /** 删除规则list */
  sheetList = Object.values(sheetList);

  /** 获取分页数据 */
  const getData = async (page: number) => {
    const item = selectMenu?.item?.value ?? selectMenu?.item?.code;
    let request: any = {
      filter: undefined,
      group: null,
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: 'contains',
      searchValue: null,
      skip: page,
      take: 1,
      userData: item ? [item] : [],
    };
    const result = await kernel.loadThing<any>(
      current.belongId,
      [current.belongId],
      request,
    );
    if (result.success) {
      setTotal(result.data?.totalCount);
      setSelectedItem(result.data?.data[0]);
    }
  };

  useEffect(() => {
    getData(1);
  }, [selectMenu]);

  if (!selectMenu || !rootMenu) return <></>;

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
        <HotTableView
          key={key}
          selectItem={selectItem}
          sheetList={sheetList}
          current={current}></HotTableView>
        <div className={cls['report-pagination-box']}>
          <Pagination
            hideOnSinglePage={true}
            defaultCurrent={1}
            defaultPageSize={1}
            onChange={getData}
            total={total}
          />
        </div>
      </div>
    );
  };

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title="报表"
      footer={[]}
      onCancel={finished}>
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
