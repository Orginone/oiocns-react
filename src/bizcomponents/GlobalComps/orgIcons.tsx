import React from 'react';
import { Avatar } from 'antd';

interface IProps {
  chat?: boolean;
  market?: boolean;
  home?: boolean;
  store?: boolean;
  work?: boolean;
  exit?: boolean;
  selected?: boolean;
  size?: number;
  title?: string;
  type?: string;
}

const OrgIcons = (props: IProps) => {
  const size = props.size ?? 22;
  let svgName = 'home';
  if (props.chat) {
    svgName = 'chat';
  } else if (props.work) {
    svgName = 'work';
  } else if (props.exit) {
    svgName = 'exit';
  } else if (props.market) {
    svgName = 'market';
  } else if (props.store) {
    svgName = 'store';
  } else if (props.type) {
    svgName = props.type;
  }
  if (props.selected) {
    svgName += '-select';
  }
  return (
    <Avatar
      size={size}
      src={`/svg/${svgName}.svg`}
      style={{ background: 'transparent', color: '#606060' }}
    />
  );
};

export default OrgIcons;
