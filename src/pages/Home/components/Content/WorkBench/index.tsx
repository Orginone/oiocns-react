import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import FullScreenModal from '@/components/Common/fullScreen';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { command, model } from '@/ts/base';
import { formatSize } from '@/ts/base/common';
import orgCtrl from '@/ts/controller';
import { IApplication, TargetType } from '@/ts/core';
import { Badge, Button, Calendar, Divider, Dropdown, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { ImBubbles2, ImDropbox, ImList, ImPlus, ImStack } from 'react-icons/im';
import { useHistory } from 'react-router-dom';
import { OperateMenuType } from 'typings/globelType';

// 渲染数据项
export const renderDataItem = (
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
export const RenderChat: React.FC = () => {
  const history = useHistory();
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
    <div className="cardGroup">
      <div className="cardItem" onClick={() => history.push('chat')}>
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
      </div>
    </div>
  );
};

// 渲染办事信息
export const RenderWork: React.FC = () => {
  const history = useHistory();
  const [todoCount, setTodoCount] = useState(0);
  const [ApplyCount, setApplyCount] = useState(0);
  const [CopysCount, setCopysCount] = useState(0);
  const [CompletedCount, setCompletedCount] = useState(0);
  useEffect(() => {
    const id = orgCtrl.subscribe(() => {
      setTodoCount(orgCtrl.work.todos.length);
      orgCtrl.work.loadTaskCount('发起的').then((v) => {
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
    <div className="cardGroup">
      <div className="cardItem" onClick={() => history.push('work')}>
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
            {renderDataItem('发起的', ApplyCount)}
          </Space>
        </div>
      </div>
    </div>
  );
};

// 渲染存储信息
export const RenderStore: React.FC = () => {
  const history = useHistory();
  const [noStore, setNoStore] = useState(false);
  const [diskInfo, setDiskInfo] = useState<model.DiskInfoType>();
  useEffect(() => {
    orgCtrl.user.getDiskInfo().then((value) => {
      setDiskInfo(value);
      setNoStore(value === undefined);
    });
  }, []);
  return (
    <div className="cardGroup">
      <div className="cardItem" onClick={() => history.push('store')}>
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
                {renderDataItem(`文件(个)`, diskInfo.files, diskInfo.fileSize)}
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
      </div>
    </div>
  );
};

// 渲染应用信息
export const RenderAppInfo: React.FC = () => {
  const history = useHistory();
  const [allAppShow, setAllAppShow] = useState(false);
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loaded] = useFlagCmdEmitter('applications', async () => {
    setApplications(await orgCtrl.loadApplications());
  });
  const contextMenu = (app: IApplication) => {
    const useAlays = app.cache.tags?.includes('常用');
    const menus: OperateMenuType[] = [
      {
        key: useAlays ? 'unsetCommon' : 'setCommon',
        label: useAlays ? '取消常用' : '设为常用',
        icon: <></>,
      },
    ];
    return {
      items: menus,
      onClick: async ({ key }: { key: string }) => {
        switch (key) {
          case 'setCommon':
            app.cache.tags = app.cache.tags || [];
            app.cache.tags.push('常用');
            app.cacheUserData();
            break;
          default:
            app.cache.tags = app.cache.tags?.filter((i) => i != '常用');
            app.cacheUserData();
            break;
        }
      },
    };
  };
  // 加载应用
  const loadAppCard = (item: IApplication) => (
    <Dropdown key={item.key} menu={contextMenu(item)} trigger={['contextMenu']}>
      <div
        className="appCard"
        onClick={() => {
          orgCtrl.currentKey = item.key;
          history.push('/store');
        }}>
        {item.cache.tags?.includes('常用') ? (
          <Badge dot>
            <EntityIcon entity={item.metadata} size={35} />
          </Badge>
        ) : (
          <EntityIcon entity={item.metadata} size={35} />
        )}
        <div className="appName">{item.name}</div>
        <div className="teamName">{item.directory.target.name}</div>
        <div className="teamName">{item.directory.target.space.name}</div>
      </div>
    </Dropdown>
  );
  // 加载多个应用
  const loadMultAppCards = (title: string, apps: IApplication[]) => {
    if (apps.length < 1) return <></>;
    return (
      <>
        <div className="appGroup-title">{title}</div>
        <Space wrap split={<Divider type="vertical" />} size={6}>
          {apps.map((app) => {
            return loadAppCard(app);
          })}
        </Space>
      </>
    );
  };

  // 加载所有应用
  const renderAllApps = () => {
    return (
      <FullScreenModal
        width={'60vw'}
        bodyHeight={'60vh'}
        open={allAppShow}
        onCancel={() => setAllAppShow(false)}>
        <div className="cardItem-viewer">
          {loadMultAppCards(
            '常用应用',
            applications.filter((i) => i.cache.tags?.includes('常用')),
          )}
          {loadMultAppCards(
            '我的应用',
            applications.filter((i) => i.metadata.createUser === i.userId),
          )}
          {loadMultAppCards(
            '共享应用',
            applications.filter((i) => i.metadata.createUser !== i.userId),
          )}
        </div>
      </FullScreenModal>
    );
  };
  return (
    <div className="cardGroup">
      <div className="cardItem">
        <div className="cardItem-header">
          <span className="title">常用应用</span>
          <span className="extraBtn" onClick={() => setAllAppShow(true)}>
            <ImDropbox /> <span>全部应用</span>
          </span>
        </div>
        <Spin spinning={!loaded} tip={'加载中...'}>
          <div className="cardItem-viewer">
            <Space wrap split={<Divider type="vertical" />} size={2}>
              {applications
                .filter((i) => i.cache.tags?.includes('常用'))
                .map((app) => {
                  return loadAppCard(app);
                })}
            </Space>
          </div>
        </Spin>
        {allAppShow && renderAllApps()}
      </div>
    </div>
  );
};

// 操作组件
export const RenderOperate = () => {
  const history = useHistory();
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
    <div className="cardGroup">
      <div className="cardItem">
        <div className="cardItem-header">
          <span className="title">快捷操作</span>
          <span className="extraBtn" onClick={() => history.push('setting')}>
            <ImStack /> <span>更多操作</span>
          </span>
        </div>
        <div style={{ width: '100%' }} className="cardItem-viewer">
          <Space wrap split={<Divider type="vertical" />} size={6}>
            {renderCmdBtn('joinFriend', '添加好友', 'joinFriend')}
            {renderCmdBtn('joinStorage', '申请存储', '存储资源')}
            {renderCmdBtn('newCohort', '创建群组', '群组')}
            {renderCmdBtn('joinCohort', '加入群聊', 'joinCohort')}
            {renderCmdBtn('newCompany', '设立单位', '单位')}
            {renderCmdBtn('joinCompany', '加入单位', 'joinCompany')}
          </Space>
        </div>
      </div>
    </div>
  );
};

// 日历组件
export const CalendarItem = () => {
  return (
    <div className="calendar">
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
    </div>
  );
};

// 工作台
const WorkBench: React.FC = () => {
  return (
    <div className="workbench-content">
      <RenderOperate />
      <div className="cardGroup">
        <RenderChat />
        <RenderWork />
      </div>
      <RenderStore />
      <RenderAppInfo />
      <CalendarItem />
    </div>
  );
};

export default WorkBench;
