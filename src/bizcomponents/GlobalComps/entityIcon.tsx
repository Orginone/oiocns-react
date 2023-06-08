import React, { useEffect, useState } from 'react';
import * as im from 'react-icons/im';
import { Avatar, Image } from 'antd';
import { TargetType } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { ShareIcon } from '@/ts/base/model';

interface teamTypeInfo {
  preview?: boolean;
  size?: number;
  entityId: string;
  typeName?: string;
  notAvatar?: boolean;
  title?: string;
  showName?: boolean;
}

/** 组织图标 */
const EntityIcon = (info: teamTypeInfo) => {
  const [preview, setPreview] = useState(false);
  const [share, setShare] = useState<ShareIcon>();
  const size = info.size ?? 22;
  useEffect(() => {
    if (info.entityId && info.entityId.length > 10) {
      orgCtrl.user.findShareAsync(info.entityId).then((value) => {
        setShare(value);
      });
    }
  }, []);
  if (share?.avatar && share?.avatar.thumbnail) {
    return (
      <div
        style={{ cursor: 'pointer', display: 'contents' }}
        title={info.title ?? '点击预览'}>
        {info.preview && (
          <Image
            style={{ display: 'none' }}
            preview={{
              visible: preview,
              src: share.avatar.shareLink,
              onVisibleChange: (value) => {
                setPreview(value);
              },
            }}
          />
        )}
        <Avatar
          size={size}
          src={share.avatar.thumbnail}
          onClick={() => {
            setPreview(true);
          }}
        />
        {info.showName && <strong style={{ marginLeft: 6 }}>{share.name}</strong>}
      </div>
    );
  }
  let icon;
  switch (info.typeName || share?.typeName) {
    case '平台':
    case TargetType.Group:
      icon = <im.ImTree fontSize={size} />;
      break;
    case '权限':
      icon = <im.ImAddressBook fontSize={size} />;
      break;
    case '字典':
      icon = <im.ImBook fontSize={size} />;
      break;
    case '属性':
      icon = <im.ImJoomla fontSize={size} />;
      break;
    case '表单':
      icon = <im.ImInsertTemplate fontSize={size} />;
      break;
    case TargetType.Company:
      icon = <im.ImOffice fontSize={size} />;
      break;
    case TargetType.Section:
    case TargetType.Department:
      return <im.ImLibrary fontSize={size} />;
    case TargetType.College:
      return <im.ImTrophy fontSize={size} />;
    case TargetType.Laboratory:
      icon = <im.ImJoomla fontSize={size} />;
      break;
    case TargetType.Office:
      icon = <im.ImBriefcase fontSize={size} />;
      break;
    case TargetType.Research:
      icon = <im.ImFlickr4 fontSize={size} />;
      break;
    case TargetType.Working:
      icon = <im.ImUsers fontSize={size} />;
      break;
    case TargetType.Station:
      icon = <im.ImAddressBook fontSize={size} />;
      break;
    case TargetType.Cohort:
      icon = <im.ImBubbles fontSize={size} />;
      break;
    case TargetType.Person:
      icon = <im.ImUserTie fontSize={size} />;
      break;
    default:
      icon = <im.ImTree fontSize={size} />;
      break;
  }
  if (info.notAvatar) {
    return icon;
  }
  return (
    <div style={{ display: 'contents' }}>
      <Avatar
        size={size}
        icon={icon}
        style={{ background: 'transparent', color: '#606060' }}
      />
      {info.showName && <strong style={{ marginLeft: 6 }}>{share?.name}</strong>}
    </div>
  );
};

export default EntityIcon;
