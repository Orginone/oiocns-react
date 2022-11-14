import React, { useState } from 'react';
import { Modal, Card, Row, Col, Checkbox, Button } from 'antd';
import SearchInput from '@/components/SearchInput';
import cls from './index.module.less';
import { CloseCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { deptList } from './mock';

interface Iprops {
  title: string;
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
}

const AddPersonModal = (props: Iprops) => {
  const { title, open, onOk, handleOk } = props;
  let [openIdArr, setOpenIDArr] = useState<Array<string>>([]);
  // 点击展开收起
  const toggle = (selectId: string) => {
    if (openIdArr.includes(selectId)) {
      const newArr = openIdArr.filter((item) => item !== selectId);
      setOpenIDArr(newArr);
    } else {
      setOpenIDArr([...openIdArr, selectId]);
    }
  };
  const onChange = (val: any) => {
    console.log('1111111', val);
  };

  const checklist = (
    <div className={cls[`checklist`]}>
      <div className={cls['checklist-item']}>
        <Checkbox onChange={onChange}>Checkbox1</Checkbox>
        <CloseCircleOutlined className={cls[`checklist-item-deleteicon`]} />
      </div>
      <div className={cls['checklist-item']}>
        <Checkbox onChange={onChange}>Checkbox2</Checkbox>
        <CloseCircleOutlined className={cls[`checklist-item-deleteicon`]} />
      </div>
      <div className={cls['checklist-item']}>
        <Checkbox onChange={onChange}>Checkbox3</Checkbox>
        <CloseCircleOutlined className={cls[`checklist-item-deleteicon`]} />
      </div>
    </div>
  );
  const cardLeft = (
    <Card>
      <SearchInput placeholder="请输入角色姓名、部门" onChange={onChange} />
      <div className={cls[`cardleft-dept-overflow`]}>
        {deptList.map((item): any => {
          return (
            <div key={item.id} className={cls[`cardleft-dept`]}>
              <div
                className={cls[`cardleft-dept-title`]}
                onClick={() => {
                  toggle(item.id);
                }}>
                <span className={cls[`cardleft-dept-title-name`]}>{item.name}</span>
                <span className={cls[`cardleft-dept-title-icon`]}>
                  {openIdArr.includes(item.id) ? <UpOutlined /> : <DownOutlined />}
                </span>
              </div>
              {openIdArr.includes(item.id) ? (
                <div className={cls[`cardleft-item`]}>
                  {item.children.map((child) => {
                    return (
                      <div className={cls[`cardleft-item-children`]} key={child.id}>
                        <Checkbox onChange={onChange}>{child.name}</Checkbox>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
  const cardRight = (
    <Card>
      <Row>已选{3}位用户</Row>
      <Row>{checklist}</Row>
    </Card>
  );
  const addmodal = (
    <Modal
      title={title}
      open={open}
      onCancel={handleOk}
      getContainer={false}
      width={600}
      footer={null}>
      <div className="site-card-wrapper">
        <Row gutter={24}>
          <Col span={12}>{cardLeft}</Col>
          <Col span={12}>{cardRight}</Col>
        </Row>
      </div>
      <Row justify="end">
        <Button
          type="primary"
          onClick={() => {
            onOk();
          }}>
          完成
        </Button>
      </Row>
    </Modal>
  );
  return <div className={cls[`add-person-modal`]}>{addmodal}</div>;
};
export default AddPersonModal;
