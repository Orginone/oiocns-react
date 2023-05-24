import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XProperty } from '@/ts/base/schema';
import { PropertyColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import PropertyModal from '@/bizcomponents/GlobalComps/createProperty';
import ImportModal from '@/bizcomponents/GlobalComps/import';
import { Button, message } from 'antd';
import { IDict, IPropClass } from '@/ts/core';
import PageCard from '@/components/PageCard';
import { generateXlsx } from '@/utils/excel';
import { PropertyModel } from '@/ts/base/model';
import { schema } from '@/ts/base';

/**
 * @description: 属性标准
 * @return {*}
 */
const Property: React.FC<any> = ({ current }: { current: IPropClass }) => {
  const [modalType, setModalType] = useState('');
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XProperty>();
  useEffect(() => {
    current.loadPropertys().then(() => {
      tforceUpdate();
    });
  }, []);
  // 操作内容渲染函数
  const renderOperate = (item: XProperty) => {
    if (item.speciesId === current.id) {
      return [
        {
          key: '修改属性',
          label: '编辑属性',
          onClick: () => {
            setEditData(item);
            setModalType('修改属性');
          },
        },
        {
          key: '删除属性',
          label: '删除属性',
          onClick: async () => {
            await current.deleteProperty(item);
            tforceUpdate();
          },
        },
      ];
    }
    return [];
  };

  useEffect(() => {
    tforceUpdate();
  }, []);

  let sheetName = '数据集';
  let propertiesMap: { [name: string]: schema.XProperty } = {};
  let dictMap: { [name: string]: IDict } = {};
  return (
    <>
      <PageCard
        bordered={false}
        activeTabKey={'property'}
        tabList={[
          {
            tab: '属性定义',
            key: 'property',
          },
        ]}
        tabBarExtraContent={
          <>
            <Button
              key="template"
              type="link"
              onClick={() => {
                generateXlsx(
                  ['名称', '类型', '单位', '枚举字典', '说明'],
                  '属性导入模板',
                  sheetName,
                );
              }}>
              导入模板下载
            </Button>
            <Button
              key="import"
              type="link"
              onClick={() => {
                setModalType('导入属性');
              }}>
              导入属性
            </Button>
            <Button
              key="add"
              type="link"
              onClick={() => {
                setEditData(undefined);
                setModalType('新建属性');
              }}>
              添加属性
            </Button>
          </>
        }
        bodyStyle={{ paddingTop: 16 }}>
        <CardOrTable<XProperty>
          rowKey={'id'}
          params={tkey}
          operation={renderOperate}
          columns={PropertyColumns(current)}
          showChangeBtn={false}
          dataSource={current.propertys}
        />
      </PageCard>
      {/** 新增/编辑属性模态框 */}
      {modalType == '新建属性' && (
        <PropertyModal
          species={current}
          data={editData}
          open={modalType == '新建属性'}
          handleCancel={() => {
            setModalType('');
          }}
          handleOk={function (success: boolean): void {
            setModalType('');
            if (success) {
              message.success('操作成功');
              tforceUpdate();
            }
          }}
        />
      )}
      {/** 导入模态框 */}
      {modalType == '导入属性' && (
        <ImportModal
          title="属性导入"
          species={current}
          sheetNumber={0}
          beforeImport={async () => {
            for (let item of await current.loadPropertys()) {
              propertiesMap[item.name] = item;
            }
            for (let item of await current.current.space.loadDicts()) {
              dictMap[item.metadata.code + '_' + item.metadata.name] = item;
            }
          }}
          operatingItem={async (item: any) => {
            await current.createProperty({
              name: item['名称'],
              valueType: item['类型'],
              unit: item['单位'],
              speciesId: current.metadata.id,
              dictId: dictMap[item['枚举字典']]?.metadata.id,
              remark: item['说明'],
            } as PropertyModel);
          }}
          open={modalType == '导入属性'}
          handleCancel={() => setModalType('')}
          handleOk={async () => {
            await current.loadPropertys(true);
            tforceUpdate();
            setModalType('');
          }}
        />
      )}
    </>
  );
};
export default Property;
