import React, { useState } from 'react';
import { Tabs } from 'antd';
import cls from './index.module.less';
import Attribute from '../labelsModal/Attritube';
import FormRules from '../labelsModal/formRules';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/executor/tools/fullScreen';
import ReportView from '@/components/Common/ReportDesign';

interface IProps {
  current: IForm;
  finished: () => void;
}
const ReportModal: React.FC<IProps> = ({ current, finished }: IProps) => {
  console.log(current,'current')
  const [modalType, setModalType] = useState<string>(''); 
  const [selectedItem, setSelectedItem] = useState<any>(); // 当前选中
  const [sheetIndex, setSheetIndex] = useState<string>('0'); // tabs页签
  let sheetList: any = []
  console.log(JSON.parse(current.metadata?.rule), '1234')
  sheetList.push(JSON.parse(current.metadata?.rule))
  // const sheetList: any = current.metadata?.rule
  //   ? Object.values(JSON.parse(current.metadata?.rule))
  //   : [];

  // 切换分页
  const onChange = (key: string) => {
    setSheetIndex(key);
  };

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={current.typeName + '管理'}
      footer={[]}
      onCancel={finished}>
      <div className={cls[`dept-content-box`]}>
        <div className={cls['pages-wrap']}>
          <div className={cls['pages-wrap-left']}>
            <ReportView
              current={current}
              selectItem={sheetList[sheetIndex]}
              ></ReportView>
          </div>
          <div className={cls['pages-wrap-right']}>
            
          </div>
        </div>
        <div>
          <Tabs
            tabPosition={'bottom'}
            type="card"
            onChange={onChange}
            items={sheetList.map((it: any, index: number) => {
              return {
                label: it.name,
                key: index,
              };
            })}
          />
        </div>
      </div>
    </FullScreenModal>
  );
};

export default ReportModal;
