import React, { useState } from 'react';
import { Button, Divider, Row } from 'antd';
import cls from './index.module.less';
import { NodeModel } from '../../../processType';
import ShareShowComp from '@/components/Common/ShareShowComp';
import { AiOutlineSetting } from '@/icons/ai';
import SelectAuth from '@/components/Common/SelectAuth';
import { IBelong, IForm } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import { command, schema } from '@/ts/base';
import { Form } from '@/ts/core/thing/standard/form';
interface IProps {
  belong: IBelong;
  current: NodeModel;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [formModel, setFormModel] = useState<string>('');
  props.current.primaryForms = props.current.primaryForms || [];
  props.current.detailForms = props.current.detailForms || [];
  const [primaryForms, setPrimaryForms] = useState(props.current.primaryForms);
  const [detailForms, setDetailForms] = useState(props.current.detailForms);
  const [selectAuthValue, setSelectAuthValue] = useState<any>(props.current.destId);
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
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择权限</span>
        </Row>
        <SelectAuth
          space={props.belong}
          onChange={(newValue: string, label: string) => {
            props.current.destId = newValue;
            props.current.destName = label;
            setSelectAuthValue(newValue);
          }}
          value={selectAuthValue}></SelectAuth>
        <Divider />
        <Row style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setFormModel('主表');
            }}>
            选择主表
          </Button>
        </Row>
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
        <Row style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setFormModel('子表');
            }}>
            选择子表
          </Button>
        </Row>
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
        {/* </div> */}
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
