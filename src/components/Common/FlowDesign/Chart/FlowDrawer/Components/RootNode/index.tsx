import React, { useState } from 'react';
import { Button, Divider, Modal, Row } from 'antd';
import cls from './index.module.less';
import { NodeModel } from '../../../../processType';
import ShareShowComp from '@/components/Common/ShareShowComp';
import { AiOutlineSetting } from 'react-icons/ai';
import SelectAuth from '@/components/Common/SelectAuth';
import SelectForms from '@/components/Common/SelectForms';
import { IBelong } from '@/ts/core';
import ViewFormModal from '@/components/Common/FormDesign/viewFormModal';
import { XForm } from '@/ts/base/schema';
interface IProps {
  belong: IBelong;
  current: NodeModel;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [viewForm, setViewForm] = useState<XForm>();
  const [workforms, setWorkForms] = useState<XForm[]>(
    (props.current.forms || []).filter((i) => i.typeName === '事项配置'),
  );
  const [thingforms, setThingForms] = useState<XForm[]>(
    (props.current.forms || []).filter((i) => i.typeName === '实体配置'),
  );
  const [formModel, setFormModel] = useState<string>('');
  const [selectAuthValue, setSelectAuthValue] = useState<any>(props.current.destId);
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择角色</span>
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
              setFormModel('事项配置');
            }}>
            选择业务表单
          </Button>
        </Row>
        {workforms && workforms.length > 0 && (
          <span>
            <ShareShowComp
              departData={workforms}
              onClick={(item: XForm) => {
                setViewForm(item);
              }}
              deleteFuc={(id: string) => {
                setWorkForms([...workforms.filter((i) => i.id != id)]);
                props.current.forms = props.current.forms?.filter((a) => a.id != id);
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
              setFormModel('实体配置');
            }}>
            选择实体表单
          </Button>
        </Row>
        {thingforms && thingforms.length > 0 && (
          <span>
            <ShareShowComp
              departData={thingforms}
              onClick={(item: XForm) => {
                setViewForm(item);
              }}
              deleteFuc={(id: string) => {
                setThingForms([...thingforms.filter((i) => i.id != id)]);
                props.current.forms = props.current.forms?.filter((a) => a.id != id);
              }}
            />
          </span>
        )}
        {/* </div> */}
        <div>
          <Modal
            title={`选择表单`}
            width={800}
            destroyOnClose={true}
            open={formModel != ''}
            okText="确定"
            onOk={() => {
              props.current.forms = [...workforms, ...thingforms];
              setFormModel('');
            }}
            onCancel={() => setFormModel('')}>
            <SelectForms
              belong={props.belong}
              typeName={formModel}
              selected={formModel === '实体配置' ? thingforms : workforms}
              setSelected={formModel === '实体配置' ? setThingForms : setWorkForms}
            />
          </Modal>
          {viewForm && (
            <ViewFormModal
              form={viewForm}
              open={true}
              belong={props.belong}
              handleCancel={() => {
                setViewForm(undefined);
              }}
              handleOk={() => {
                setViewForm(undefined);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default RootNode;
