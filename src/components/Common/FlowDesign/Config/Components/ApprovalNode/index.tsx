import React, { useEffect, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { Button, Col, Radio, Form, InputNumber, Card, Divider } from 'antd';
import cls from './index.module.less';
import { NodeModel, executorNames } from '@/components/Common/FlowDesign/processType';
import ShareShowComp from '@/components/Common/ShareShowComp';
import { IBelong, IWork } from '@/ts/core';
import SelectIdentity from '@/components/Common/SelectIdentity';
import { command, model, schema } from '@/ts/base';
import { IForm, Form as SForm } from '@/ts/core/thing/standard/form';
import OpenFileDialog from '@/components/OpenFileDialog';
import { SelectBox } from 'devextreme-react';
import { getUuid } from '@/utils/tools';
import Rule from '../../Rule';
import ExecutorShowComp from '@/components/Common/ExecutorShowComp';
interface IProps {
  work: IWork;
  current: NodeModel;
  belong: IBelong;
  refresh: () => void;
}

/**
 * @description: 审批对象
 * @return {*}
 */

const ApprovalNode: React.FC<IProps> = (props) => {
  const [funcName, setFuncName] = useState<string>('');
  const [trigger, setTrigger] = useState<string>('before');
  const [executors, setExecutors] = useState<model.Executor[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [formModel, setFormModel] = useState<string>('');
  const [primaryForms, setPrimaryForms] = useState<schema.XForm[]>();
  const [radioValue, setRadioValue] = useState(1);
  const [destType, setDestType] = useState('1');
  const [currentData, setCurrentData] = useState<{ id: string; name: string }>();
  useEffect(() => {
    props.current.primaryForms = props.current.primaryForms || [];
    setExecutors(props.current.executors);
    setPrimaryForms(props.current.primaryForms);
    setRadioValue(props.current.num == 0 ? 1 : 2);
    setDestType(props.current.destName != '发起人' ? '1' : '2');
    setCurrentData({
      id: props.current.destId,
      name: props.current.destName,
    });
  }, [props.current]);
  const formViewer = React.useCallback((form: schema.XForm) => {
    command.emitter(
      'executor',
      'open',
      new SForm({ ...form, id: '_' + form.id }, props.belong.directory),
      'preview',
    );
  }, []);

  const loadDestType = () => {
    switch (destType) {
      case '1': {
        return (
          <>
            {currentData && currentData.id != '1' && (
              <ShareShowComp
                departData={[currentData]}
                deleteFuc={(_) => {
                  props.current.destId = '';
                  props.current.destName = '';
                  setCurrentData(undefined);
                  props.refresh();
                }}
              />
            )}
            <Divider />
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
        {' '}
        <Card
          type="inner"
          title="审批对象"
          className={cls[`card-info`]}
          extra={
            <>
              <SelectBox
                value={destType}
                valueExpr={'value'}
                displayExpr={'label'}
                style={{ width: 120, display: 'inline-block' }}
                onSelectionChanged={(e) => {
                  switch (e.selectedItem.value) {
                    case '1':
                      props.current.destType = '角色';
                      setCurrentData(undefined);
                      break;
                    case '2':
                      props.current.num = 1;
                      props.current.destId = '1';
                      props.current.destName = '发起人';
                      props.current.destType = '发起人';
                      setCurrentData({ id: '1', name: '发起人' });
                      props.refresh();
                      break;
                    default:
                      break;
                  }
                  setDestType(e.selectedItem.value);
                }}
                dataSource={[
                  { value: '1', label: '指定角色' },
                  { value: '2', label: '发起人' },
                ]}
              />
              {destType == '1' && (
                <a
                  style={{ paddingLeft: 10, display: 'inline-block' }}
                  onClick={() => {
                    setIsOpen(true);
                  }}>
                  选择角色
                </a>
              )}
            </>
          }>
          {loadDestType()}
        </Card>
        <Card
          type="inner"
          title="审批对象"
          className={cls[`card-info`]}
          extra={
            <>
              <SelectBox
                value={destType}
                valueExpr={'value'}
                displayExpr={'label'}
                style={{ width: 120, display: 'inline-block' }}
                onSelectionChanged={(e) => {
                  switch (e.selectedItem.value) {
                    case '1':
                      props.current.destType = '角色';
                      setCurrentData(undefined);
                      break;
                    case '2':
                      props.current.num = 1;
                      props.current.destId = '1';
                      props.current.destName = '发起人';
                      props.current.destType = '发起人';
                      setCurrentData({ id: '1', name: '发起人' });
                      props.refresh();
                      break;
                    default:
                      break;
                  }
                  setDestType(e.selectedItem.value);
                }}
                dataSource={[
                  { value: '1', label: '指定角色' },
                  { value: '2', label: '发起人' },
                ]}
              />
              {destType == '1' && (
                <a
                  style={{ paddingLeft: 10, display: 'inline-block' }}
                  onClick={() => {
                    setIsOpen(true);
                  }}>
                  选择角色
                </a>
              )}
            </>
          }>
          {loadDestType()}
        </Card>
        <Card
          type="inner"
          title="表单管理"
          className={cls[`card-info`]}
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
        <Card
          type="inner"
          title="执行器配置"
          className={cls[`card-info`]}
          extra={
            <>
              <SelectBox
                width={150}
                showClearButton
                value={trigger}
                style={{ display: 'inline-block' }}
                dataSource={[
                  { text: '审批前', value: 'before' },
                  { text: '审批后', value: 'after' },
                ]}
                displayExpr={'text'}
                valueExpr={'value'}
                onValueChange={(e) => {
                  setTrigger(e);
                }}
              />
              <SelectBox
                width={150}
                showClearButton
                style={{ display: 'inline-block' }}
                dataSource={executorNames.filter(
                  (a) => executors.find((s) => s.funcName == a) == undefined,
                )}
                onValueChange={(e) => {
                  setFuncName(e);
                }}
              />
              <Button
                type="link"
                style={{ display: 'inline-block' }}
                disabled={!funcName || !trigger}
                onClick={() => {
                  executors.push({
                    id: getUuid(),
                    trigger: trigger,
                    funcName: funcName,
                    changes: [],
                    hookUrl: '',
                  });
                  setExecutors([...executors]);
                  setFuncName('');
                }}>
                添加
              </Button>
            </>
          }>
          {executors && executors.length > 0 && (
            <span>
              <ExecutorShowComp
                work={props.work}
                executors={executors}
                deleteFuc={(id: string) => {
                  setExecutors(executors.filter((a) => a.id != id));
                }}
              />
            </span>
          )}
        </Card>
        <Rule
          work={props.work}
          current={props.current}
          primaryForms={primaryForms ?? []}
          detailForms={[]}
        />
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
