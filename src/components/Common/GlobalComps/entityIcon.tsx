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

interface shareIconInfo extends teamTypeInfo {
  share?: ShareIcon;
}

/** 实体图标 */
const EntityIcon = (info: teamTypeInfo) => {
  if (info.entity) {
    return (
      <ShareIconItem
        {...info}
        share={{
          name: info.entity.name,
          typeName: info.entity.typeName,
          avatar: parseAvatar(info.entity.icon),
        }}
      />
    );
  }
  const [share, setShare] = useState<ShareIcon>();
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
  }, []);
  return <ShareIconItem {...info} share={share} />;
};

/** 实体图标 */
const ShareIconItem = (info: shareIconInfo) => {
  const size = info.size ?? 22;
  const fontSize = size > 14 ? 14 : size;
  if (info.share) {
    if (info.share.avatar?.thumbnail) {
      return (
        <div style={{ cursor: 'pointer', display: 'contents' }} title={info.title ?? ''}>
          <Avatar size={size} src={info.share.avatar.thumbnail} />
          {info.showName && (
            <strong style={{ marginLeft: 6, fontSize: fontSize }}>
              {info.share.name}
            </strong>
          )}
        </div>
      );
    } else {
      const icon = (
        <TypeIcon
          avatar
          iconType={info.share.typeName || info.typeName || '其它'}
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
            <b style={{ marginLeft: 6, fontSize: fontSize }}>{info.share.name}</b>
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
        <strong style={{ marginLeft: 6, fontSize: fontSize }}>{info.entity?.id}</strong>
      )}
    </div>
  );
};

export default EntityIcon;
