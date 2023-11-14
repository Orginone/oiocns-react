import { IWork, IWorkTask } from '@/ts/core';
import { Button, Empty, Input, Spin } from 'antd';
import message from '@/utils/message';
import React, { useEffect, useState } from 'react';
import WorkForm from '@/executor/tools/workForm';
import FullScreenModal from '@/components/Common/fullScreen';
import { model } from '@/ts/base';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import orgCtrl from '@/ts/controller';
import { validate, initApplyData } from '../../../utils/anxinwu/axwRule';
import { useDebounceFn } from '@ant-design/pro-components';
// 卡片渲染
interface IProps {
  current: IWork | IWorkTask;
  finished: () => void;
}

var formData = new Map<string, model.FormEditData>();
const oldFormData: Map<string, string> = new Map<string, string>();

/** 办事-业务流程--发起 */
const WorkStartDo: React.FC<IProps> = ({ current, finished }) => {
  const [data, setData] = useState<model.InstanceDataModel>();
  const [loaded, apply] = useAsyncLoad(() => current.createApply());
  const info: { content: string } = { content: '' };
  useEffect(() => {
    if (apply) {
      formData = new Map<string, model.FormEditData>();
      initApplyData(apply.belong.id, apply.instanceData, formData);
    }
  }, [apply]);

  const fun = useDebounceFn(async (id, data) => {
    if (apply) {
      if ((oldFormData.get(id) ?? '[]') != JSON.stringify(data.after)) {
        formData.forEach((data, k) => {
          oldFormData.set(k, JSON.stringify(data.after));
          apply.instanceData.data[k] = [data];
        });
        setData({ ...apply.instanceData });
      }
    }
  }, 1500);
  const loadContent = () => {
    if (!loaded) {
      return (
        <Spin tip={'配置信息加载中...'}>
          <div style={{ width: '100%', height: '100%' }}></div>
        </Spin>
      );
    }
    if (apply) {
      return (
        <>
          <WorkForm
            allowEdit
            belong={apply.belong}
            data={data ?? apply.instanceData}
            nodeId={apply.instanceData.node.id}
            onChanged={(id, data, changed) => {
              formData.set(id, data);
              validate(
                id,
                formData,
                current.belongId,
                apply.instanceData.fields,
                changed,
              ).then((a) => {
                if (a) {
                  fun.run(id, data);
                }
              });
            }}
          />
          <div style={{ padding: 10, display: 'flex', alignItems: 'flex-end' }}>
            <Input.TextArea
              style={{ height: 100, width: 'calc(100% - 80px)', marginRight: 10 }}
              placeholder="请填写备注信息"
              onChange={(e) => {
                info.content = e.target.value;
              }}
            />
            <Button
              type="primary"
              onClick={async () => {
                if (apply.validation(formData)) {
                  const remarks: string[] = [];
                  for (const key of Object.keys(apply.instanceData.fields)) {
                    var data = formData.get(key);
                    if (data) {
                      for (const field of apply.instanceData.fields[key].filter(
                        (a) => a.options && a.options.showToRemark,
                      )) {
                        var value = data.after[0][field.id];
                        switch (field.valueType) {
                          case '用户型':
                            value = (await orgCtrl.user.findEntityAsync(value))?.name;
                            break;
                          case '选择型':
                            value = field.lookups?.find(
                              (a) => a.id === (value as string).substring(1),
                            )?.text;
                            break;
                          default:
                            break;
                        }
                        remarks.push(`${field.name}:${value}`);
                      }
                    }
                  }
                  await apply.createApply(
                    apply.belong.id,
                    remarks.join(' ') + info.content,
                    formData,
                  );
                  finished();
                } else {
                  message.warn('请完善表单内容再提交!');
                }
              }}>
              提交
            </Button>
          </div>
        </>
      );
    }
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Empty />
      </div>
    );
  };
  return (
    <>
      <FullScreenModal
        open
        centered
        fullScreen
        width={'80vw'}
        bodyHeight={'80vh'}
        destroyOnClose
        title={apply?.metadata.title ?? '加载中...'}
        footer={[]}
        onCancel={finished}>
        {loadContent()}
      </FullScreenModal>
    </>
  );
};

export default WorkStartDo;
