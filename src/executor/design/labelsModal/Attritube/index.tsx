import React, { useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute } from '@/ts/base/schema';
import { IForm, IProperty } from '@/ts/core';
import PropertyConfig from './propConfig';
import AttributeConfig from '@/components/Common/FormDesign/attributeConfig';
import OpenFileDialog from '@/components/OpenFileDialog';
import { AttributeColumn } from '@/config/column';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';

interface IProps {
  current: IForm;
  modalType: string;
  recursionOrg: boolean;
  setModalType: (modalType: string) => void;
}

/**
 * @description: 分类特性标准
 * @return {*}
 */
const Attritube = ({ current, modalType, setModalType }: IProps) => {
  const [tkey] = useCtrlUpdate(current);
  const [selectedItem, setSelectedItem] = useState<XAttribute>();
  // 项配置改变
  const formValuesChange = (changedValues: any) => {
    if (selectedItem) {
      selectedItem.rule = selectedItem.rule || '{}';
      const rule = { ...JSON.parse(selectedItem.rule), ...changedValues };
      setSelectedItem({
        ...selectedItem,
        rule: JSON.stringify(rule),
      });
      current.updateAttribute({ ...selectedItem, ...rule, rule: JSON.stringify(rule) });
    }
  };
  // 操作内容渲染函数
  const renderOperate = (item: XAttribute) => {
    if (current.isInherited) {
      return [
        {
          key: '关联属性',
          label: '关联属性',
          onClick: () => {
            setSelectedItem(item);
            setModalType('关联属性');
          },
        },
        {
          key: '复制属性',
          label: '复制属性',
          onClick: async () => {
            setSelectedItem(item);
            setModalType('复制属性');
          },
        },
      ];
    } else {
      return [
        {
          key: '编辑特性',
          label: '编辑特性',
          onClick: () => {
            setSelectedItem(item);
            setModalType('编辑特性');
          },
        },
        {
          key: '配置特性',
          label: '配置特性',
          onClick: () => {
            setSelectedItem(item);
            setModalType('配置特性');
          },
        },
        {
          key: '删除特性',
          label: <span style={{ color: 'red' }}>删除特性</span>,
          onClick: async () => {
            await current.deleteAttribute(item);
          },
        },
      ];
    }
  };

  return (
    <>
      <CardOrTable<XAttribute>
        key={tkey}
        rowKey={'id'}
        params={tkey}
        operation={renderOperate}
        columns={AttributeColumn}
        dataSource={current.attributes}
      />
      {/** 新增特性模态框 */}
      {['新增特性', '编辑特性'].includes(modalType) && (
        <OpenFileDialog
          multiple
          title={`选择属性`}
          accepts={['属性']}
          rootKey={current.spaceKey}
          excludeIds={current.attributes.filter((i) => i.propId).map((a) => a.propId)}
          onCancel={() => setModalType('')}
          onOk={(files) => {
            if (files.length > 0) {
              current.createAttribute((files as IProperty[]).map((i) => i.metadata));
            }
            setModalType('');
          }}
        />
      )}
      {/** 编辑特性模态框 */}
      {modalType.includes('配置特性') && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setSelectedItem(undefined);
            setModalType('');
          }}
          superAuth={current.directory.target.space.superAuth!.metadata}
        />
      )}
      {/** 属性相关操作 */}
      {modalType.includes('属性') && selectedItem && (
        <PropertyConfig
          form={current}
          onFinish={() => {
            setSelectedItem(undefined);
            setModalType('');
          }}
          attr={selectedItem}
          modalType={modalType}
        />
      )}
    </>
  );
};
export default Attritube;
