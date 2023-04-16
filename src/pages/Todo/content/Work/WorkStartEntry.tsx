import CardOrTableComp from '@/components/CardOrTableComp';
import { FlowColumn } from '@/pages/Setting/config/columns';
import { XFlowDefine } from '@/ts/base/schema';
import { IFlowDefine } from '@/ts/core/thing/iflowDefine';
import { SpeciesItem } from '@/ts/core/thing/species';
import { getUuid } from '@/utils/tools';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import WorkStartDo from './WorkStartDo';

// 卡片渲染
interface IProps {
  selectMenu: MenuItemType;
  doWork?: XFlowDefine;
}

/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartEntry: React.FC<IProps> = ({ selectMenu, doWork }) => {
  const species: SpeciesItem = selectMenu.item;
  const [flowDefines, setFlowDefines] = useState<XFlowDefine[]>([]);
  const [defineKey, setDefineKey] = useState<string>();
  const [currentDefine, setCurrentDefine] = useState<XFlowDefine>();
  useEffect(() => {
    setCurrentDefine(doWork);
  }, [doWork]);

  useEffect(() => {
    setCurrentDefine(undefined);
    const loadFlowDefine = async () => {
      if (species?.id) {
        const defines: IFlowDefine[] = await species.loadFlowDefines();
        setFlowDefines(defines.map((item) => item.target));
        setDefineKey(getUuid());
      }
    };
    loadFlowDefine();
  }, [species?.id]);

  const getRenderOperations = (data: XFlowDefine) => {
    const menus: any[] = [];
    menus.push({
      key: 'retractApply',
      label: '发起',
      onClick: async () => {
        setCurrentDefine(data);
      },
    });
    return menus;
  };

  return (
    <Card>
      {!currentDefine && (
        <CardOrTableComp<XFlowDefine>
          key={defineKey}
          rowKey={(record) => record?.id}
          columns={FlowColumn}
          dataSource={flowDefines}
          operation={(item) => getRenderOperations(item)}
        />
      )}
      {currentDefine && (
        <WorkStartDo
          currentDefine={currentDefine}
          goBack={() => {
            setCurrentDefine(undefined);
          }}></WorkStartDo>
      )}
    </Card>
  );
};

export default WorkStartEntry;
