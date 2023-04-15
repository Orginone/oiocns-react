import React, { useEffect, useState } from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Row, Button, Divider, Col, Radio, Space, Form, InputNumber, Modal } from 'antd';
import IndentitySelect from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';
import { NodeData } from '../../processType';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem } from '@/ts/core';
import { XOperation } from '@/ts/base/schema';
import ViewFormModal from '@/pages/Setting/components/viewFormModal';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import SelectOperation from '@/pages/Setting/content/Standard/Flow/Comp/SelectOperation';
interface IProps {
  current: NodeData;
  orgId?: string;
  species?: ISpeciesItem;
}

/**
 * @description: 审批对象
 * @return {*}
 */

const ApprovalNode: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [radioValue, setRadioValue] = useState(1);
  const [operations, setOperations] = useState<XOperation[]>([]);
  const [operationModal, setOperationModal] = useState<any>();
  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<XOperation>();
  const [showData, setShowData] = useState<any[]>([]);
  // 操作内容渲染函数
  useEffect(() => {
    setOperations(props.current.props.operations || []);
  }, []);

  useEffect(() => {
    // 加载业务表单列表
    if (props.current.props.num && props.current.props.num != 0) {
      setRadioValue(2);
    }
  }, [props.current]);

  // const [processValue, setProcessValue] = useState(1);
  const [nodeOperateOrgId, setNodeOperateOrgId] = useState<string>(
    props.current.belongId || props.orgId || userCtrl.space.id,
  );

  const [currentData, setCurrentData] = useState({
    title: props.current.props.assignedUser[0]?.name,
    key: props.current.props.assignedUser[0]?.id,
    data: {
      id: props.current.props.assignedUser[0]?.id,
      name: props.current.props.assignedUser[0]?.name,
    },
  });
  useEffect(() => {
    if (!props.current.belongId) {
      setNodeOperateOrgId(props.orgId || userCtrl.space.id);
      props.current.belongId = props.orgId;
    }
  }, []);

  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <SettingOutlined style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择审批对象</span>
        </Row>
        <Space>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              props.current.props.assignedType = 'JOB';
              setIsOpen(true);
            }}>
            选择角色
          </Button>
        </Space>
        <div>
          {currentData?.title ? (
            <ShareShowComp
              departData={[currentData.data]}
              deleteFuc={(id: string) => {
                props.current.props.assignedUser = { id: '', name: '' };
                setCurrentData({
                  title: '',
                  key: '',
                  data: { id: '', name: '' },
                });
              }}></ShareShowComp>
          ) : null}
        </div>
        <Divider />
        <div className={cls['roval-node-select']}>
          <Col className={cls['roval-node-select-col']}>👩‍👦‍👦 审批方式</Col>
          <Radio.Group
            onChange={(e) => {
              if (e.target.value == 1) {
                props.current.props.num = 0;
              } else {
                props.current.props.num = 1;
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
                  props.current.props.num = e;
                }}
                value={props.current.props.num}
                placeholder="请设置会签人数"
                addonBefore={<UserOutlined />}
                style={{ width: '60%' }}
              />
            </Form.Item>
          )}
        </div>
      </div>
      <Divider />
      <div style={{ marginBottom: '10px' }}>
        <Button
          type="primary"
          shape="round"
          size="small"
          onClick={() => {
            setOperationModal('');
          }}>
          绑定表单
        </Button>
      </div>
      <div>
        {operations && operations.length > 0 && (
          <span>
            {/* 点击预览：{' '}
            <Space size={[0, 10]}> */}
            <ShareShowComp
              departData={operations}
              onClick={(item: any) => {
                setEditData(item);
                setViewFormOpen(true);
              }}
              deleteFuc={(id: string) => {
                props.current.props.operations = props.current.props.operations.filter(
                  (op) => op.id != id,
                );
                setOperations(props.current.props.operations);
              }}></ShareShowComp>
            {/* </Space> */}
          </span>
        )}
        {/* <ChooseOperation
          open={operationModal != undefined}
          onOk={(item: any) => {
            props.current.props.operations = [item.operation];
            setOperations([item.operation]);
            setOperationModal(undefined);
          }}
          onCancel={() => setOperationModal(undefined)}></ChooseOperation> */}

        <Modal
          title={`选择表单`}
          width={800}
          destroyOnClose={true}
          open={operationModal != undefined}
          okText="确定"
          onOk={() => {
            props.current.props.operations = showData;
            setOperations(showData);
            setOperationModal(undefined);
          }}
          onCancel={() => setOperationModal(undefined)}>
          <SelectOperation
            showData={showData}
            setShowData={setShowData}></SelectOperation>
        </Modal>
      </div>
      <Modal
        width="650px"
        title="选择角色"
        open={isOpen}
        destroyOnClose={true}
        onOk={() => {
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}>
        <IndentitySelect
          multiple={false}
          orgId={nodeOperateOrgId}
          onChecked={(params: any) => {
            props.current.props.assignedUser = [
              { name: params.title, id: params.data.id },
            ];
            setCurrentData(params);
          }}
        />
      </Modal>
      <ViewFormModal
        data={editData}
        open={viewFormOpen}
        handleCancel={() => {
          setViewFormOpen(false);
        }}
        handleOk={() => {
          setViewFormOpen(false);
        }}
      />
    </div>
  );
};
export default ApprovalNode;
