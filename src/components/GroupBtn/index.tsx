import { Button, Divider, Space } from 'antd';
import React from 'react';
interface BtnItemType {
  text: string;
  key?: string;
  type?: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined;
  className?: string;
  onClick?: Function;
}
interface IProps {
  onClick?: Function;
  showDivider?: boolean;
  list: BtnItemType[];
}

/*******
 * @desc:按钮组 统一组件
 */
export const GroupBtn: React.FC<IProps> = ({ list, showDivider = true, onClick }) => {
  return (
    <Space>
      {list.map((item: BtnItemType, index: number) => {
        return (
          <div key={index}>
            <Button
              className={item.className}
              type={item.type || 'link'}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (onClick) {
                  onClick({ text: item.text, key: item?.key });
                }
              }}>
              {item.text}
            </Button>
            {showDivider && index === list.length - 1 && (
              <Divider key={'Divider' + index} type="vertical" />
            )}
          </div>
        );
      })}
    </Space>
  );
};
