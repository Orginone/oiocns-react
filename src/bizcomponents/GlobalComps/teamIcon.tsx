import React from 'react';
import { TargetType } from '@/ts/core';
import * as im from 'react-icons/im';
import { FileItemShare } from '@/ts/base/model';
import { Avatar } from 'antd';
import { AvatarSize } from 'antd/lib/avatar/SizeContext';

interface teamTypeInfo {
  size?: AvatarSize;
  avatar?: FileItemShare;
  typeName: TargetType | string;
}

/** 组织图标 */
const TeamIcon = (info: teamTypeInfo) => {
  if (info.avatar) {
    return <Avatar size={info.size ?? 22} src={info.avatar.thumbnail} />;
  }
  switch (info.typeName) {
    case TargetType.Group:
      return <im.ImTree />;
    case TargetType.Company:
      return <im.ImOffice />;
    case TargetType.Section:
    case TargetType.Department:
      return <im.ImLibrary />;
    case TargetType.Laboratory:
      return <im.ImJoomla />;
    case TargetType.Office:
      return <im.ImBriefcase />;
    case TargetType.Research:
      return <im.ImFlickr4 />;
    case TargetType.Working:
      return <im.ImUsers />;
    case TargetType.Cohort:
      return <im.ImBubbles />;
    case TargetType.Person:
      return <im.ImUser />;
    default:
      return <im.ImSvg />;
  }
};

export default TeamIcon;
