import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';

import { XIdentity } from '@/ts/base/schema';
import { IStation } from '@/ts/core/target/itarget';
type CreateGroupPropsType = {
  currentKey: string;
  setCurrent: (current: IStation) => void;
  handleMenuClick: (key: string, item: any) => void;
  positions: any[];
  reload: () => void;
};
type target = {
  title: string;
  key: string;
  object: IStation;
};

export type PositionType = {
  name: string;
  code: string;
  indentitys: XIdentity[];
};
const CreatePosition: React.FC<CreateGroupPropsType> = (props) => {
  const { positions, setCurrent, handleMenuClick } = props;
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    changeData(positions);
  }, [positions]);
  /**转化成树控件接收的数据格式 */
  const changeData = async (target: any[]) => {
    const result: target[] = [];
    if (target != undefined) {
      for (const a of target) {
        result.push({
          title: a.name,
          key: a.id,
          object: a,
        });
      }
    } else {
      console.log('空值');
    }
    console.log(result);
    setData([...result]);
  };

  /**选中树的回调 */
  const onSelect = async (
    selectKeys: string[],
    info: { selected: boolean; node: { object: IStation } },
  ) => {
    // 触发内容去变化
    if (info.selected) {
      setCurrent(info.node.object);
    }
  };

  const menu = ['更改岗位名称', '删除'];

  return (
    <div>
      <div className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          type="primary"
          onClick={() => {
            handleMenuClick('新建', {});
          }}>
          新增岗位
        </Button>
        <MarketClassifyTree
          searchable
          childIcon={<UserOutlined />}
          handleMenuClick={handleMenuClick}
          treeData={data}
          menu={menu}
          // selectedKeys={[currentKey]}
          onSelect={onSelect}
          title={'全部岗位'}
        />
      </div>
    </div>
  );
};

export default CreatePosition;
