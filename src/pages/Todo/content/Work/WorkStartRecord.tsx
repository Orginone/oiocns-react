import CardOrTableComp from '@/components/CardOrTableComp';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XFlowInstance } from '@/ts/base/schema';
import { SpeciesItem } from '@/ts/core/thing/species';
import { Card } from 'antd';
import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { WorkStartReocrdColumns } from '../../config/columns';
import userCtrl from '@/ts/controller/setting';
import { kernel } from '@/ts/base';
import Done from '../WorkTodo/Done';

// 卡片渲染
interface IProps {
  selectMenu: MenuItemType;
}
/**
 * 已发起记录
 */
const WorkStartRecord: React.FC<IProps> = ({ selectMenu }) => {
  const [key] = useObjectUpdate(selectMenu);
  const species: SpeciesItem = selectMenu.item;

  const [pageKey, setPageKey] = useState<number>(0);
  const [instance, setInstance] = useState<XFlowInstance>();

  const getRenderOperations = (data: XFlowInstance) => {
    const menus: any[] = [];
    menus.push({
      key: 'view',
      label: '查看',
      onClick: async () => {
        setInstance(data);
        setPageKey(1);
      },
    });
    return menus;
  };

  return (
    <>
      {pageKey == 0 && (
        <Card>
          <CardOrTableComp<XFlowInstance>
            key={key}
            rowKey={(record) => record?.id}
            columns={WorkStartReocrdColumns}
            dataSource={[]}
            request={async (params) => {
              const res = await kernel.queryInstance({
                speciesId: species.id,
                spaceId: userCtrl.space.id,
                page: {
                  offset: params.offset,
                  limit: params.limit,
                  filter: params.filter,
                },
              });
              return {
                result: res.data.result,
                total: res.data.total,
                offset: res.data.offset,
                limit: res.data.limit,
              };
            }}
            operation={(item) => getRenderOperations(item)}
          />
        </Card>
      )}
      {pageKey == 1 && (
        <Done selectMenu={selectMenu} instanceId={instance?.id} setPageKey={setPageKey} />
      )}
    </>
  );
};

export default WorkStartRecord;
