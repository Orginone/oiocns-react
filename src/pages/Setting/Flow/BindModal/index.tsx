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
import { schema } from '@/ts/base';
import cls from './index.module.less';

type Bindmodalprops = {
  isOpen: boolean;
  bindAppMes: { name: string; id: string };
  onOk: () => void;
  onCancel: () => void;
  upDateData: number;
  noticeBaseInfo: () => void;
};

const BindModal: React.FC<Bindmodalprops> = ({
  bindAppMes,
  isOpen,
  onCancel,
  upDateData,
  noticeBaseInfo, //通知兄弟组件事件
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>();
  const [oldFormData, setOldFormData] = useState<schema.XFlowRelation[]>([]);
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
      setOldFormData(filterId);
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
          (item: {
            productId: string;
            functionCode: string;
            id: string;
            defineId: string;
          }) => {
            // 如果没有id的 就是要绑定的
            if (!item.id) {
              newArr.push(
                userCtrl.space.bindingFlowRelation({
                  defineId: bindAppMes?.id,
                  productId: item.productId,
                  functionCode: item.functionCode,
                  spaceId: userCtrl.space.id,
                }),
              );
              // 如果有id 要看下有没有被编辑过
            } else {
              /** 找到旧值 */
              const findData = oldFormData.find(
                (innItem: { id: string }) => innItem.id === item.id,
              );
              /** 新旧值对比 */
              if (
                findData &&
                (findData.defineId !== item.defineId ||
                  findData.functionCode !== item.functionCode)
              ) {
                newArr.push(
                  userCtrl.space.bindingFlowRelation({
                    defineId: bindAppMes?.id,
                    productId: findData.productId,
                    functionCode: findData.functionCode,
                    spaceId: userCtrl.space.id,
                  }),
                );
              }
            }
          },
        );
        if (newArr && newArr.length > 0) {
          Promise.all(newArr)
            .then((result) => {
              if (result) {
                /** 在这里要通知兄弟组件刷新 */
                message.success('绑定成功');
                noticeBaseInfo();
                initData();
              }
            })
            .catch((error) => {
              message.error(error);
            });
          onCancel();
        }
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
                        userCtrl.space
                          .unbindingFlowRelation({
                            defineId: row?.defineId,
                            productId: row.productId,
                            functionCode: row.functionCode,
                            spaceId: userCtrl.space.id,
                          })
                          .then((result) => {
                            if (result) {
                              message.info('解绑成功');
                              /** 在这里要通知兄弟组件刷新 */
                              noticeBaseInfo();
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
