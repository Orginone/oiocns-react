import React, { useEffect, useState } from 'react';
import { FRGeneratorProps } from 'fr-generator';
import { XOperation } from '@/ts/base/schema';
import { Descriptions, Modal } from 'antd';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';

interface FormDesignProps extends FRGeneratorProps {
  open: boolean;
  data: XOperation | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}

/*
  卡片查看模态框
*/
const ViewCardModal = (props: FormDesignProps) => {
  const { open, data, handleCancel, handleOk } = props;
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const queryItems = async () => {
      const res = await kernel.queryOperationItems({
        id: props.data?.id as string,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      const operationItems = (res.data?.result || [])
        .sort((a, b) => {
          return Number(a.remark) - Number(b.remark);
        })
        .map((item) => {
          item.rule = JSON.parse(item.rule) || {};
          if ((item.rule as any).widget == 'number') {
            (item.rule as any).widget = 'digit';
          } else if ((item.rule as any).widget == 'dict') {
            (item.rule as any).widget = 'select';
          } else if ((item.rule as any).widget == 'person') {
            (item.rule as any).widget = 'select';
          } else if ((item.rule as any).widget == 'group') {
            (item.rule as any).widget = 'treeSelect';
          } else if ((item.rule as any).widget == 'department') {
            (item.rule as any).widget = 'treeSelect';
          }
          return item;
        });
      setItems(operationItems);
    };
    queryItems();
  }, [props.data]);

  return (
    <Modal
      title={'卡片'}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={900}>
      <Descriptions title={'卡片'} column={2} bordered>
        {items.map((item) => {
          return (
            <Descriptions.Item key={item.id} label={item.rule?.title}>
              {/* <ProField valueType={item.rule.widget} mode="edit" bordered={false} /> */}
              <div style={{ width: '120px' }}></div>
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </Modal>
  );
};

export default ViewCardModal;
