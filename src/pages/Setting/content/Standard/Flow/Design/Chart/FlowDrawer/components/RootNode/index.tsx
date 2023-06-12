import React, { useState } from 'react';
import { Button, Divider, Modal, Row } from 'antd';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import { AiOutlineSetting } from 'react-icons/ai';
import SelectAuth from '../../../../../Comp/selectAuth';
import SelectForms from '../../../../../Comp/SelectForms';
import { IThingClass, IWorkDefine, SpeciesType } from '@/ts/core';
import ViewFormModal from '@/bizcomponents/FormDesign/viewFormModal';
import { XForm } from '@/ts/base/schema';
interface IProps {
  current: NodeType;
  define: IWorkDefine;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [viewForm, setViewForm] = useState<XForm>();
  const [workforms, setWorkForms] = useState<XForm[]>(
    (props.current.props.operations || []).filter((i) => i.typeName === SpeciesType.Work),
  );
  const [thingforms, setThingForms] = useState<XForm[]>(
    (props.current.props.operations || []).filter(
      (i) => i.typeName === SpeciesType.Thing,
    ),
  );
  const [formModel, setFormModel] = useState<string>('');
  const [selectAuthValue, setSelectAuthValue] = useState<any>(
    props.current.props.assignedUser[0]?.id,
  );
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择角色</span>
        </Row>
        <SelectAuth
          space={props.define.workItem.current.space}
          onChange={(newValue: string, label: string) => {
            if (props.current.props.assignedUser[0]) {
              props.current.props.assignedUser[0].id = newValue;
              props.current.props.assignedUser[0].name = label[0];
              setSelectAuthValue(newValue);
            }
          }}
          value={selectAuthValue}></SelectAuth>
        <Divider />
        <Row style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setFormModel('workForm');
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
                props.current.props.operations = props.current.props.operations.filter(
                  (a) => a.id != id,
                );
              }}></ShareShowComp>
          </span>
        )}
        <Row style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setFormModel('thingForm');
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
                props.current.props.operations = props.current.props.operations.filter(
                  (a) => a.id != id,
                );
              }}></ShareShowComp>
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
              props.current.props.operations = [...workforms, ...thingforms];
              setFormModel('');
            }}
            onCancel={() => setFormModel('')}>
            <SelectForms
              species={
                formModel === 'thingForm'
                  ? props.define.workItem.current.space.species
                      .filter((i) => i.typeName === SpeciesType.Thing)
                      .map((i) => i as IThingClass)
                  : props.define.workItem.app.children
                      .filter((i) => i.typeName === SpeciesType.Work)
                      .map((i) => i as IThingClass)
              }
              selected={formModel === 'thingForm' ? thingforms : workforms}
              setSelected={
                formModel === 'thingForm' ? setThingForms : setWorkForms
              }></SelectForms>
          </Modal>
          {viewForm && (
            <ViewFormModal
              form={viewForm}
              open={true}
              define={props.define}
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
