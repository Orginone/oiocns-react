import React, { useState } from 'react';
import { AiOutlineSetting, AiOutlineUser } from '@/icons/ai';
import { Row, Button, Divider, Col, Radio, Space, Form, InputNumber } from 'antd';
import cls from './index.module.less';
import { NodeModel } from '@/components/Common/FlowDesign/processType';
import ShareShowComp from '@/components/Common/ShareShowComp';
import { IBelong } from '@/ts/core';
import SelectIdentity from '@/components/Common/SelectIdentity';
interface IProps {
  current: NodeModel;
  belong: IBelong;
}

/**
 * @description: 审批对象
 * @return {*}
 */

const ApprovalNode: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [radioValue, setRadioValue] = useState(props.current.num == 0 ? 1 : 2);

  const [currentData, setCurrentData] = useState({
    id: props.current.destId,
    name: props.current.destName,
  });

  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择审批对象</span>
        </Row>
        <Space>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setIsOpen(true);
            }}>
            选择角色
          </Button>
        </Space>
        <div>
          {currentData.id ? (
            <ShareShowComp
              departData={[{ id: props.current.destId, name: props.current.destName }]}
              deleteFuc={(_) => {
                props.current.destId = '';
                props.current.destName = '';
                setCurrentData({ id: '', name: '' });
              }}></ShareShowComp>
          ) : null}
        </div>
        <Divider />
        <div className={cls['roval-node-select']}>
          <Col className={cls['roval-node-select-col']}>👩‍👦‍👦 审批方式</Col>
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
                  props.current.num = e || 1;
                }}
                value={props.current.num}
                placeholder="请设置会签人数"
                addonBefore={<AiOutlineUser />}
                style={{ width: '60%' }}
              />
            </Form.Item>
          )}
        </div>
      </div>
      <Divider />
      <SelectIdentity
        multiple={false}
        space={props.belong}
        open={isOpen}
        exclude={[]}
        finished={(selected) => {
          if (selected.length > 0) {
            const item = selected[0];
            props.current.destType = '身份';
            props.current.destId = item.id;
            props.current.destName = item.name;
            setCurrentData(item);
          }
          setIsOpen(false);
        }}
      />
    </div>
  );
};
export default ApprovalNode;
