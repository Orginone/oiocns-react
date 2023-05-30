import React, { useState } from 'react';
import { Modal } from 'antd';
import './index.less';

interface indexType<T extends string> {
  modalType: T;
  EditData: any;
  setOperateModel: (type: T) => void;
  onModalCancel: () => void;
  onModalOk: (modalType: T, data?: any) => void;
  setChangeData?: (data: any) => void;
}
const Index: React.FC<indexType<string>> = ({
  modalType,
  EditData,
  onModalOk,
  onModalCancel,
  setChangeData,
}) => {
  console.log('打印index');
  const [modalData, setModalData] = useState({});

  return (
    <>
      {['Edit', 'EditMore', 'Add'].includes(modalType) ?? (
        <Modal
          open={true}
          onOk={() => {
            onModalOk && onModalOk(modalType, modalData);
          }}
          onCancel={() => {
            onModalCancel && onModalCancel();
          }}
          destroyOnClose={true}
          cancelText={'关闭'}
          width={1000}>
          <OioForm
            form={form}
            define={current}
            fieldsValue={modalType === 'Edit' ? EditData : undefined}
            onValuesChange={(_changeValue, values) => setModalData(values)}
            noRule={modalType.includes('Edit')}
          />
        </Modal>
      )}
      <Modal
        open={true}
        onOk={() => {}}
        onCancel={() => {
          onModalCancel && onModalCancel();
        }}
        destroyOnClose={true}
        cancelText={'关闭'}
        width={1000}>
        {/* <Thing
      keyExpr="Id"
      height={500}
      selectable
      labels={labels}
      propertys={propertys}
      onSelected={setRows}
      belongId={belongId}
    /> */}
      </Modal>
    </>
  );
};

export default Index;
