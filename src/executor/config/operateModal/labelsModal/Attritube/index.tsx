import React, { useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IForm } from '@/ts/core';
import PropertyConfig from './propConfig';
import AttributeConfig from '@/components/Common/FormDesign/attributeConfig';
import SelectPropertys from '@/components/Common/SelectPropertys';
import { Modal } from 'antd';
import { AttributeColumn } from '@/config/column';
import { schema } from '@/ts/base';

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
  const [tkey, tforceUpdate] = useObjectUpdate('');
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
    if (item.belongId === current.directory.target.space.id) {
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
            if (await current.deleteAttribute(item)) {
              tforceUpdate();
            }
          },
        },
      ];
    } else {
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
        <Modal
          open
          width={800}
          title="选择属性"
          destroyOnClose
          okText="确定"
          onOk={() => setModalType('')}
          onCancel={() => setModalType('')}>
          <SelectPropertys
            target={current.directory.target}
            selected={current.attributes.map((a) => a.property!)}
            onAdded={async (prop) => {
              await current.createAttribute(
                {
                  name: prop.name,
                  code: prop.code,
                  rule: '{}',
                  remark: prop.remark,
                } as schema.XAttribute,
                prop,
              );
              tforceUpdate();
            }}
            onDeleted={async (id) => {
              const attr = current.attributes.find((i) => i.propId === id);
              if (attr) {
                await current.deleteAttribute(attr);
                tforceUpdate();
              }
            }}
          />
        </Modal>
      )}
      {/** 编辑特性模态框 */}
      {modalType.includes('配置特性') && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setSelectedItem(undefined);
            setModalType('');
            tforceUpdate();
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
            tforceUpdate();
          }}
          attr={selectedItem}
          modalType={modalType}
        />
      )}
    </>
  );
};
export default Attritube;
