import React from 'react';
import { Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import { RiMore2Fill } from 'react-icons/ri';
import { TextBox } from 'devextreme-react';

interface IProps {
  value: string;
  menus: MenuProps;
  rightBars?: React.ReactNode;
  onValueChanged: (value: string) => void;
}
/** 标签条 */
const SearchBar: React.FC<IProps> = (props) => {
  const items = props.menus.items || [];
  const outside = items.filter((item: any) => item.model === 'outside');
  const inside = items.filter((item: any) => item.model != 'outside');
  return (
    <div className="inventory-search-area">
      <div style={{ width: '100%' }}>
        <TextBox
          width="100%"
          mode="search"
          placeholder="搜索"
          showClearButton
          value={props.value}
          stylingMode="filled"
          valueChangeEvent="input"
          onValueChanged={(e) => {
            props.onValueChanged(e.value ?? '');
          }}
        />
      </div>
      <Space size={6}>
        {props.rightBars && props.rightBars}
        {outside.length > 0 &&
          outside.map((item: any) => {
            return (
              <Typography.Link
                key={item.key}
                title={item.label}
                style={{ fontSize: 18 }}
                onClick={() => {
                  props.menus.onClick?.apply(this, [item]);
                }}>
                {item.icon}
              </Typography.Link>
            );
          })}
        {inside.length > 0 && (
          <Dropdown
            menu={{
              items: inside,
              onClick: props.menus.onClick,
            }}
            dropdownRender={(menu) => (
              <div>{menu && <Button type="link">{menu}</Button>}</div>
            )}
            placement="bottom"
            trigger={['click', 'contextMenu']}>
            <RiMore2Fill fontSize={22} style={{ cursor: 'pointer' }} />
          </Dropdown>
        )}
      </Space>
    </div>
  );
};
export default SearchBar;
