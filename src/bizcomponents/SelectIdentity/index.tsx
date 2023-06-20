import React, { useState } from 'react';
import { Modal } from 'antd';
import { schema } from '@/ts/base';
import { IBelong, ITarget } from '@/ts/core';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import EntityIcon from '../GlobalComps/entityIcon';

interface IProps {
  open: boolean;
  space: IBelong;
  multiple: boolean;
  exclude: schema.XIdentity[];
  finished: (selected: schema.XIdentity[]) => void;
}

const SelectIdentity: React.FC<IProps> = ({
  open,
  space,
  multiple,
  exclude,
  finished,
}) => {
  const [selected, setSelected] = useState<schema.XIdentity[]>(exclude);
  const [identitys, setIdentitys] = useState<any[]>([]);
  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[]) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        result.push({
          key: item.id,
          title: item.name,
          item: item,
          isLeaf: item.subTarget.length === 0,
          icon: <EntityIcon entityId={item.id} size={18} />,
          children: buildTargetTree(item.subTarget),
        });
      }
    }
    return result;
  };

  return (
    <Modal
      open={open}
      title={'选择成员'}
      maskClosable
      width={800}
      bodyStyle={{
        maxHeight: '100vh',
      }}
      destroyOnClose
      onCancel={() => finished([])}
      onOk={() => finished(selected)}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}>
      <div className={cls.layout}>
        <div className={cls.content}>
          <div className={`${multiple ? cls.leftContent : cls.newLeftContent}`}>
            <CustomTree
              className={cls.docTree}
              isDirectoryTree
              searchable
              showIcon
              treeData={buildTargetTree(space.shareTarget)}
              onSelect={(_, info: any) => {
                const target: ITarget = info.node.item;
                if (target) {
                  setIdentitys(
                    target.identitys.map((item) => {
                      return {
                        title: `[${target.name}]` + item.name,
                        key: item.id,
                        data: item,
                      };
                    }),
                  );
                }
              }}
            />
          </div>
          <div className={`${multiple ? cls.center : cls.newCenter}`}>
            <CustomTree
              className={cls.docTree}
              searchable
              showIcon
              checkable={multiple}
              multiple={multiple}
              autoExpandParent={true}
              onCheck={(_, info) => {
                const item = identitys.find((i) => i.key === info.node.key)?.data;
                if (item) {
                  if (multiple) {
                    if (info.checked) {
                      setSelected([item.metadata, ...selected]);
                    } else {
                      setSelected(selected.filter((i) => i.id != item.id));
                    }
                  } else {
                    setSelected(info.checked ? [item.metadata] : []);
                  }
                }
              }}
              onSelect={(_, info) => {
                const item = identitys.find((i) => i.key === info.node.key)?.data;
                if (item) {
                  if (multiple) {
                    setSelected([item.metadata, ...selected]);
                  } else {
                    setSelected([item.metadata]);
                  }
                }
              }}
              treeData={identitys}
              checkedKeys={selected.map((i) => i.id)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectIdentity;
