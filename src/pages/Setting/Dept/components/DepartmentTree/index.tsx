import { Button, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import * as im from 'react-icons/im';

import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core/target/itarget';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import TargetTree from '@/bizcomponents/GlobalComps/targetTree';

type CreateGroupPropsType = {
  rkey: string;
  setCurrent: (current: ITarget) => void;
  handleMenuClick: (key: string, item: ITarget | undefined) => void;
};

const DepartTree: React.FC<CreateGroupPropsType> = ({
  rkey,
  setCurrent,
  handleMenuClick,
}) => {
  const [type, setType] = useState('department');
  const [data, setData] = useState<ITarget[]>([]);
  const treeContainer = document.getElementById('templateMenu');

  useEffect(() => {
    switch (type) {
      case 'department':
        setData([userCtrl.company]);
        break;
      case 'group':
        userCtrl.company.getJoinedGroups().then((res) => setData([...res]));
        break;
      case 'station':
        userCtrl.company.getStations().then((res) => setData([...res]));
        break;
      case 'cohort':
        userCtrl.company.getCohorts().then((res) => setData([...res]));
        break;
    }
  }, [rkey, type]);

  /** 加载右侧菜单 */
  const loadMenus = (item: ITarget) => {
    const menus: any[] = [];
    if (item.subTeamTypes.length > 0) {
      menus.push({
        key: '新建|' + item.subTeamTypes.join('|'),
        icon: <im.ImPlus />,
        label: '新建',
        item: item,
      });
    }
    menus.push(
      {
        key: '编辑',
        icon: <im.ImPencil />,
        label: '编辑',
        item: item,
      },
      {
        key: '刷新',
        icon: <im.ImSpinner9 />,
        label: '刷新',
        item: item,
      },
      {
        key: '删除',
        icon: <im.ImBin />,
        label: '删除',
        item: item,
      },
    );
    return menus;
  };

  return treeContainer ? (
    ReactDOM.createPortal(
      <div className={cls.topMes}>
        <TargetTree
          title={
            <>
              <Select
                showSearch
                defaultValue={type}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={(v) => setType(v)}
                style={{ width: 160 }}
                options={[
                  {
                    label: '内部机构',
                    value: 'department',
                  },
                  {
                    label: '外部机构',
                    value: 'group',
                  },
                  {
                    label: '单位岗位',
                    value: 'station',
                  },
                  {
                    label: '单位群组',
                    value: 'cohort',
                  },
                ]}
              />
              <Button
                className={cls.creatgroup}
                icon={<PlusOutlined className={cls.addIcon} />}
                type="text"
                onClick={() => {
                  switch (type) {
                    case 'cohort':
                      handleMenuClick('新建|群组', userCtrl.company);
                      break;
                    case 'station':
                      handleMenuClick('新建|岗位', userCtrl.company);
                      break;
                    case 'group':
                      handleMenuClick('新建|集团', userCtrl.company);
                      break;
                    case 'department':
                      handleMenuClick(
                        '新建|' + userCtrl.company.subTeamTypes.join('|'),
                        userCtrl.company,
                      );
                      break;
                  }
                }}
              />
            </>
          }
          className={cls.docTree}
          targets={data}
          onSelect={setCurrent}
          loadMenus={loadMenus}
          handleMenuClick={handleMenuClick}
        />
      </div>,
      treeContainer,
    )
  ) : (
    <></>
  );
};

export default DepartTree;
