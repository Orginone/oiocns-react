import React, { FC, useState, useEffect } from 'react';
import { Layout, List, Input, Button, message } from 'antd';
import type { MenuProps } from 'antd';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { IWork, IWorkTask, IWorkApply, IApplication, IFile } from '@/ts/core';
import { model } from '@/ts/base';
import WorkForm from '@/executor/tools/workForm';

import orgCtrl from '@/ts/controller';

const { Sider, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

import cls from '../index.module.less';
import { Application } from '@/ts/core/thing/standard/application';
function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  resource?: IApplication | IFile | IWork,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    resource,
  } as MenuItem;
}
const ComApplication: FC = () => {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const formData = new Map<string, model.FormEditData>();
  const info: { content: string } = { content: '' };
  const gatewayData = new Map<string, string>();
  const [activeKey, setActivKey] = useState<number>();
  const [selectedWorks, setSelectedWorks] = useState<IWork[]>([]);
  // const [list, setList] = useState<IFile[] | IWork[]>();
  const [list, setList] = useState<{}[]>();
  const [current, setCurrent] = useState<IWork | IWorkTask | undefined>();
  const [apply, setApply] = useState<IWorkApply | undefined>();
  const [commonFiles, setCommonFiles] = useState<IFile[]>([]);
  const [link, setLink] = useState();
  // const [loaded] =
  useFlagCmdEmitter('applications', async () => {
    const res = await orgCtrl.loadApplications();
    setApplications(res);
  });

  useEffect(() => {
    setCurrent(undefined);
    setActivKey(undefined);
  }, []);
  useEffect(() => {
    if (current) {
      current.createApply &&
        current.createApply().then((res) => {
          setApply(res);
        });
    }
  }, [current]);
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
  const menuItems = [
    {
      name: '常用',
      id: '1',
      menus: loadGroups(),
    },
    {
      name: '资产管理',
      id: '2',
      link: 'http://172.17.58.190/dwmh/framework/login_ak.htm',
    },
  ];
  useFlagCmdEmitter('commons', async () => {
    setCommonFiles(await orgCtrl.loadCommons());
  });
  return (
    <>
      <Sider>
        <List
          itemLayout="horizontal"
          dataSource={menuItems.map((a) => {
            return getItem(a.name, a.id, undefined, undefined, undefined, a);
          })}
          renderItem={(item: MenuItem) => {
            return (
              <div className={cls['ysyt-application']}>
                <List.Item
                  key={item?.key}
                  className={`${cls['ysyt-menu']} ${
                    activeKey === item?.key ? cls['ysyt-menu_active'] : ''
                  }`}
                  onClick={async () => {
                    const { resource } = item;
                    setCurrent(undefined);
                    setApply(undefined);
                    setLink(undefined);
                    setList(undefined);
                    if (resource.menus) {
                      const dataList = Object.keys(resource.menus).map((key) => {
                        return { label: key, name: key, submenus: resource.menus[key] };
                      });
                      setList(dataList);
                    }
                    if (resource.link) {
                      setLink(resource.link);
                    }
                  }}>
                  <div style={{ width: '100%' }}>
                    <span>{`${item?.label}`}</span>
                    <span
                      className={`${cls['ysyt-menu-arrow']} ${
                        activeKey === item?.key ? cls['ysyt-menu-arrow_rotate'] : ''
                      }`}
                      style={{ float: 'right' }}>{`>`}</span>
                  </div>
                </List.Item>
              </div>
            );
          }}
        />
      </Sider>
      <Content>
        {list && (
          <div className={`${cls['ysyt-item-content']}`}>
            <List
              itemLayout="horizontal"
              className={`${cls['ysyt-item']} ${current ? cls['hide'] : ''} ${
                activeKey ? cls['show'] : ''
              }`}
              dataSource={
                (list &&
                  list.map((work, idx) => {
                    return getItem(
                      work?.name,
                      idx,
                      undefined,
                      undefined,
                      undefined,
                      work,
                    );
                  })) ||
                []
              }
              renderItem={(item: MenuItem) => {
                const { resource } = item || [];
                return (
                  <div>
                    <div>
                      <span className={cls['ysyt-item-module']}>{item?.label}</span>
                      <br />
                      <div className={cls['ysyt-item-works']}>
                        {resource?.submenus?.map(
                          (w: { file: Application; commom: any }) => {
                            const { file } = w;
                            return (
                              <span
                                className={cls['ysyt-item-work']}
                                onClick={() => {
                                  setCurrent(file);
                                }}
                                key={file.id}>
                                {file.name}
                              </span>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}></List>
          </div>
        )}
        {link && <iframe width="100%" height="100%" src={link}></iframe>}
        {/* src={link} */}
        {apply && (
          <div
            style={{
              backgroundColor: '#fff',
              height: '100%',
              overflowY: 'scroll',
              // margin: '20px',
              padding: '20px 0 80px 20px',
            }}>
            <>
              <WorkForm
                allowEdit
                belong={apply.belong}
                data={apply.instanceData}
                nodeId={apply.instanceData.node.id}
                onChanged={(id, data) => {
                  formData.set(id, data);
                }}
              />
              <div style={{ padding: 10, display: 'flex', alignItems: 'flex-end' }}>
                <Input.TextArea
                  style={{
                    height: 100,
                    width: 'calc(100% - 80px)',
                    marginRight: 10,
                  }}
                  placeholder="请填写备注信息"
                  onChange={(e) => {
                    info.content = e.target.value;
                  }}
                />
                <Button
                  type="primary"
                  onClick={async () => {
                    if (apply.validation(formData)) {
                      await apply.createApply(
                        apply.belong.id,
                        info.content,
                        formData,
                        gatewayData,
                      );
                    } else {
                      message.warn('请完善表单内容再提交!');
                    }
                  }}>
                  提交
                </Button>
              </div>
            </>
          </div>
        )}
      </Content>
    </>
  );
};

export default ComApplication;
