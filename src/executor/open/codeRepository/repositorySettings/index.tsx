import React, { useEffect, useState } from 'react';
import { IRepository } from '@/ts/core/thing/standard/repository';
import {
  Avatar,
  Button,
  Input,
  Tabs,
  Tag,
  Upload,
  Select,
  Checkbox,
  Divider,
  message,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  SettingFilled,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './index.less';

interface IProps {
  current: IRepository;
}

const RepositorySettings: React.FC<IProps> = ({ current }) => {
  const [content, setcontent] = useState('基本设置');
  const title = [
    {
      name: '基本设置',
      key: 1,
    },
    {
      name: '管理协作者',
      key: 2,
    },
    {
      name: '管理分支',
      key: 3,
    },
    {
      name: '管理Web钩子',
      key: 4,
    },
    {
      name: '管理部署私钥',
      key: 5,
    },
  ];
  //管理分支信息
  const [settingbranchesdata, setSettingbranchesdata] = useState<any>(null);
  //单条保护分支信息
  const [protectedData, setProtectedData] = useState<any>(null);
  //单条保护分支信息
  const [defaultBranch, setDefaultBranch] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const settingbranchesdata = await current.Codesettingbranches();
        console.log(settingbranchesdata);
        setSettingbranchesdata(settingbranchesdata.data);
        setDefaultBranch(settingbranchesdata.data.DefaultBranch);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      <div className="flex_align_Setting">
        <div className="md_contianer Settingleft">
          <h3
            style={{
              padding: '.6rem .8rem',
              background: '#f0f0f0',
              borderBottom: '1px solid #ddd',
            }}>
            仓库设置
          </h3>
          {title.map((value, i) => {
            return (
              <div
                className={
                  content.split('.')[0] == value.name ? `branch_box action` : `branch_box`
                }
                key={i}
                onClick={() => {
                  setcontent(value.name);
                }}>
                {value.name}
              </div>
            );
          })}
        </div>
        {(() => {
          switch (content) {
            case '管理分支':
              return (
                <>
                  <div style={{ width: '100%' }}>
                    <div className="md_contianer Settingright">
                      <h3
                        style={{
                          padding: '.6rem .8rem',
                          background: '#f0f0f0',
                          borderBottom: '1px solid #ddd',
                        }}>
                        默认分支
                      </h3>
                      <div className="Settingbox">
                        默认分支是被用于代码提交、合并请求和在线编辑的基准分支。
                        <div>
                          <Select
                            style={{ width: 200, margin: '10px' }}
                            placeholder={'默认分支'}
                            defaultValue={settingbranchesdata?.DefaultBranch}
                            onChange={async (value) => {
                              setDefaultBranch(value);
                            }}
                            options={settingbranchesdata?.AllBranches?.map((item) => ({
                              label: item,
                              value: item,
                            }))}
                          />
                          <Button
                            type="default"
                            style={{
                              background: '#21ba45',
                              color: '#fff',
                              border: '#21ba45',
                            }}
                            onClick={async () => {
                              const res = await current.SetDefaultBranch(
                                `${defaultBranch}`,
                              );
                              message.success('仓库默认分支更新成功！');
                            }}>
                            更新
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="md_contianer Settingright">
                      <h3
                        style={{
                          padding: '.6rem .8rem',
                          background: '#f0f0f0',
                          borderBottom: '1px solid #ddd',
                        }}>
                        保护分支
                      </h3>
                      <div className="Settingbox">
                        保护分支不被强制推送、意外删除和限制代码提交白名单。
                        <div>
                          <Select
                            style={{ width: 300, margin: '10px' }}
                            placeholder={'选择一个分支...'}
                            // defaultValue={clickTrees}
                            // onChange={async (value) => {
                            //   console.log(value);
                            // }}
                            onSelect={async (val) => {
                              const res = await current.Codesettingbranches(`/${val}`);
                              setProtectedData(res.data);
                              setcontent('管理分支.分支保护');
                            }}
                            options={settingbranchesdata?.AllBranches?.map((item) => ({
                              label: item,
                              value: item,
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            case '管理分支.分支保护':
              return (
                <>
                  <div style={{ width: '100%' }}>
                    <div className="md_contianer Settingright">
                      <h3
                        style={{
                          padding: '.6rem .8rem',
                          background: '#f0f0f0',
                          borderBottom: '1px solid #ddd',
                        }}>
                        分支保护
                      </h3>
                      <div className="Settingbox">
                        请选择应用于{' '}
                        <span style={{ fontWeight: 600 }}>{protectedData?.Branch}</span>{' '}
                        分支的保护选项。
                        <div>
                          <Checkbox
                            checked={protectedData?.IsProtected}
                            onChange={(e) => {
                              // console.log(e, e.target.checked);
                              setProtectedData({
                                ...protectedData,
                                IsProtected: e.target.checked,
                              });
                            }}>
                            启用分支保护
                            <div style={{ color: '#c2c2c2' }}>
                              禁止强制推送和删除分支。
                            </div>
                          </Checkbox>
                          <Divider />
                          <Button
                            type="default"
                            style={{
                              background: '#21ba45',
                              color: '#fff',
                              border: '#21ba45',
                            }}
                            onClick={async () => {
                              try {
                                const res = await current.SetProtectedbranches(
                                  `/${protectedData.Branch}`,
                                  {
                                    BranchName: protectedData.Branch,
                                    Protected: protectedData.IsProtected, //是否设置保护，true为设置保护，false为设置不保护
                                  },
                                );
                                console.log(res);
                                message.success('此分支的保护选项更新成功！');
                              } catch (error) {
                                message.error('此分支的保护选项更新失败！请重新设置');
                              }
                            }}>
                            更新设置
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            default:
              return (
                <div style={{ width: '100%' }}>
                  <div className="md_contianer Settingright">
                    <h3
                      style={{
                        padding: '.6rem .8rem',
                        background: '#f0f0f0',
                        borderBottom: '1px solid #ddd',
                      }}>
                      {content}
                    </h3>
                    <div></div>
                  </div>
                </div>
              );
          }
        })()}
      </div>
    </>
  );
};
export default RepositorySettings;
