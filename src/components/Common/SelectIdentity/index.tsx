import React, { useState } from 'react';
import { Modal, TreeProps } from 'antd';
import { schema } from '@/ts/base';
import { IBelong, ITarget } from '@/ts/core';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import EntityIcon from '../GlobalComps/entityIcon';
import ShareShowComp from '../ShareShowComp';

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
  const [identitys, setIdentitys] = useState<any[]>([]);
  const [selected, setSelected] = useState<schema.XIdentity[]>(exclude);

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const target: ITarget = info.node.item;
    if (target) {
      await target.loadIdentitys();
      setIdentitys(
        target.identitys.map((item) => {
          return {
            title: `[${target.typeName}]${target.name}--` + item.name,
            key: item.id,
            data: item,
          };
        }),
      );
    }
  };
  const onCheck: TreeProps['onCheck'] = (_, info) => {
    const item = identitys.find((i) => i.key === info.node.key)?.data;
    if (item) {
      if (multiple) {
        if (info.checked) {
          if (selected.every((a) => a.id != item.metadata.id)) {
            setSelected([item.metadata, ...selected]);
          }
        } else {
          setSelected(selected.filter((i) => i.id != item.id));
        }
      } else {
        setSelected(info.checked ? [item.metadata] : []);
      }
    }
  };
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
      title={'选择角色'}
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
          <div className={cls.leftContent}>
            <CustomTree
              showIcon
              searchable
              isDirectoryTree
              onSelect={onSelect}
              className={cls.docTree}
              treeData={buildTargetTree(space.shareTarget)}
            />
          </div>
          <div className={cls.centerContent}>
            <CustomTree
              searchable
              showIcon
              onCheck={onCheck}
              treeData={identitys}
              checkable={multiple}
              className={cls.docTree}
              autoExpandParent={true}
              checkedKeys={selected.map((i) => i.id)}
              onSelect={(_, info) => {
                const item = identitys.find((i) => i.key === info.node.key)?.data;
                if (item) {
                  if (multiple) {
                    if (selected.every((a) => a.id != item.metadata.id)) {
                      setSelected([
                        { ...item.metadata, name: info.node.title },
                        ...selected,
                      ]);
                    }
                  } else {
                    setSelected([{ ...item.metadata, name: info.node.title }]);
                  }
                }
              }}
            />
          </div>
          {multiple ? (
            <div className={cls.rightContent}>
              <ShareShowComp
                departData={selected}
                deleteFuc={(id) => {
                  setSelected(selected.filter((a) => a.id != id));
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SelectIdentity;
