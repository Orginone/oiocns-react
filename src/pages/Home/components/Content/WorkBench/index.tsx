/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Badge, Button, Calendar, Divider, Dropdown, Space, Spin } from 'antd';
import { ImBubbles2, ImDropbox, ImList, ImPlus, ImStack } from '@/icons/im';
import { useHistory } from 'react-router-dom';
import { command, model } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { formatSize } from '@/ts/base/common';
import { IApplication, TargetType } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { OperateMenuType } from 'typings/globelType';
import FullScreenModal from '@/components/Common/fullScreen';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { SYS_AXW, CmdBtns, WorkDatas } from './pageConfig';
import SysItemCard from './sysItemCard';

// 工作台
const WorkBench: React.FC = () => {
  const history = useHistory();
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loaded] = useFlagCmdEmitter('applications', async () => {
    setApplications(await orgCtrl.loadApplications());
  });

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
  // 设置常用标签
  const contextMenu = (app: IApplication, cacheTagName: string = '常用') => {
    const useAlays = app.cache.tags?.includes(cacheTagName);
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
            app.cache.tags.push(cacheTagName);
            app.cacheUserData();
            break;
          default:
            app.cache.tags = app.cache.tags?.filter((i) => i != cacheTagName);
            app.cacheUserData();
            break;
        }
      },
    };
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
        <div className="cardItem-header center">
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
    const counts = [todoCount, CompletedCount, CopysCount, ApplyCount];
    return (
      <>
        <div className="cardItem-header center">
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
            {WorkDatas.map((item, idx) => renderDataItem(item.title, counts[idx]))}
          </Space>
        </div>
      </>
    );
  };
  // 渲染存储信息
  const RendeStore: React.FC = () => {
    const [diskInfo, setDiskInfo] = useState<model.DiskInfoType>();
    useEffect(() => {
      orgCtrl.user.getDiskInfo().then((value) => {
        setDiskInfo(value);
      });
    }, []);
    return (
      <>
        <div className="cardItem-header center">
          <span className="title">数据</span>
          <span className="extraBtn">
            <ImPlus /> <span>管理数据</span>
          </span>
        </div>
        <div className="cardItem-viewer">
          <Space wrap split={<Divider type="vertical" />} size={6}>
            {diskInfo && (
              <>
                {!SYS_AXW &&
                  renderDataItem(
                    `关系(个)`,
                    orgCtrl.chats.filter(
                      (i) => i.isMyChat && i.typeName !== TargetType.Group,
                    ).length,
                    -1,
                    `共计:${orgCtrl.chats.length}个`,
                  )}
                {!SYS_AXW &&
                  renderDataItem(`数据集(个)`, diskInfo.collections, diskInfo.dataSize)}
                {renderDataItem(`对象数(个)`, diskInfo.objects, diskInfo.totalSize)}
                {renderDataItem(`文件(个)`, diskInfo.files, diskInfo.fileSize)}
                {renderDataItem(
                  `硬件`,
                  formatSize(diskInfo.fsUsedSize),
                  diskInfo.fsTotalSize,
                )}
              </>
            )}
          </Space>
        </div>
      </>
    );
  };
  // 渲染应用信息
  const RendeAppInfo: React.FC = () => {
    const [allAppShow, setAllAppShow] = useState(false);
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
      <>
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
          <span className="extraBtn" onClick={() => history.push('setting')}>
            <ImStack /> <span>更多操作</span>
          </span>
        </div>
        <div style={{ width: '100%', minHeight: 60 }} className="cardItem-viewer">
          <Space className="cardItem-content" wrap split={<Divider type="vertical" />}>
            {CmdBtns.map((cmd) => renderCmdBtn(cmd.cmd, cmd.title, cmd.iconType))}
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
      <div className="cardGroup axw-group">
        <div className="cardItem">
          <SysItemCard title="成果管理" tagName="成果管理" />
        </div>
        <div className="cardItem">
          <SysItemCard title="合同收益管理" tagName="合同收益管理" />
        </div>
        <div className="cardItem">
          <SysItemCard title="赋权管理" />
        </div>
      </div>
      <div className="cardGroup axw-group">
        <div className="cardItem">
          <SysItemCard title="工作流配置" />
        </div>
        <div className="cardItem">
          <SysItemCard title="表单配置" />
        </div>
      </div>
      <div className="cardGroup dataGroup">
        <div className="cardItem chartCard" onClick={() => history.push('chat')}>
          <RenderChat />
        </div>
        <div className="cardItem workCard" onClick={() => history.push('work')}>
          <RenderWork />
        </div>
        <div className="cardItem axw-storeCard" onClick={() => history.push('store')}>
          <RendeStore />
        </div>
      </div>
      <div className="cardGroup org-sroreCard">
        <div className="cardItem" onClick={() => history.push('store')}>
          <RendeStore />
        </div>
      </div>
      <div className="cardGroup org-appCard">
        <div className="cardItem">
          <RendeAppInfo />
        </div>
      </div>
      <div className="calendar org-calendar">{calendarItem()}</div>
    </div>
  );
};

export default WorkBench;
