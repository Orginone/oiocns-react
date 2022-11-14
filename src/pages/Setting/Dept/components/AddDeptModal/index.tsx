import React, { useState } from 'react';
import { Modal, Card, Row, Col, Checkbox, Button } from 'antd';
import SearchInput from '@/components/SearchInput';
import cls from './index.module.less';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { deptList, deptArrList } from './mock';

interface Iprops {
  title: string;
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
}

const AddDeptModal = (props: Iprops) => {
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

  const cardLeft = (
    <Card>
      <SearchInput placeholder="请输入姓名、账号" onChange={onChange} />
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
      <Row justify="end">
        <span>已选{3}位用户</span>
      </Row>
    </Card>
  );
  const cardRight = (
    <Card>
      <SearchInput placeholder="请输入岗位" onChange={onChange} />
      <div className={cls[`cardright-dept-voerflow`]}>
        {deptArrList.map((item) => {
          return (
            <div key={item.id} className={cls[`cardright-dept`]}>
              <span className={cls[`cardright-dept-title-name`]}>{item.name}</span>
              <div className={cls[`cardright-item`]}>
                {item.children.map((child) => {
                  return (
                    <div key={child.id} className={cls[`cardright-item-children`]}>
                      {child.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
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
export default AddDeptModal;
