import React, { useState } from 'react';
import { TargetType } from '@/ts/core';
import * as im from 'react-icons/im';
import { FileItemShare } from '@/ts/base/model';
import { Avatar, Image } from 'antd';
import { AvatarSize } from 'antd/lib/avatar/SizeContext';

interface teamTypeInfo {
  preview?: boolean;
  size?: AvatarSize;
  avatar?: FileItemShare;
  typeName: TargetType | string;
}

/** 组织图标 */
const TeamIcon = (info: teamTypeInfo) => {
  const [preview, setPreview] = useState(false);
  if (info.avatar) {
    return (
      <div style={{ cursor: 'pointer' }} title="点击预览">
        {info.preview && (
          <Image
            style={{ display: 'none' }}
            preview={{
              visible: preview,
              src: info.avatar.shareLink,
              onVisibleChange: (value) => {
                setPreview(value);
              },
            }}
          />
        )}
        <Avatar
          size={info.size ?? 22}
          src={info.avatar.thumbnail}
          onClick={() => {
            setPreview(true);
          }}
        />
      </div>
    );
  }
  let icon;
  switch (info.typeName) {
    case TargetType.Group:
      icon = <im.ImTree />;
      break;
    case TargetType.Company:
      icon = <im.ImOffice />;
      break;
    case TargetType.Section:
    case TargetType.Department:
      icon = <im.ImLibrary />;
      break;
    case TargetType.Laboratory:
      icon = <im.ImJoomla />;
      break;
    case TargetType.Office:
      icon = <im.ImBriefcase />;
      break;
    case TargetType.Research:
      icon = <im.ImFlickr4 />;
      break;
    case TargetType.Working:
      icon = <im.ImUsers />;
      break;
    case TargetType.Cohort:
      icon = <im.ImBubbles />;
      break;
    case TargetType.Person:
      icon = <im.ImUserTie />;
      break;
    default:
      icon = <im.ImSvg />;
      break;
  }
  return (
    <Avatar
      size={info.size ?? 24}
      icon={icon}
      style={{ background: 'transparent', color: '#606060' }}
    />
  );
};

export default TeamIcon;
