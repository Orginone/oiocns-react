import React, { useState } from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Row, Button, Divider, Col, Radio, Space, Form, InputNumber, Modal } from 'antd';
import IndentitySelect from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';
import { NodeType } from '../../processType';

interface IProps {
  current: NodeType;
  orgId?: string;
}

/**
 * @description: 审批对象
 * @return {*}
 */

const ApprovalNode: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [radioValue, setRadioValue] = useState(1);
  // const [processValue, setProcessValue] = useState(1);
  const [currentData, setCurrentData] = useState({
    title: '',
    key: '',
    data: { id: '', name: '' },
  });

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
            选择身份
          </Button>
          {currentData?.title ? (
            <span>
              当前选择：<a>{currentData?.title}</a>
            </span>
          ) : null}
        </Space>
        <Divider />
        <div className={cls['roval-node-select']}>
          <Col className={cls['roval-node-select-col']}>👩‍👦‍👦 审批方式</Col>
          <Radio.Group
            onChange={(e) => {
              setRadioValue(e.target.value);
            }}
            style={{ paddingBottom: '10px' }}
            value={radioValue}>
            <Radio value={1}>全部: 需征得该身份下所有人员同意</Radio>
            <Radio value={2}>部分会签: 指定审批该节点的人员的数量</Radio>
          </Radio.Group>
          {radioValue === 2 && (
            <Form.Item label="会签人数">
              <InputNumber
                min={1}
                onChange={(e: number | null) => {
                  props.current.props.num = e;
                }}
                placeholder="请设置会签人数"
                addonBefore={<UserOutlined />}
                style={{ width: '60%' }}
              />
            </Form.Item>
          )}
        </div>
      </div>
      <Modal
        width="650px"
        title="添加身份"
        open={isOpen}
        destroyOnClose={true}
        onOk={() => {
          props.current.props.assignedUser = [
            { name: currentData.title, id: currentData.data.id },
          ];
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}>
        <IndentitySelect
          multiple={false}
          orgId={props.orgId}
          onChecked={(params: any) => {
            props.current.props.assignedUser = [
              { name: params.title, id: params.data.id },
            ];
            setCurrentData(params);
          }}
        />
      </Modal>
    </div>
  );
};
export default ApprovalNode;
