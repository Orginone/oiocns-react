import React, { useState } from 'react';
import { Button, Card } from 'antd';
import cls from './index.module.less';
import { NodeModel, executorNames } from '../../../processType';
import ShareShowComp from '@/components/Common/ShareShowComp';
import { IBelong, IForm, IWork } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import { command, model, schema } from '@/ts/base';
import { Form } from '@/ts/core/thing/standard/form';
import { SelectBox } from 'devextreme-react';
import { getUuid } from '@/utils/tools';
import Rule from '../../Rule';
import ExecutorShowComp from '@/components/Common/ExecutorShowComp';
interface IProps {
  work: IWork;
  belong: IBelong;
  current: NodeModel;
  refresh: () => void;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [trigger, setTrigger] = useState<string>('before');
  const [funcName, setFuncName] = useState<string>('');
  const [formModel, setFormModel] = useState<string>('');
  props.current.primaryForms = props.current.primaryForms || [];
  props.current.detailForms = props.current.detailForms || [];
  const [primaryForms, setPrimaryForms] = useState(props.current.primaryForms);
  const [detailForms, setDetailForms] = useState(props.current.detailForms);
  const [executors, setExecutors] = useState<model.Executor[]>(props.current.executors);
  const formViewer = React.useCallback((form: schema.XForm) => {
    command.emitter(
      'executor',
      'open',
      new Form({ ...form, id: '_' + form.id }, props.belong.directory),
      'preview',
    );
  }, []);
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Card
          type="inner"
          title="主表配置"
          className={cls['card-info']}
          extra={
            <a
              onClick={() => {
                setFormModel('主表');
              }}>
              添加
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
          title="子表配置"
          className={cls[`card-info`]}
          extra={
            <a
              onClick={() => {
                setFormModel('子表');
              }}>
              添加
            </a>
          }>
          {detailForms && detailForms.length > 0 && (
            <span>
              <ShareShowComp
                departData={detailForms}
                onClick={formViewer}
                deleteFuc={(id: string) => {
                  props.current.detailForms = detailForms?.filter((a) => a.id != id);
                  setDetailForms(props.current.detailForms);
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
                  setFuncName('');
                  setExecutors([...executors]);
                  props.current.executors = executors;
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
                  var exes = executors.filter((a) => a.id != id);
                  setExecutors(exes);
                  props.current.executors = exes;
                }}
              />
            </span>
          )}
        </Card>
        <Rule
          work={props.work}
          current={props.current}
          primaryForms={primaryForms}
          detailForms={detailForms}
        />
        {formModel != '' && (
          <OpenFileDialog
            multiple
            title={`选择${formModel}表单`}
            rootKey={props.belong.directory.key}
            accepts={['表单']}
            excludeIds={(formModel === '子表' ? detailForms : primaryForms).map(
              (i) => i.id,
            )}
            onCancel={() => setFormModel('')}
            onOk={(files) => {
              if (files.length > 0) {
                const forms = (files as unknown[] as IForm[]).map((i) => i.metadata);
                if (formModel === '子表') {
                  props.current.detailForms.push(...forms);
                  setDetailForms(props.current.detailForms);
                } else {
                  props.current.primaryForms.push(...forms);
                  setPrimaryForms(props.current.primaryForms);
                }
              }
              setFormModel('');
            }}
          />
        )}
      </div>
    </div>
  );
};
export default RootNode;
