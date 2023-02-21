import React, { useRef, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import Content from './content';
import useMenuUpdate from './hooks/useMenuUpdate';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import TransToDict from '@/pages/Setting/content/Standard/Dict/transToDict';
import SpeciesMatcher from '@/pages/Setting/content/Standard/Matcher';
import SpeciesModal from './components/speciesModal';
import { GroupMenuType } from './config/menuType';
import { Modal } from 'antd';

const TeamSetting: React.FC = () => {
  const matchRef = useRef(null);
  const [species, setSpecies] = useState<ISpeciesItem>();
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);
  const mockData = {
    sourceCompanyId: '395662010123161600',
    targetCompanyId: '381444617024966656',
    sourceSpeciesId: '404291281905389568',
    targetSpeciesId: '404001349236297728',
    matchAttrs: [
      {
        id: 'f99acc76-69f8-4879-8146-2de9562b53e5',
        sourceAttr: '名称',
        sourceAttrId: '404291392383356928',
        sourceAttrType: '数值型',
        sourceAttrCode: 'name',
        targetAttr: '名称',
        targetAttrId: '404001454072926208',
        targetAttrType: '描述型',
        targetAttrCode: 'name',
      },
      {
        id: 'c68eeac5-01e7-45e6-80ca-c9ae9612789a',
        sourceAttr: '分类',
        sourceAttrId: '404291871574200320',
        sourceAttrType: '选择型',
        sourceAttrCode: 'type',
        sourceAttrDictId: '404291590597775360',
        targetAttrId: '资产分类',
        targetAttrType: '选择型',
        targetAttrCode: 'assetType',
        targetAttrDictId: '403500326356914176',
        dictMatcher: [
          {
            id: '4bf43dd3-2a7e-4108-8a31-c52797735875',
            sourceDictId: '404291590597775360',
            sourceDictName: '分类',
            sourceDict: {
              id: '404291590597775360',
              name: '分类',
              target: {
                id: '404291590597775360',
                name: '分类',
                code: 'type',
                remark: '分类',
                speciesId: '404291281905389568',
                belongId: '395662010123161600',
                status: 1,
                createUser: '380300312394731520',
                updateUser: '380300312394731520',
                version: '1',
                createTime: '2023-01-20 15:10:26.573',
                updateTime: '2023-01-20 15:10:26.573',
              },
              belongInfo: { name: '奥集能平台', typeName: '平台' },
              items: [
                {
                  id: '404291691391094784',
                  name: '实物',
                  value: '1',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 15:10:50.604',
                  updateTime: '2023-01-20 15:10:50.604',
                },
                {
                  id: '404291756339892224',
                  name: '虚物',
                  value: '2',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 15:11:06.090',
                  updateTime: '2023-01-20 15:11:06.090',
                },
                {
                  id: '404344027253706752',
                  name: '固定资产',
                  value: '3',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 18:38:48.446',
                  updateTime: '2023-01-20 18:38:48.446',
                },
              ],
            },
            sourceDictItemId: '404291691391094784',
            sourceDictItem: '实物',
            sourceDictItemValue: '1',
            targetDictId: '403500326356914176',
            targetDictName: '资产分类',
            targetDict: {
              id: '403500326356914176',
              name: '资产分类',
              target: {
                id: '403500326356914176',
                name: '资产分类',
                code: 'assetType',
                speciesId: '366950230895235074',
                belongId: '381444617024966656',
                status: 1,
                createUser: '380300312394731520',
                updateUser: '380300312394731520',
                version: '1',
                createTime: '2023-01-18 10:46:14.477',
                updateTime: '2023-01-18 10:46:14.477',
              },
              belongInfo: { name: '奥集能平台', typeName: '平台' },
              items: [
                {
                  id: '403500375350579200',
                  name: '固定资产',
                  value: '1',
                  belongId: '381444617024966656',
                  dictId: '403500326356914176',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-18 10:46:26.159',
                  updateTime: '2023-01-18 10:46:26.159',
                },
                {
                  id: '403500416316346368',
                  name: '无形资产',
                  value: '2',
                  belongId: '381444617024966656',
                  dictId: '403500326356914176',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-18 10:46:35.926',
                  updateTime: '2023-01-18 10:46:35.926',
                },
              ],
            },
            targetDictItemId: '',
            targetDictItem: '',
            targetDictItemValue: '',
          },
          {
            id: '9f4b50df-ddf8-4bc0-81ba-c79d080ff31d',
            sourceDictId: '404291590597775360',
            sourceDictName: '分类',
            sourceDict: {
              id: '404291590597775360',
              name: '分类',
              target: {
                id: '404291590597775360',
                name: '分类',
                code: 'type',
                remark: '分类',
                speciesId: '404291281905389568',
                belongId: '395662010123161600',
                status: 1,
                createUser: '380300312394731520',
                updateUser: '380300312394731520',
                version: '1',
                createTime: '2023-01-20 15:10:26.573',
                updateTime: '2023-01-20 15:10:26.573',
              },
              belongInfo: { name: '奥集能平台', typeName: '平台' },
              items: [
                {
                  id: '404291691391094784',
                  name: '实物',
                  value: '1',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 15:10:50.604',
                  updateTime: '2023-01-20 15:10:50.604',
                },
                {
                  id: '404291756339892224',
                  name: '虚物',
                  value: '2',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 15:11:06.090',
                  updateTime: '2023-01-20 15:11:06.090',
                },
                {
                  id: '404344027253706752',
                  name: '固定资产',
                  value: '3',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 18:38:48.446',
                  updateTime: '2023-01-20 18:38:48.446',
                },
              ],
            },
            sourceDictItemId: '404291756339892224',
            sourceDictItem: '虚物',
            sourceDictItemValue: '2',
            targetDictId: '403500326356914176',
            targetDictName: '资产分类',
            targetDict: {
              id: '403500326356914176',
              name: '资产分类',
              target: {
                id: '403500326356914176',
                name: '资产分类',
                code: 'assetType',
                speciesId: '366950230895235074',
                belongId: '381444617024966656',
                status: 1,
                createUser: '380300312394731520',
                updateUser: '380300312394731520',
                version: '1',
                createTime: '2023-01-18 10:46:14.477',
                updateTime: '2023-01-18 10:46:14.477',
              },
              belongInfo: { name: '奥集能平台', typeName: '平台' },
              items: [
                {
                  id: '403500375350579200',
                  name: '固定资产',
                  value: '1',
                  belongId: '381444617024966656',
                  dictId: '403500326356914176',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-18 10:46:26.159',
                  updateTime: '2023-01-18 10:46:26.159',
                },
                {
                  id: '403500416316346368',
                  name: '无形资产',
                  value: '2',
                  belongId: '381444617024966656',
                  dictId: '403500326356914176',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-18 10:46:35.926',
                  updateTime: '2023-01-18 10:46:35.926',
                },
              ],
            },
            targetDictItemId: '无形资产',
            targetDictItem: '无形资产',
            targetDictItemValue: '2',
          },
          {
            id: '32548bfb-63cb-45c9-8681-dcab80ca030b',
            sourceDictId: '404291590597775360',
            sourceDictName: '分类',
            sourceDict: {
              id: '404291590597775360',
              name: '分类',
              target: {
                id: '404291590597775360',
                name: '分类',
                code: 'type',
                remark: '分类',
                speciesId: '404291281905389568',
                belongId: '395662010123161600',
                status: 1,
                createUser: '380300312394731520',
                updateUser: '380300312394731520',
                version: '1',
                createTime: '2023-01-20 15:10:26.573',
                updateTime: '2023-01-20 15:10:26.573',
              },
              belongInfo: { name: '奥集能平台', typeName: '平台' },
              items: [
                {
                  id: '404291691391094784',
                  name: '实物',
                  value: '1',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 15:10:50.604',
                  updateTime: '2023-01-20 15:10:50.604',
                },
                {
                  id: '404291756339892224',
                  name: '虚物',
                  value: '2',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 15:11:06.090',
                  updateTime: '2023-01-20 15:11:06.090',
                },
                {
                  id: '404344027253706752',
                  name: '固定资产',
                  value: '3',
                  belongId: '395662010123161600',
                  dictId: '404291590597775360',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-20 18:38:48.446',
                  updateTime: '2023-01-20 18:38:48.446',
                },
              ],
            },
            sourceDictItemId: '404344027253706752',
            sourceDictItem: '固定资产',
            sourceDictItemValue: '3',
            targetDictId: '403500326356914176',
            targetDictName: '资产分类',
            targetDict: {
              id: '403500326356914176',
              name: '资产分类',
              target: {
                id: '403500326356914176',
                name: '资产分类',
                code: 'assetType',
                speciesId: '366950230895235074',
                belongId: '381444617024966656',
                status: 1,
                createUser: '380300312394731520',
                updateUser: '380300312394731520',
                version: '1',
                createTime: '2023-01-18 10:46:14.477',
                updateTime: '2023-01-18 10:46:14.477',
              },
              belongInfo: { name: '奥集能平台', typeName: '平台' },
              items: [
                {
                  id: '403500375350579200',
                  name: '固定资产',
                  value: '1',
                  belongId: '381444617024966656',
                  dictId: '403500326356914176',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-18 10:46:26.159',
                  updateTime: '2023-01-18 10:46:26.159',
                },
                {
                  id: '403500416316346368',
                  name: '无形资产',
                  value: '2',
                  belongId: '381444617024966656',
                  dictId: '403500326356914176',
                  status: 1,
                  createUser: '380300312394731520',
                  updateUser: '380300312394731520',
                  version: '1',
                  createTime: '2023-01-18 10:46:35.926',
                  updateTime: '2023-01-18 10:46:35.926',
                },
              ],
            },
            targetDictItemId: '403500375350579200',
            targetDictItem: '固定资产',
            targetDictItemValue: '1',
          },
        ],
        index: 1,
        targetAttr: '资产分类',
        matchedDict: true,
      },
    ],
  };
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        if (data.itemType === GroupMenuType.Species) {
          setSpecies(data.item);
        } else {
          setSpecies(undefined);
          userCtrl.currentKey = data.key;
          const item = data.item as ITarget;
          if (item && !item.speciesTree) {
            await item.loadSpeciesTree();
            refreshMenu();
          }
          if (data.itemType === GroupMenuType.Agency) {
            if (item.subTeam.length === 0) {
              const subs = await item.loadSubTeam();
              if (subs.length > 0) {
                refreshMenu();
              }
            }
          }
        }
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '删除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ITarget).delete()) {
                  refreshMenu();
                }
              },
            });
            break;
          case '退出':
            Modal.confirm({
              content: '确定要退出吗?',
              onOk: async () => {
                let item = data.item as ITarget;
                switch (item.typeName) {
                  case TargetType.Group:
                    userCtrl.company.quitGroup((data.item as ITarget).id);
                    break;
                  case TargetType.Cohort:
                    userCtrl.user.quitCohorts((data.item as ITarget).id);
                    break;
                }
                refreshMenu();
              },
            });
            break;
          case '移除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ISpeciesItem).delete()) {
                  refreshMenu();
                }
              },
            });
            break;
          default:
            setEditTarget(data.item);
            setOperateKeys(key.split('|'));
            break;
        }
      }}
      siderMenuData={menus}
      onCheckedChange={(checkedKeyList: string[]) => {}}
      checkedList={[]}
      setCheckedList={() => {}}
      onTabChanged={() => {}}>
      {/** 组织模态框 */}
      <TeamModal
        title={operateKeys[0]}
        open={['新建', '编辑'].includes(operateKeys[0])}
        handleCancel={function (): void {
          setOperateKeys(['']);
        }}
        handleOk={(newItem) => {
          if (newItem) {
            refreshMenu();
            setOperateKeys(['']);
          }
        }}
        current={editTarget || userCtrl.space}
        typeNames={operateKeys.slice(1)}
      />
      {/** 分类模态框 */}
      <SpeciesModal
        title={operateKeys[0]}
        open={['新增', '修改'].includes(operateKeys[0])}
        handleCancel={function (): void {
          setOperateKeys(['']);
        }}
        handleOk={(newItem) => {
          if (newItem) {
            refreshMenu();
            setOperateKeys(['']);
          }
        }}
        targetId={(selectMenu.item as ITarget)?.id}
        current={species}
      />
      {/* 分类转字典 */}
      {species && (
        <TransToDict
          open={['转为字典'].includes(operateKeys[0])}
          setOpen={() => setOperateKeys([''])}
          currentSpeciesItem={species}></TransToDict>
      )}
      {/* 分类标准匹配 */}
      <Modal
        title="分类匹配"
        width={'80%'}
        destroyOnClose={true}
        open={['分类匹配'].includes(operateKeys[0])}
        onCancel={function (): void {
          setOperateKeys(['']);
        }}
        onOk={(newItem) => {
          if (newItem) {
            // if (matchRef.current && matchRef.current.checkValid()) {
            //   matchRef.current.submit();
            //   refreshMenu();
            //   setOperateKeys(['']);
            // }
          }
        }}>
        <SpeciesMatcher ref={matchRef} data={mockData}></SpeciesMatcher>
      </Modal>
      <Content key={key} selectMenu={selectMenu} species={species} />
    </MainLayout>
  );
};

export default TeamSetting;
