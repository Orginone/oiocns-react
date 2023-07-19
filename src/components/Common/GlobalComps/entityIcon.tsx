import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import orgCtrl from '@/ts/controller';
import { ShareIcon } from '@/ts/base/model';
import { parseAvatar, schema } from '@/ts/base';
import TypeIcon from './typeIcon';

interface teamTypeInfo {
  size?: number;
  entityId?: string;
  entity?: schema.XEntity;
  typeName?: string;
  notAvatar?: boolean;
  title?: string;
  showName?: boolean;
}

/** 组织图标 */
const EntityIcon = (info: teamTypeInfo) => {
  const [share, setShare] = useState<ShareIcon>();
  const size = info.size ?? 22;
  const fontSize = size > 14 ? 14 : size;
  useEffect(() => {
    if (info.entityId && info.entityId.length > 10) {
      orgCtrl.user.findEntityAsync(info.entityId).then((value) => {
        if (value) {
          setShare({
            name: value.name,
            typeName: value.typeName,
            avatar: parseAvatar(value.icon),
          });
        }
      });
    }
    if (info.entity) {
      setShare({
        name: info.entity.name,
        typeName: info.entity.typeName,
        avatar: parseAvatar(info.entity.icon),
      });
    }
  }, []);
  if (share) {
    if (share.avatar?.thumbnail) {
      return (
        <div style={{ cursor: 'pointer', display: 'contents' }} title={info.title ?? ''}>
          <Avatar size={size} src={share.avatar.thumbnail} />
          {info.showName && (
            <strong style={{ marginLeft: 6, fontSize: fontSize }}>{share.name}</strong>
          )}
        </div>
      );
    } else {
      const icon = (
        <TypeIcon
          avatar
          iconType={share.typeName || info.typeName || '其它'}
          size={size}
        />
      );
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
          {info.showName && (
            <b style={{ marginLeft: 6, fontSize: fontSize }}>{share.name}</b>
          )}
        </div>
      );
    }
  }
  return (
    <div style={{ cursor: 'pointer', display: 'contents' }} title={info.title ?? ''}>
      <Avatar
        size={size}
        icon={<TypeIcon avatar iconType={'其它'} size={size} />}
        style={{ background: 'transparent', color: '#606060' }}
      />
      {info.showName && (
        <strong style={{ marginLeft: 6, fontSize: fontSize }}>{info.entityId}</strong>
      )}
    </div>
  );
};

export default EntityIcon;
