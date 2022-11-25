import React, { useState, useEffect } from 'react';
import { Modal, Radio, Card, Empty } from 'antd';
import SearchInput from '@/components/SearchInput';
import cls from './index.module.less';
// import { perpleList } from './mock';
import Provider from '@/ts/core/provider';
import { useAppwfConfig } from '@/module/flow/flow';
import BaseTarget from '@/ts/core/target/base';
/**
 * @description: 选择身份/选择岗位(内部、集团) 弹窗
 * @return {*}
 */

interface Iprops {
  open: boolean;
  title: string;
  onOk: () => void;
  onCancel: () => void;
}
const joinedCohorts = await Provider.getPerson.getJoinedCohorts();
const joinedInnerJob = await Provider.getPerson.getJoinedCohorts();
const joinedGroupJob = await Provider.getPerson.getJoinedCohorts();
const PersonCustomModal = (props: Iprops) => {
  const { open, title, onOk, onCancel } = props;
  const [jobType, setJobType] = useState(2);
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  let [selectItem, setSelectItem] = useState<any>({});
  const [joineds, setJoineds] = useState<any>([]);
  const [identitys, setIdentitys] = useState<any>([]);
  const onChange = (val: any) => {
    setJobType(val.target.value);
    switch (val.target.value) {
      case 2:
        setJoineds(joinedInnerJob);
        break;
      case 3:
        setJoineds(joinedGroupJob);
        break;
    }
  };

  const getAllIdentitys = async (select: BaseTarget) => {
    let identitys = await select.getAllIdentitys();
    setIdentitys(identitys);
    return identitys;
  };
  const selectItemFun = (select: BaseTarget) => {
    setSelectItem({ ...select });
    getAllIdentitys(select);
  };

  useEffect(() => {
    if (selectedNode.props.assignedType == 'DENTITY') {
      setJoineds(joinedCohorts);
    } else if (selectedNode.props.assignedType == 'JOB') {
      setJoineds(joinedInnerJob);
    }
  }, [selectedNode.props.assignedType]);

  const radiobutton = (
    <div>
      {selectedNode.props.assignedType == 'DENTITY' && (
        <Radio.Group value={1}>
          <Radio value={1}>按身份</Radio>
        </Radio.Group>
      )}
      {selectedNode.props.assignedType == 'JOB' && (
        <Radio.Group onChange={onChange} value={jobType}>
          <Radio value={2}>内部岗位</Radio>
          <Radio value={3}>集团岗位</Radio>
        </Radio.Group>
      )}
    </div>
  );
  const cardleft = () => {
    return (
      <Card style={{ width: 350 }}>
        <SearchInput onChange={onChange} />
        <div className={cls[`person-card-left`]}>
          {joineds.length > 0 &&
            joineds.map((item: BaseTarget) => {
              return (
                <div
                  key={item.target.id}
                  className={`${cls['person-card-left-item']} ${
                    selectItem.id === item.target.id ? cls['active'] : ''
                  } `}
                  onClick={() => {
                    selectItemFun(item);
                  }}>
                  {item.target.name}
                </div>
              );
            })}
          {joineds.length <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      </Card>
    );
  };

  const cardcenter = (
    <Card style={{ width: 350 }}>
      <SearchInput onChange={onChange} />
      <div className={cls['person-card-center']}>
        {identitys.length > 0 &&
          identitys.map((item: any) => {
            return (
              <div
                key={item.id}
                className={`${cls['person-card-left-item']} ${
                  selectItem.id === item.id ? cls['active'] : ''
                } `}
                onClick={() => {
                  // selectItemFun(item);
                }}>
                {item.name}
              </div>
            );
          })}
        {identitys.length <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </div>
    </Card>
  );
  const cardright = <Card style={{ width: 350 }}></Card>;

  const cardcontent = (
    <div className={cls[`person-card-content`]}>
      {cardleft()}
      {cardcenter}
      {cardright}
    </div>
  );
  return (
    <Modal
      title={title}
      centered
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={1200}
      getContainer={false}>
      <div className={cls[`person-custom-modal`]}>
        {radiobutton}
        {cardcontent}
      </div>
    </Modal>
  );
};
export default PersonCustomModal;
