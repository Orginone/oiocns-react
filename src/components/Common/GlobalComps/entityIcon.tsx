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
  if (share?.avatar && share?.avatar.thumbnail) {
    return (
      <div style={{ cursor: 'pointer', display: 'contents' }} title={info.title ?? ''}>
        <Avatar size={size + 6} src={share.avatar.thumbnail} />
        {info.showName && <b style={{ marginLeft: 6 }}>{share.name}</b>}
      </div>
    );
  }
  const icon = (
    <TypeIcon avatar iconType={info.typeName || share?.typeName || '其它'} size={size} />
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
      {info.showName && <b style={{ marginLeft: 6 }}>{share?.name}</b>}
    </div>
  );
};

export default EntityIcon;
