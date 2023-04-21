import CardOrTableComp from '@/components/CardOrTableComp';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XFlowInstance } from '@/ts/base/schema';
import { SpeciesItem } from '@/ts/core/thing/species';
import { Card, Modal, ModalFuncProps } from 'antd';
import React, { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { WorkStartReocrdColumns } from '../../config/columns';
import orgCtrl from '@/ts/controller';
import { kernel } from '@/ts/base';
import Done from '../WorkTodo/Done';

// 卡片渲染
interface IProps {
  selectMenu: MenuItemType;
  status: number[];
}
/**
 * 已发起记录
 */
const WorkStartRecord: React.FC<IProps> = ({ selectMenu, status }) => {
  const [key] = useObjectUpdate(selectMenu);
  const species: SpeciesItem = selectMenu.item;

  const [pageKey, setPageKey] = useState<number>(0);
  const [instance, setInstance] = useState<XFlowInstance>();

  let curInstance: XFlowInstance;
  const [modal, contextHolder] = Modal.useModal();
  const config: ModalFuncProps = {
    title: '存证',
    content: <h4>存证后将不能修改，是否存证？</h4>,
    onOk: () => deposit(),
  };

  // Todo 存证
  const deposit = () => {
    console.log('curInstance', curInstance);
  };

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
    menus.push({
      key: 'deposit',
      label: '存证',
      onClick: () => {
        curInstance = data;
        modal.confirm(config);
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
            dataSource={[]}
            rowKey={(record) => record?.id}
            columns={WorkStartReocrdColumns}
            operation={(item) => getRenderOperations(item)}
            request={async (page) => {
              return (
                (
                  await kernel.queryInstanceByApply({
                    page,
                    speciesId: species.id,
                    spaceId: orgCtrl.space.id,
                    status: status,
                  })
                )?.data || []
              );
            }}
          />
        </Card>
      )}
      {pageKey == 1 && (
        <Done selectMenu={selectMenu} instanceId={instance?.id} setPageKey={setPageKey} />
      )}
      {contextHolder}
    </>
  );
};

export default WorkStartRecord;
