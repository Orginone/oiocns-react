import React, { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import {
  Button,
  Divider,
  Col,
  Radio,
  Space,
  Form,
  InputNumber,
  Card,
  Select,
} from 'antd';
import cls from './index.module.less';
import { NodeModel } from '@/components/Common/FlowDesign/processType';
import ShareShowComp from '@/components/Common/ShareShowComp';
import { IBelong } from '@/ts/core';
import SelectIdentity from '@/components/Common/SelectIdentity';
import { command, schema } from '@/ts/base';
import { IForm, Form as SForm } from '@/ts/core/thing/standard/form';
import OpenFileDialog from '@/components/OpenFileDialog';
interface IProps {
  current: NodeModel;
  belong: IBelong;
  refresh: () => void;
}

/**
 * @description: 审批对象
 * @return {*}
 */

const ApprovalNode: React.FC<IProps> = (props) => {
  props.current.primaryForms = props.current.primaryForms || [];
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [formModel, setFormModel] = useState<string>('');
  const [primaryForms, setPrimaryForms] = useState(props.current.primaryForms);
  const [radioValue, setRadioValue] = useState(props.current.num == 0 ? 1 : 2);
  const [destType, setDestType] = useState(
    props.current.destName != '发起人' ? '1' : '2',
  );
  const formViewer = React.useCallback((form: schema.XForm) => {
    command.emitter(
      'executor',
      'open',
      new SForm({ ...form, id: '_' + form.id }, props.belong.directory),
      'preview',
    );
  }, []);
  const [currentData, setCurrentData] = useState<{ id: string; name: string }>({
    id: props.current.destId,
    name: props.current.destName,
  });

  const loadDestType = () => {
    switch (destType) {
      case '1': {
        const data: any[] = [];
        if (!['', '1'].includes(currentData.id ?? '')) {
          data.push(currentData);
        }
        return (
          <>
            <Space>
              <Button
                onClick={() => {
                  setIsOpen(true);
                }}>
                选择角色
              </Button>
            </Space>
            <ShareShowComp
              departData={data}
              deleteFuc={(_) => {
                props.current.destId = '';
                props.current.destName = '';
                props.refresh();
              }}
            />
          </>
        );
      }
      case '2':
        return <a>发起人</a>;
      default:
        return <></>;
    }
  };

  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Card
          type="inner"
          title="表单管理"
          extra={
            <a
              onClick={() => {
                setFormModel('主表');
              }}>
              添加表单
            </a>
          }>
          {primaryForms && primaryForms.length > 0 && (
            <span>
              <ShareShowComp
                departData={primaryForms}
                onClick={formViewer}
                deleteFuc={(id: string) => {
                  props.current.primaryForms = primaryForms?.filter((a) => a.id != id);
                  setPrimaryForms(props.current.primaryForms);
                }}
              />
            </span>
          )}
        </Card>
        <Divider />
        <Card
          type="inner"
          title="审批对象"
          extra={
            <Select
              defaultValue={destType}
              style={{ width: 120 }}
              onSelect={(value) => {
                switch (value) {
                  case '1':
                    props.current.destId = '';
                    props.current.destName = '';
                    props.current.destType = '角色';
                    setCurrentData({ id: '', name: '' });
                    break;
                  case '2':
                    props.current.num = 1;
                    props.current.destId = '1';
                    props.current.destName = '发起人';
                    props.current.destType = '发起人';
                    setCurrentData({ id: '0', name: '发起人' });
                    props.refresh();
                    break;
                  default:
                    break;
                }
                setDestType(value);
              }}
              options={[
                { value: '1', label: '指定角色' },
                { value: '2', label: '发起人' },
              ]}
            />
          }>
          {loadDestType()}
        </Card>
        <Divider />
        {destType == '1' && (
          <Card type="inner" title={'审批方式'}>
            <div className={cls['roval-node-select']}>
              <Col className={cls['roval-node-select-col']}></Col>
              <Radio.Group
                onChange={(e) => {
                  if (e.target.value == 1) {
                    props.current.num = 0;
                  } else {
                    props.current.num = 1;
                  }
                  setRadioValue(e.target.value);
                }}
                style={{ paddingBottom: '10px' }}
                value={radioValue}>
                <Radio value={1} style={{ width: '100%' }}>
                  全部: 需征得该角色下所有人员同意
                </Radio>
                <Radio value={2}>部分会签: 指定审批该节点的人员的数量</Radio>
              </Radio.Group>
              {radioValue === 2 && (
                <Form.Item label="会签人数">
                  <InputNumber
                    min={1}
                    onChange={(e: number | null) => {
                      props.current.num = e ?? 1;
                    }}
                    value={props.current.num}
                    placeholder="请设置会签人数"
                    addonBefore={<AiOutlineUser />}
                    style={{ width: '60%' }}
                  />
                </Form.Item>
              )}
            </div>
          </Card>
        )}
      </div>
      <SelectIdentity
        open={isOpen}
        exclude={[]}
        multiple={false}
        space={props.belong}
        finished={(selected) => {
          if (selected.length > 0) {
            const item = selected[0];
            props.current.destType = '身份';
            props.current.destId = item.id;
            props.current.destName = item.name;
            setCurrentData(item);
            props.refresh();
          }
          setIsOpen(false);
        }}
      />
      {formModel != '' && (
        <OpenFileDialog
          multiple
          title={`选择表单`}
          rootKey={props.belong.directory.key}
          accepts={['表单']}
          excludeIds={primaryForms?.map((i) => i.id)}
          onCancel={() => setFormModel('')}
          onOk={(files) => {
            if (files.length > 0) {
              const forms = (files as unknown[] as IForm[]).map((i) => i.metadata);
              props.current.primaryForms.push(...forms);
              setPrimaryForms(props.current.primaryForms);
            }
            setFormModel('');
          }}
        />
      )}
    </div>
  );
};
export default ApprovalNode;
