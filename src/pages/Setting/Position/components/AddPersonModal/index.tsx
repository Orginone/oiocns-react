import React, { useState } from 'react';
import { Modal, Card, Row, Col, Checkbox, Button } from 'antd';
import SearchInput from '@/components/SearchInput';
import cls from './index.module.less';
import { CloseCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { deptList } from './mock';
import { deepClone } from '@/ts/base/common';
import { initDatatype } from '@/ts/core/setting/isetting';

interface Iprops {
  title: string;
  open: boolean;
  onOk: (params: initDatatype[]) => void;
  handleOk: () => void;
}

const AddPersonModal = (props: Iprops) => {
  const { title, open, onOk, handleOk } = props;
  const [initData, setInitData] = useState(deptList);
  let [openIdArr, setOpenIDArr] = useState<Array<string>>([]);
  const [checkUser, setCheckUser] = useState<initDatatype[]>([]);
  // 点击展开收起
  const toggle = (selectId: string) => {
    if (openIdArr.includes(selectId)) {
      const newArr = openIdArr.filter((item) => item !== selectId);
      setOpenIDArr(newArr);
    } else {
      setOpenIDArr([...openIdArr, selectId]);
    }
  };

  const onChange = (val: any, id: string, name: string) => {
    let currentValue, currentInitData;
    currentInitData = deepClone(initData);
    initData.forEach((item) => {
      item.children.map((innerItem) => {
        if (innerItem.id === id) {
          innerItem.checked = val.target.checked;
        }
      });
    });
    if (val.target.checked) {
      currentValue = deepClone(checkUser);
      setInitData(initData);
      currentValue.push({ checked: val.target.checked, id, name });
    } else {
      currentValue = checkUser.filter((item) => {
        return !(item.id === id);
      });
    }
    setCheckUser(currentValue);
  };

  const cardLeft = (
    <Card>
      <SearchInput placeholder="请输入角色姓名、岗位" onChange={onChange} />
      <div className={cls[`cardleft-dept-overflow`]}>
        {initData.map((item): any => {
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
                        <Checkbox
                          checked={child.checked}
                          onChange={(e) => onChange(e, child.id, child.name)}>
                          {child.name}
                        </Checkbox>
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
          <Col span={12}>
            <Card>
              <Row>已选{checkUser.length}位用户</Row>
              <Row>
                <div className={cls[`checklist`]}>
                  {checkUser.map((item) => {
                    return (
                      <div className={cls['checklist-item']}>
                        <Checkbox value={item.checked} onChange={() => {}}>
                          {item.name}
                        </Checkbox>
                        <CloseCircleOutlined
                          className={cls[`checklist-item-deleteicon`]}
                          onClick={() => {
                            const currentValue = checkUser.filter((innerItem) => {
                              return !(innerItem.id === item.id);
                            });
                            setCheckUser(currentValue);
                            let currentInitData = deepClone(initData);
                            currentInitData.forEach((init) => {
                              init.children.map((innerinit) => {
                                if (innerinit.id === item.id) {
                                  innerinit.checked = false;
                                }
                              });
                            });
                            setInitData(currentInitData);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <Row justify="end">
        <Button
          type="primary"
          onClick={() => {
            onOk(checkUser);
          }}>
          完成
        </Button>
      </Row>
    </Modal>
  );
  return <div className={cls[`add-person-modal`]}>{addmodal}</div>;
};
export default AddPersonModal;
