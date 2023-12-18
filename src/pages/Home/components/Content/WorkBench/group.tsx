import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import FullScreenModal from '@/components/Common/fullScreen';
import { schema } from '@/ts/base';
import { IFile } from '@/ts/core';
import { Button } from 'antd';
import { Sortable, TextBox } from 'devextreme-react';
import React, { useState } from 'react';

interface IProps {
  preGroups: any;
  commons: schema.XCommon[];
  onClose: (commons: schema.XCommon[]) => void;
}

const CommonGroups: React.FC<IProps> = ({ onClose, preGroups, commons }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [groups, setGroups] = useState(preGroups);

  const loadCommons = () => {
    const commons: schema.XCommon[] = [];
    Object.keys(groups).map((groupName) => {
      groups[groupName].forEach((item: any) => {
        commons.push(item.common);
      });
    });
    return commons;
  };
  // 加载常用
  const loadCommonCard = (item: IFile) => (
    <div className="appCard" key={item.key}>
      <EntityIcon entity={item.metadata} size={35} />
      <div className="appName">{item.typeName}</div>
      <div className="appName">{item.name}</div>
      <div className="teamName">{item.directory.target.name}</div>
      <div className="teamName">{item.directory.target.space.name}</div>
    </div>
  );
  // 加载多个应用
  const loadMultAppCards = (title: string, apps: any[]) => {
    return (
      <div key={title}>
        <div className="appGroup-title">{title}</div>
        <Sortable
          group="commons"
          data={title}
          className="cardItem-sortable"
          dragDirection="both"
          itemOrientation="horizontal"
          onAdd={(e) => {
            setGroups((pre: any) => {
              const data = pre[e.fromData].splice(e.fromIndex, 1);
              data.forEach((item: any) => {
                item.common.groupName = e.toData;
                if (item.common.groupName === '其它') {
                  delete item.common.groupName;
                }
                pre[e.toData].push(item);
              });
              return { ...pre };
            });
          }}>
          {apps.map((app) => {
            return loadCommonCard(app.file);
          })}
        </Sortable>
      </div>
    );
  };
  return (
    <FullScreenModal
      open
      width={'80vw'}
      bodyHeight={'60vh'}
      onCancel={() => onClose(loadCommons())}>
      <div className="cardItem-viewer">
        {Object.keys(groups).map((groupName) => {
          return loadMultAppCards(groupName, groups[groupName]);
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 16, gap: 2 }}>
        <TextBox
          value={newGroupName}
          placeholder="分组名称"
          width={300}
          valueChangeEvent="input"
          onValueChange={(value) => setNewGroupName(value ?? '')}
        />
        <Button
          type="link"
          disabled={newGroupName.length < 1}
          onClick={() => {
            setGroups((pre: any) => {
              pre[newGroupName] = pre[newGroupName] || [];
              return { ...pre };
            });
            setNewGroupName('');
          }}>
          新增分组
        </Button>
      </div>
    </FullScreenModal>
  );
};

export default CommonGroups;
