import React from 'react';
import { Avatar, Image } from 'antd';

interface IProps {
  chat?: boolean;
  market?: boolean;
  home?: boolean;
  store?: boolean;
  work?: boolean;
  activity?: boolean;
  exit?: boolean;
  setting?: boolean;
  relation?: boolean;
  myWork?: boolean;
  workDone?: boolean;
  workStart?: boolean;
  selected?: boolean;
  size?: number;
  title?: string;
  type?: string;
  css?: React.CSSProperties;
  notAvatar?: boolean;
  className?: string;
  onClick?:
    | ((e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void)
    | undefined;
}

const OrgIcons = (props: IProps) => {
  const size = props.size ?? 22;
  let svgName = 'home';
  if (props.chat) {
    svgName = 'chat';
  } else if (props.work) {
    svgName = 'work';
  } else if (props.setting) {
    svgName = 'setting';
  } else if (props.relation) {
    svgName = 'relation';
  } else if (props.exit) {
    svgName = 'exit';
  } else if (props.market) {
    svgName = 'market';
  } else if (props.store) {
    svgName = 'store';
  } else if (props.activity) {
    svgName = 'activity';
  } else if (props.workDone) {
    svgName = 'workDone';
  } else if (props.myWork) {
    svgName = 'myWork';
  } else if (props.workStart) {
    svgName = 'workStart';
  } else if (props.type) {
    svgName = props.type;
  }
  if (props.selected) {
    svgName += '-select';
  }
  if (props.notAvatar) {
    return (
      <Image
        className={props.className}
        preview={false}
        height={size}
        width={size}
        title={props.title}
        src={`/svg/${svgName}.svg`}
        style={props.css}
        onClick={props.onClick}
      />
    );
  } else {
    return (
      <Avatar
        size={size}
        className={props.className}
        src={`/svg/${svgName}.svg`}
        onClick={props.onClick}
        style={{ background: 'transparent', color: '#606060', ...props.css }}
      />
    );
  }
};

export default OrgIcons;
