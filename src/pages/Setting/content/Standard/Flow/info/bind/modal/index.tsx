import cls from './index.module.less';
import { Modal, Form, message } from 'antd';
import userCtrl from '@/ts/controller/setting';
import appCtrl from '@/ts/controller/store/appCtrl';
import { CloseCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import {
  ProForm,
  ProFormSelect,
  ProFormList,
  ProFormGroup,
  ProFormText,
} from '@ant-design/pro-components';
import { XFlowDefine, XFlowRelation } from '@/ts/base/schema';

interface IProps {
  isOpen: boolean;
  current: XFlowDefine;
  onOk: (items: XFlowRelation[]) => void;
  onCancel: () => void;
}
interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  children?: Option[];
}

const BindModal: React.FC<IProps> = ({ current, isOpen, onOk, onCancel }) => {
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<Option[]>([]);

  useEffect(() => {
    form.resetFields();
    initData();
  }, [current, isOpen]);

  const initData = async () => {
    debugger;
    const prods = appCtrl.products
      // .filter((a) => a.prod.resource?.find((q) => q.flows?.length > 0))
      .map((a) => {
        return {
          value: a.prod.id,
          label: a.prod.name,
          // children: a.resource?.map((q) => {
          //   return {
          //     value: q.resource.flows,
          //     label: q.resource.flows,
          //   };
          // }),
        };
      });
    setDataSource(prods);
  };

  return (
    <Modal
      title={`当前流程：${current?.name}`}
      open={isOpen}
      width={900}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      onOk={async () => {
        const formValue = await form.validateFields();
        onOk(formValue.labels as XFlowRelation[]);
      }}>
      <div className={cls.removeLoading}>
        <ProForm layout="horizontal" submitter={false} form={form}>
          <ProFormList
            name="labels"
            actionRef={actionRef}
            initialValue={[{}]}
            actionGuard={{
              beforeRemoveRow: async (index) => {
                const row = actionRef.current![index as number] as XFlowRelation;

                /** 涉及到id的 调接口干掉*/
                if (row?.id) {
                  return new Promise((resolve) => {
                    Modal.confirm({
                      title: '提示',
                      okText: '确认',
                      cancelText: '取消',
                      content: '确定删除当前已绑定的应用?',
                      onOk: async () => {
                        if (
                          await userCtrl.space.unbindingFlowRelation({
                            defineId: row?.defineId,
                            productId: row.productId,
                            functionCode: row.functionCode,
                            spaceId: userCtrl.space.id,
                          })
                        ) {
                          message.info('解绑成功');
                          resolve(true);
                        }
                      },
                      onCancel: () => {
                        resolve(false);
                      },
                    });
                  });
                } else {
                  return true;
                }
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
                options={dataSource}
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
