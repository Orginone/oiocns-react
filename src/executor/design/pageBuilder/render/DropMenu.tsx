import { Dropdown } from 'antd';
import React, { ReactNode } from 'react';
import { DesignContext } from './PageContext';
import { PageElement } from '../core/PageElement';

interface IProps {
  ctx: DesignContext;
  element: PageElement;
  children: ReactNode;
}

const DropMenu: React.FC<IProps> = ({ ctx, element, children }) => {
  return (
    <div onContextMenu={(e) => e.stopPropagation()}>
      <Dropdown
        menu={{
          items: [
            { key: 'params', label: '配置参数' },
            { key: 'delete', label: '删除元素' },
          ],
          onClick: (info) => {
            switch (info.key) {
              case 'params':
                ctx.view.showProps = true;
                break;
              case 'delete':
                ctx.view.removeElement(element);
                break;
            }
          },
        }}
        trigger={['contextMenu']}>
        {children}
      </Dropdown>
    </div>
  );
};

export default DropMenu;
