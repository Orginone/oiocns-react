import { Button, Space, message } from 'antd';
import React, { useState } from 'react';
import { DesignContext } from '../render/PageContext';
import FullScreenModal from '@/components/Common/fullScreen';
import ViewerManager from '../view/ViewerManager';
import { ViewerHost } from '../view/ViewerHost';

interface IProps {
  ctx: DesignContext;
}

const ToolBar: React.FC<IProps> = ({ ctx }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Space>
        <Button
          onClick={async () => {
            if (await ctx.view.update()) {
              message.success('更新成功！');
            }
          }}>
          保存
        </Button>
        <Button onClick={() => setVisible(true)}>预览</Button>
      </Space>
      {visible && (
        <FullScreenModal
          open
          centered
          width={'80vw'}
          bodyHeight={'80vh'}
          destroyOnClose
          title={'页面预览'}
          onCancel={() => setVisible(false)}>
          <ViewerHost ctx={{ view: new ViewerManager(ctx.view.pageInfo) }} />
        </FullScreenModal>
      )}
    </div>
  );
};

export default ToolBar;
