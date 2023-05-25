import React, { useState } from 'react';
import * as im from 'react-icons/im';
import { ShareIcon } from '@/ts/base/model';
import { Avatar, Image } from 'antd';
import { TargetType } from '@/ts/core';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';
interface teamTypeInfo {
  preview?: boolean;
  size?: number;
  fontSize?: number;
  share: ShareIcon;
  notAvatar?: boolean;
  title?: string;
  tabbar?: boolean;
  selected?: boolean;
  type?: string;
}

/** 组织图标 */
const EntityIcon = (info: teamTypeInfo) => {
  console.log(info);
  const [preview, setPreview] = useState(false);
  const size = info.size ?? 22;
  const fontSize = info.fontSize ?? 18;
  let svgName = info.type
  if (info.selected) {
    svgName += '-select';
  }
  if (info.share?.avatar && info.share?.avatar.thumbnail) {
    return (
      <div
        style={{ cursor: 'pointer', display: 'inline-block', position: "relative" }}
        title={info.title ?? '点击预览'}>
        {info.preview && (
          <Image
            style={{ display: 'none' }}
            preview={{
              visible: preview,
              src: info.share.avatar.shareLink,
              onVisibleChange: (value) => {
                setPreview(value);
              },
            }}
          />
        )}
        <Avatar
          size={size}
          src={info.share.avatar.thumbnail}
          onClick={() => {
            setPreview(true);
          }}
        />
        {svgName ? <div style={{ position: 'absolute', zIndex: 999, bottom: '20%', height: '24%', width: '40%', right: 0, background: "#FFF",borderRadius:'3px' }}>
          <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <img style={{ height: '100%', position: 'absolute' }} src={`/svg/${svgName}.svg`} alt="" />
          </div>
        </div> : ''}

      </div>
    );
  }
  let icon;
  switch (info.share?.typeName) {
    case '平台':
    case TargetType.Group:
      icon = <im.ImTree fontSize={fontSize} />;
      break;
    case '权限':
      icon = <im.ImAddressBook fontSize={fontSize} />;
      break;
    case '字典':
      icon = <im.ImBook fontSize={fontSize} />;
      break;
    case '属性':
      icon = <im.ImJoomla fontSize={fontSize} />;
      break;
    case '表单':
      icon = <im.ImInsertTemplate fontSize={fontSize} />;
      break;
    case TargetType.Company:
      icon = <im.ImOffice fontSize={fontSize} />;
      break;
    case TargetType.Section:
    case TargetType.Department:
      return <im.ImLibrary fontSize={fontSize} />;
    case TargetType.College:
      return <im.ImTrophy fontSize={fontSize} />;
    case TargetType.Laboratory:
      icon = <im.ImJoomla fontSize={fontSize} />;
      break;
    case TargetType.Office:
      icon = <im.ImBriefcase fontSize={fontSize} />;
      break;
    case TargetType.Research:
      icon = <im.ImFlickr4 fontSize={fontSize} />;
      break;
    case TargetType.Working:
      icon = <im.ImUsers fontSize={fontSize} />;
      break;
    case TargetType.Station:
      icon = <im.ImAddressBook fontSize={fontSize} />;
      break;
    case TargetType.Cohort:
      icon = <im.ImBubbles fontSize={fontSize} />;
      break;
    case TargetType.Person:
      if (info.tabbar) {
        icon = <OrgIcons
          size={26}
          type={"setting"}
          selected={location.hash.startsWith('#' + '/setting')}
        />;
      } else {
        icon = <im.ImUserTie fontSize={fontSize} />;
      }
      break;
    default:
      icon = <im.ImTree fontSize={fontSize} />;
      break;
  }
  if (info.notAvatar) {
    return icon;
  }
  return (
    <Avatar
      size={size}
      icon={icon}
      style={{ background: 'transparent', color: '#606060' }}
    />
  );
};

export default EntityIcon;
