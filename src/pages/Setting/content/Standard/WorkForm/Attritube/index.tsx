import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute, XProperty } from '@/ts/base/schema';
import { AttributeColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IForm, IPropClass, SpeciesType } from '@/ts/core';
import PropertyConfig from './propConfig';
import AttributeConfig from '@/bizcomponents/FormDesign/attributeConfig';
import AttributeModal from '@/bizcomponents/GlobalComps/createAttribute';
import SelectPropertys from './SelectPropertys';
import { Modal } from 'antd';
import { AttributeModel } from '@/ts/base/model';

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
  const [propertys, setPropertys] = useState<XProperty[]>([]);
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
  useEffect(() => {
    if (current.species.typeName === SpeciesType.Thing) {
      setPropertys(
        current.attributes
          .filter((i) => i.linkPropertys && i.linkPropertys.length > 0)
          .map((i) => i.linkPropertys![0]),
      );
    }
  }, []);
  // 操作内容渲染函数
  const renderOperate = (item: XAttribute) => {
    if (!current.species.isInherited) {
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
          label: '删除特性',
          onClick: async () => {
            if (await current.deleteAttribute(item)) {
              tforceUpdate();
            }
          },
        },
      ];
    } else if (current.typeName === SpeciesType.Thing) {
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
    return [];
  };

  return (
    <>
      <CardOrTable<XAttribute>
        key={tkey}
        rowKey={'id'}
        params={tkey}
        operation={renderOperate}
        columns={AttributeColumns()}
        showChangeBtn={false}
        dataSource={current.attributes}
      />
      {/** 新增特性模态框 */}
      {['新增特性', '编辑特性'].includes(modalType) &&
        (current.species.typeName === SpeciesType.Work ? (
          <AttributeModal
            form={current}
            current={modalType.includes('新增') ? undefined : selectedItem}
            open={modalType.includes('特性')}
            handleCancel={function (): void {
              setModalType('');
            }}
            handleOk={function (success: boolean): void {
              if (success) {
                setModalType('');
                tforceUpdate();
              }
            }}
          />
        ) : (
          <Modal
            title={`选择表单`}
            width={800}
            destroyOnClose={true}
            open={true}
            okText="确定"
            onOk={() => {
              setModalType('');
            }}
            onCancel={() => setModalType('')}>
            <SelectPropertys
              species={current.species.current.space.species
                .filter((i) => i.typeName === SpeciesType.Store)
                .map((i) => i as IPropClass)}
              selected={propertys}
              setSelected={setPropertys}
              onAdded={async (prop) => {
                await current.createAttribute(
                  {
                    name: prop.name,
                    code: prop.code,
                    rule: '{}',
                    remark: prop.remark,
                  } as AttributeModel,
                  prop,
                );
                tforceUpdate();
              }}
              onDeleted={async (id) => {
                const attr = current.attributes.find(
                  (i) =>
                    i.linkPropertys &&
                    i.linkPropertys.length > 0 &&
                    i.linkPropertys[0].id === id,
                );
                if (attr) {
                  await current.deleteAttribute(attr);
                  tforceUpdate();
                }
              }}
            />
          </Modal>
        ))}
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
          superAuth={current.species.current.space.superAuth!.metadata}
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
