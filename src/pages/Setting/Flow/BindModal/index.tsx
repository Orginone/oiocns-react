import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormSelect,
  ProFormList,
  ProFormGroup,
  ProFormText,
} from '@ant-design/pro-components';
import SelfAppCtrl from '@/ts/controller/store/selfAppCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
import cls from './index.module.less';

type BindModalProps = {
  isOpen: boolean;
  bindAppMes: { name: string; id: string };
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
  const actionRef = useRef();

  useEffect(() => {
    initData();
  }, [upDateData]);

  const initData = async () => {
    const tableData = await SelfAppCtrl.querySelfApps();
    const currentData = tableData.map((item) => {
      return {
        value: item.prod.id,
        label: item.prod.name,
      };
    });
    setData(currentData);
    const currentValue = await userCtrl.space.queryFlowRelation(false);

    if (currentValue && currentValue.length > 0) {
      const filterId = currentValue.filter((item) => {
        return item.defineId === bindAppMes?.id;
      });
      form.setFieldsValue({ labels: filterId });
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

        const newArr: Promise<any>[] = [];
        curerntValue.labels.forEach(
          (item: { productId: string; functionCode: string }) => {
            newArr.push(
              userCtrl.space.bindingFlowRelation({
                defineId: bindAppMes?.id,
                productId: item.productId,
                functionCode: item.functionCode,
                SpaceId: userCtrl.space.spaceData.id,
              }),
            );
          },
        );
        Promise.all(newArr)
          .then((result) => {
            if (result) {
              message.success('绑定成功');
              initData();
            }
          })
          .catch((error) => {
            message.error(error);
          });
        onCancel();
      }}>
      {/* loading通过样式隐藏，没有相关的Api */}
      <div className={cls.removeLoading}>
        <ProForm layout="horizontal" submitter={false} form={form}>
          <ProFormList
            name="labels"
            actionRef={actionRef}
            initialValue={[{}]}
            actionGuard={{
              beforeRemoveRow: async (index) => {
                const row = actionRef.current?.get(index as number);
                return new Promise((resolve) => {
                  /** 涉及到id的 调接口干掉*/
                  if (row?.id) {
                    Modal.confirm({
                      title: '提示',
                      content: '确定删除当前已绑定的应用?',
                      onOk: () => {
                        userCtrl.space.unbindingFlowRelation({
                          defineId: row?.defineId,
                          productId: row.productId,
                          functionCode: row.functionCode,
                          SpaceId: userCtrl.space.spaceData.id,
                        }).then((result) => {
                          if (result && result.code === 200) {
                            message.success('解绑成功');
                            resolve(true);
                          } else {
                            message.success('解绑失败');
                            resolve(false);
                          }
                        });
                      },
                      onCancel: () => {
                        resolve(false);
                      },
                    });
                  } else {
                    /** 不涉及到id的 直接干掉*/
                    resolve(true);
                  }
                });
              },
            }}
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
                label="应用名称"
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
      </div>
    </Modal>
  );
};

export default BindModal;
