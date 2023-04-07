import React, { useState } from 'react';
import { TargetType } from '@/ts/core';
import * as im from 'react-icons/im';
import { TargetShare } from '@/ts/base/model';
import { Avatar, Image } from 'antd';

interface teamTypeInfo {
  preview?: boolean;
  size?: number;
  fontSize?: number;
  share: TargetShare;
  notAvatar?: boolean;
}

/** 组织图标 */
const TeamIcon = (info: teamTypeInfo) => {
  const [preview, setPreview] = useState(false);
  const size = info.size ?? 22;
  const fontSize = info.fontSize ?? 18;
  if (info.share?.avatar && info.share?.avatar.thumbnail) {
    return (
      <div style={{ cursor: 'pointer', display: 'inline-block' }} title="点击预览">
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
      </div>
    );
  }
  let icon;
  switch (info.share?.typeName) {
    case '平台':
    case TargetType.Group:
      icon = <im.ImTree fontSize={fontSize} />;
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
      icon = <im.ImUserTie fontSize={fontSize} />;
      break;
    default:
      icon = <im.ImSvg fontSize={fontSize} />;
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

export default TeamIcon;
