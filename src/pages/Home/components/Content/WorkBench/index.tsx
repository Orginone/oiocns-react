import React, { useEffect, useState } from 'react';
import { Badge, Button, Calendar, Divider, Dropdown, Space, Spin } from 'antd';
import { ImBubbles2, ImList, ImPlus, ImStack, ImUngroup } from 'react-icons/im';
import { useHistory } from 'react-router-dom';
import { command, model } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { formatSize } from '@/ts/base/common';
import { IFile, TargetType } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { loadFileMenus } from '@/executor/fileOperate';
import CommonGroups from './group';
import { cleanMenus } from '@/utils/tools';

// 工作台
const WorkBench: React.FC = () => {
  const history = useHistory();
  // 渲染数据项
  const renderDataItem = (
    title: string,
    number: string | number,
    size?: number,
    info?: string,
  ) => {
    return (
      <div className="dataItem">
        <div className="dataItemTitle">{title}</div>
        <div className="dataItemNumber">{number}</div>
        {size && size > 0 && <div className="dataItemTitle">大小:{formatSize(size)}</div>}
        {info && info.length > 0 && <div className="dataItemTitle">{info}</div>}
      </div>
    );
  };
  // 渲染沟通信息
  const RenderChat: React.FC = () => {
    const [msgCount, setMsgCount] = useState(0);
    const [loaded] = useFlagCmdEmitter('session', () => {
      setMsgCount(
        orgCtrl.chats
          .map((i) => {
            return i.isMyChat ? i.badgeCount : 0;
          })
          .reduce((total, count) => total + count, 0),
      );
    });
    return (
      <>
        <div className="cardItem-header">
          <span className="title">沟通</span>
          <span className="extraBtn">
            <ImBubbles2 />
            <span>
              未读<b>{msgCount}</b>条
            </span>
          </span>
        </div>
        <div className="cardItem-viewer">
          <Spin spinning={!loaded}>
            <Space wrap split={<Divider type="vertical" />} size={2}>
              {renderDataItem('好友(人)', orgCtrl.user.members.length)}
              {renderDataItem(
                '同事(个)',
                orgCtrl.user.companys
                  .map((i) => i.members.map((i) => i.id))
                  .reduce(
                    (ids, current) => [
                      ...ids,
                      ...current.filter((i) => !ids.includes(i)),
                    ],
                    [],
                  ).length,
              )}
              {renderDataItem(
                '群聊(个)',
                orgCtrl.chats.filter((i) => i.isMyChat && i.isGroup).length,
              )}
              {renderDataItem('单位(家)', orgCtrl.user.companys.length)}
            </Space>
          </Spin>
        </div>
      </>
    );
  };
  // 渲染办事信息
  const RenderWork: React.FC = () => {
    const [todoCount, setTodoCount] = useState(0);
    const [ApplyCount, setApplyCount] = useState(0);
    const [CopysCount, setCopysCount] = useState(0);
    const [CompletedCount, setCompletedCount] = useState(0);
    useEffect(() => {
      const id = orgCtrl.work.notity.subscribe(() => {
        setTodoCount(orgCtrl.work.todos.length);
        orgCtrl.work.loadTaskCount('已发起').then((v) => {
          setApplyCount(v);
        });
        orgCtrl.work.loadTaskCount('抄送').then((v) => {
          setCopysCount(v);
        });
        orgCtrl.work.loadTaskCount('已办').then((v) => {
          setCompletedCount(v);
        });
      });
      return () => {
        orgCtrl.unsubscribe(id);
      };
    }, []);
    return (
      <>
        <div className="cardItem-header">
          <span className="title">办事</span>
          <span className="extraBtn">
            <ImList />
            <span>
              待办<b>{todoCount}</b>件
            </span>
          </span>
        </div>
        <div className="cardItem-viewer">
          <Space wrap split={<Divider type="vertical" />} size={2}>
            {renderDataItem('待办', todoCount)}
            {renderDataItem('已办', CompletedCount)}
            {renderDataItem('抄送', CopysCount)}
            {renderDataItem('已发起', ApplyCount)}
          </Space>
        </div>
      </>
    );
  };
  // 渲染存储数据信息
  const RendeStore: React.FC = () => {
    const [noStore, setNoStore] = useState(false);
    const [diskInfo, setDiskInfo] = useState<model.DiskInfoType>();
    useEffect(() => {
      orgCtrl.user.getDiskInfo().then((value) => {
        setDiskInfo(value);
        setNoStore(value === undefined);
      });
    }, []);
    return (
      <>
        <div className="cardItem-header">
          <span className="title">数据</span>
          <span className="extraBtn">
            <ImPlus /> <span>管理数据</span>
          </span>
        </div>
        <div className="cardItem-viewer">
          <Space wrap split={<Divider type="vertical" />} size={6}>
            {diskInfo && (
              <>
                {renderDataItem(
                  `关系(个)`,
                  orgCtrl.chats.filter(
                    (i) => i.isMyChat && i.typeName !== TargetType.Group,
                  ).length,
                  -1,
                  `共计:${orgCtrl.chats.length}个`,
                )}
                {renderDataItem(`数据集(个)`, diskInfo.collections, diskInfo.dataSize)}
                {renderDataItem(`对象数(个)`, diskInfo.objects, diskInfo.totalSize)}
                {renderDataItem(`文件(个)`, diskInfo.filesCount, diskInfo.filesSize)}
                {renderDataItem(
                  `硬件`,
                  formatSize(diskInfo.fsUsedSize),
                  diskInfo.fsTotalSize,
                )}
              </>
            )}
            {noStore && (
              <h3 style={{ color: 'red' }}>
                {`您还未申请存储资源，
                您将无法使用本系统，
                请申请加入您的存储资源群（用来存储您的数据），
                个人用户试用存储群为（orginone_data），
                申请通过后请在关系中激活使用哦！`}
              </h3>
            )}
          </Space>
        </div>
      </>
    );
  };
  // 渲染常用信息
  const RendeCommonInfo: React.FC = () => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [commonFiles, setCommonFiles] = useState<IFile[]>([]);
    const [loaded] = useFlagCmdEmitter('commons', async () => {
      setCommonFiles(await orgCtrl.loadCommons());
    });
    const loadGroups = () => {
      const letGroups: any = { 其它: [] };
      for (const item of orgCtrl.user.commons) {
        const file = commonFiles.find(
          (i) => i.id === item.id && i.spaceId === item.spaceId,
        );
        if (file) {
          const groupName = item.groupName ?? '其它';
          letGroups[groupName] = letGroups[groupName] || [];
          letGroups[groupName].push({
            file,
            common: item,
          });
        }
      }
      return letGroups;
    };
    const contextMenu = (file: IFile) => {
      return {
        items: cleanMenus(loadFileMenus(file)) || [],
        onClick: ({ key }: { key: string }) => {
          command.emitter('executor', key, file);
        },
      };
    };
    // 加载常用
    const loadCommonCard = (item: IFile) => (
      <Dropdown key={item.key} menu={contextMenu(item)} trigger={['contextMenu']}>
        <div
          className="appCard"
          onClick={() => {
            command.emitter('executor', 'open', item);
          }}>
          {item.cache.tags?.includes('常用') ? (
            <Badge dot>
              <EntityIcon entity={item.metadata} size={35} />
            </Badge>
          ) : (
            <EntityIcon entity={item.metadata} size={35} />
          )}
          <div className="appName">{item.typeName}</div>
          <div className="appName">{item.name}</div>
          <div className="teamName">{item.directory.target.name}</div>
          <div className="teamName">{item.directory.target.space.name}</div>
        </div>
      </Dropdown>
    );

    const loadGroupItem = (title: string, data: any[]) => {
      if (data.length < 1) return <></>;
      return (
        <div className="cardItem" style={{ width: 'auto', maxWidth: 500 }}>
          <div className="cardItem-header">
            <span className="title">{title}</span>
          </div>
          <div className="cardItem-viewer">
            <Space wrap split={<Divider type="vertical" />} size={2}>
              {data.map((app) => {
                return loadCommonCard(app.file);
              })}
            </Space>
          </div>
        </div>
      );
    };
    return (
      <>
        <div className="cardItem-header">
          <span className="title">常用</span>
          <span className="extraBtn" onClick={() => setEditMode((pre) => !pre)}>
            <ImUngroup /> <span>常用分组</span>
          </span>
        </div>
        <Spin spinning={!loaded} tip={'加载中...'}>
          <div className="cardItem-viewer">
            <div className="cardGroup" style={{ flexWrap: 'wrap' }}>
              {Object.keys(loadGroups()).map((groupName) => {
                return loadGroupItem(groupName, loadGroups()[groupName]);
              })}
            </div>
          </div>
        </Spin>
        {editMode && (
          <CommonGroups
            preGroups={loadGroups()}
            commons={orgCtrl.user.commons}
            onClose={(commons) => {
              orgCtrl.user.updateCommons(commons);
              setEditMode(false);
            }}
          />
        )}
      </>
    );
  };
  // 日历组件
  const calendarItem = () => {
    return (
      <div className="cardItem">
        <div className="cardItem-header">
          <span className="title">日历</span>
          {/* <span className={cls.extraBtn}>
            <Button type="text" size="small">
              <ImPlus /> <span>创建日程</span>
            </Button>
          </span> */}
        </div>
        <Calendar />
      </div>
    );
  };
  // 操作组件
  const RenderOperate = () => {
    // 发送快捷命令
    const renderCmdBtn = (cmd: string, title: string, iconType: string) => {
      return (
        <Button
          className="linkBtn"
          type="text"
          icon={<TypeIcon iconType={iconType} size={18} />}
          onClick={() => {
            command.emitter('executor', cmd, orgCtrl.user);
          }}>
          {title}
        </Button>
      );
    };
    return (
      <>
        <div className="cardItem-header">
          <span className="title">快捷操作</span>
          <span className="extraBtn" onClick={() => history.push('relation')}>
            <ImStack /> <span>更多操作</span>
          </span>
        </div>
        <div style={{ width: '100%', minHeight: 60 }} className="cardItem-viewer">
          <Space wrap split={<Divider type="vertical" />} size={6}>
            {renderCmdBtn('joinFriend', '添加好友', 'joinFriend')}
            {renderCmdBtn('joinStorage', '申请存储', '存储资源')}
            {renderCmdBtn('newCohort', '创建群组', '群组')}
            {renderCmdBtn('joinCohort', '加入群聊', 'joinCohort')}
            {renderCmdBtn('newCompany', '设立单位', '单位')}
            {renderCmdBtn('joinCompany', '加入单位', 'joinCompany')}
          </Space>
        </div>
      </>
    );
  };
  return (
    <div className="workbench-content">
      <div className="cardGroup">
        <div style={{ minHeight: 80 }} className="cardItem">
          <RenderOperate />
        </div>
      </div>
      <div className="cardGroup">
        <div className="cardItem" onClick={() => history.push('chat')}>
          <RenderChat />
        </div>
        <div className="cardItem" onClick={() => history.push('work')}>
          <RenderWork />
        </div>
      </div>
      <div className="cardGroup">
        <div className="cardItem" onClick={() => history.push('store')}>
          <RendeStore />
        </div>
      </div>
      <div className="cardGroup">
        <div className="cardItem">
          <RendeCommonInfo />
        </div>
      </div>
      <div className="calendar">{calendarItem()}</div>
    </div>
  );
};

export default WorkBench;
