import { Button, Divider, Space } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React from 'react';
interface BtnItemType {
  text: string;
  key?: string;
  size?: SizeType;
  danger?: boolean;
  icon?: React.ReactNode;
  onClick?: Function;
  className?: string;
  type?: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined;
}
interface IProps {
  onClick?: Function;
  showDivider?: boolean;
  list: BtnItemType[];
}

/*******
 * @desc:按钮组 统一组件
 */
const GroupBtn: React.FC<IProps> = ({ list, showDivider = true, onClick }) => {
  return (
    <Space>
      {list.map((item: BtnItemType, index: number) => {
        return (
          <div key={index}>
            <Button
              icon={item.icon}
              size={item.size}
              danger={item.danger}
              type={item.type || 'link'}
              className={item.className}
              style={{ margin: 5 }}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (onClick) {
                  onClick({ text: item.text, key: item?.key });
                }
              }}>
              {item.text}
            </Button>
          </div>
        );
      })}
      {showDivider && <Divider key={'Divider' + list.length} type="vertical" />}
    </Space>
  );
};

export default GroupBtn;
