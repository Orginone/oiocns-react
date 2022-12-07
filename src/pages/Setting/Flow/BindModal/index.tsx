import React, { useEffect, useState } from 'react';
import { Modal, Form } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormSelect,
  ProFormList,
  ProFormGroup,
  ProFormText,
} from '@ant-design/pro-components';
import SelfAppCtrl, { SelfCallBackTypes } from '@/ts/controller/store/selfAppCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { model } from '@/ts/base';
type BindModalProps = {
  isOpen: boolean;
  bindAppMes: {};
  onOk: () => void;
  onCancel: () => void;
  upDateData: number;
};

const BindModal: React.FC<BindModalProps> = ({
  bindAppMes,
  isOpen,
  onCancel,
  upDateData,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>();

  useEffect(() => {
    const id = SelfAppCtrl.subscribePart(SelfCallBackTypes.TableData, () => {
      const currentData = SelfAppCtrl.tableData.map((item) => {
        console.log(item.prod);
        return {
          value: item.prod.id,
          label: item.prod.name,
        };
      });
      setData(currentData);
    });

    return () => {
      return SelfAppCtrl.unsubscribe([id]);
    };
  }, []);

  useEffect(() => {
    initData();
  }, [upDateData]);

  const initData = async () => {
    const currentValue = await userCtrl.Space.queryFlowRelation(false);
    console.log('currentValue', currentValue);
    if (currentValue && currentValue.length > 0) {
      form.setFieldsValue({ labels: currentValue });
    }
  };

  return (
    <Modal
      title={`当前流程：${bindAppMes?.name}`}
      open={isOpen}
      width={900}
      destroyOnClose
      onCancel={() => {
        onCancel();
        form.setFieldsValue({ labels: [] });
      }}
      onOk={async () => {
        const curerntValue = await form.validateFields();
        console.log(curerntValue);
        const newArr: Promise<any>[] = [];
        curerntValue.labels.forEach(
          (item: { productId: string; functionCode: string }) => {
            newArr.push(
              userCtrl.Space.bindingFlowRelation({
                defineId: bindAppMes?.id,
                productId: item.productId,
                functionCode: item.functionCode,
                SpaceId: userCtrl.Space.spaceData.id,
              }),
            );
          },
        );
        Promise.all(newArr)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          });
        onCancel();
      }}>
      <ProForm layout="horizontal" submitter={false} form={form}>
        <ProFormList
          name="labels"
          initialValue={[{}]}
          deleteIconProps={{
            Icon: CloseCircleOutlined,
            tooltipText: '删除这个流程字段',
          }}
          copyIconProps={false}
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新增应用绑定',
          }}>
          <ProFormGroup key="group">
            <ProFormSelect
              name="productId"
              width={280}
              label="绑定应用（多选）"
              // mode="multiple"
              options={data}
              placeholder="请选择要绑定的应用"
              rules={[{ required: true, message: '请选择要绑定的应用!' }]}
            />
            <ProFormText
              name="functionCode"
              label="业务名称"
              rules={[{ required: true, message: '请填写业务名称!' }]}
            />
          </ProFormGroup>
        </ProFormList>
      </ProForm>
    </Modal>
  );
};

export default BindModal;
