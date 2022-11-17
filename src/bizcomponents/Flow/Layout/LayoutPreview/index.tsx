import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Node from '@/bizcomponents/Flow/Process/Node';
import { Modal } from 'antd';
type LayoutPreviewProps = {
  [key: string]: any;
};

/**
 *  预览
 * @returns
 */
const LayoutPreview = (props: LayoutPreviewProps, ref: any) => {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [designJson, setDesignJson] = useState('');
  useImperativeHandle(ref, () => ({
    preview: (design: any) => {
      openDialog(design);
    },
  }));
  const handleCancel = () => {
    setIsShowDialog(false);
  };
  const openDialog = (design: any) => {
    setIsShowDialog(true);
    console.log('预览');
    setDesignJson(JSON.stringify(Object.assign({}, design), null, 4));
    // state.isShowDialog = true;
    // state.design = Object.assign({}, design);
    // state.designJson = JSON.stringify(design, null, 4)
  };
  return (
    <div>
      <Modal
        open={isShowDialog}
        footer={null}
        onCancel={handleCancel}
        title={'预览'}
        width="800px">
        <pre
          style={{
            fontFamily: 'Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace',
            fontSize: '14px',
          }}>
          {designJson}
        </pre>
      </Modal>
    </div>
  );
};

export default forwardRef(LayoutPreview);
