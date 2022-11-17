import React, { useState, useEffect } from 'react';
import { Modal, Radio, Card, Empty } from 'antd';
import SearchInput from '@/components/SearchInput';
import cls from './index.module.less';
import { perpleList } from './mock';
import provider from '@/ts/core/provider';
/**
 * @description: 选择人员弹窗
 * @return {*}
 */

interface Iprops {
  open: boolean;
  title: string;
  onOk: () => void;
  onCancel: () => void;
}

const joinedCohorts = (await provider.getPerson().getJoinedCohorts()).map(
  (e: any) => e.target,
);
const PersonCustomModal = (props: Iprops) => {
  const { open, title, onOk, onCancel } = props;

  let [selectItem, setSelectItem] = useState<any>({});
  const onChange = (val: any) => {
    console.log(val);
  };
  const selectItemFun = (select: any) => {
    setSelectItem({ ...select });
  };

  console.log(joinedCohorts);
  const radiobutton = <Radio checked>按身份</Radio>;
  // let identitys: any[];
  // const getIdentitys =  () => {
  //
  //   identitys = await provider.getPerson().getIdentitys();
  // };
  // useEffect(() => {
  //   getIdentitys();
  // }, []);
  const cardleft = () => {
    return (
      <Card style={{ width: 350 }}>
        <SearchInput onChange={onChange} />
        <div className={cls[`person-card-left`]}>
          {joinedCohorts.length > 0 &&
            joinedCohorts.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`${cls['person-card-left-item']} ${
                    selectItem.id === item.id ? cls['active'] : ''
                  } `}
                  onClick={() => {
                    selectItemFun(item);
                  }}>
                  {item.name}
                </div>
              );
            })}
          {joinedCohorts.length <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      </Card>
    );
  };

  const cardcenter = (
    <Card style={{ width: 350 }}>
      <SearchInput onChange={onChange} />
      <div className={cls['person-card-center']}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
