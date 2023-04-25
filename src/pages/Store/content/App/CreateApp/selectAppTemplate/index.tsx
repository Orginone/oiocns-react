import React, { useEffect, useState } from 'react';
import { Drawer, Tag, TreeSelect } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import orgCtrl from '@/ts/controller';
import cls from './index.module.less';
import { OperationColumns } from '@/pages/Setting/config/columns';
import { PageRequest } from '@/ts/base/model';
import CardOrTable from '@/components/CardOrTableComp';
import { kernel } from '@/ts/base';
import { XOperation } from '@/ts/base/schema';
import ViewFormModal from '@/pages/Setting/components/viewFormModal';
import ViewCardModal from '@/pages/Setting/components/viewCardModal';
interface Iprops {
  open: boolean;
  setCreateWay: Function;
}
const { SHOW_PARENT } = TreeSelect;
const selectAppTemplate: React.FC<Iprops> = (props) => {
  const { open, setCreateWay } = props;
  const [keyword, setKeyword] = useState('');
  const [treeData, setTreeData] = useState<any>();
  const [selectedTags] = useState<string>();
  const [tags, setTags] = useState<any[]>([]);
  const [editData, setEditData] = useState<XOperation>();
  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);
  const [viewCardOpen, setViewCardOpen] = useState<boolean>(false);

  const handleClose = (removedTag: string) => {
    const newLabels = tags.filter((label) => label.id !== removedTag);
    setTags(newLabels);
  };

  const buildSpeciesChildrenTree = (parent: any[]): any[] => {
    if (parent.length > 0) {
      return parent.map((species) => {
        return {
          key: species.id,
          title: species.name,
          value: species.id,
          children: buildSpeciesChildrenTree(species.children),
        };
      });
    }
    return [];
  };
  const init = async () => {
    const species = await thingCtrl.loadSpeciesTree();
    if (species) {
      setTreeData(buildSpeciesChildrenTree([species]));
    }
  };
  useEffect(() => {
    init();
  }, [orgCtrl.space.id]);

  const tProps = {
    treeData,
    value: selectedTags,
    onChange: () => {},
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '选择标签',
    style: {
      width: '74%',
    },
  };

  const loadOperations = async (page: PageRequest) => {
    return (
      await kernel.querySpeciesOperation({
        id: '',
        spaceId: orgCtrl.space.id,
        filterAuth: false,
        recursionOrg: true,
        recursionSpecies: true,
        page: {
          offset: page.offset,
          limit: page.limit,
          filter: '',
        },
      })
    ).data;
  };

  // 操作内容渲染函数
  const renderOperate = (item: XOperation) => {
    return [
      {
        key: '预览表单',
        label: '预览表单',
        onClick: () => {
          setEditData(item);
          setViewFormOpen(true);
        },
      },
      {
        key: '预览卡片',
        label: '预览卡片',
        onClick: () => {
          setEditData(item);
          setViewCardOpen(true);
        },
      },
    ];
  };

  return (
    <Drawer
      title={
        <div
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 540,
          }}>
          方案模板
        </div>
      }
      placement={'bottom'}
      height={'92%'}
      closable={false}
      onClose={() => setCreateWay(undefined)}
      open={open}
      key={'placement-bottom'}>
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Input
            className={cls['search-person-input']}
            placeholder={'搜索模板'}
            size={'middle'}
            suffix={
              <Tooltip>
                <SearchOutlined size={16} />
              </Tooltip>
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {tags.map((item: any) => {
            return (
              <Tag key={item.id} closable onClose={() => handleClose(item.id)}>
                {item.name}
              </Tag>
            );
          })}
          <TreeSelect {...tProps} />
          {/* <Dropdown menu={{ items: dropdownItems }}>
          <a>
            <Space style={{ paddingLeft: 20, paddingTop: 5 }}>
              添加标签
              <DownOutlined />
            </Space>
          </a>
        </Dropdown> */}
          {/* <Radio.Group
          value={choosedFirstSpecies}
          style={{
            width: '70%',
            paddingLeft: 20,
          }}
          onChange={(e) => setChoosedFirstSpecies(e.target.value)}>
          {firstSpecies.map((item) => {
            return (
              <Radio.Button
                key={item.id}
                value={item.id}
                style={{
                  width: 100,
                  textAlign: 'center',
                }}>
                {item.name}
              </Radio.Button>
            );
          })}
        </Radio.Group> */}
        </div>
        <CardOrTable<XOperation>
          rowKey={'id'}
          request={async (page) => {
            return await loadOperations(page);
          }}
          columns={OperationColumns}
          showChangeBtn={false}
          dataSource={[]}
          operation={renderOperate}
        />
        <ViewFormModal
          data={editData}
          open={viewFormOpen}
          handleCancel={() => {
            setViewFormOpen(false);
          }}
          handleOk={() => {
            setViewFormOpen(false);
          }}
        />
        <ViewCardModal
          data={editData}
          open={viewCardOpen}
          handleCancel={() => {
            setViewCardOpen(false);
          }}
          handleOk={() => {
            setViewCardOpen(false);
          }}
        />
      </>
    </Drawer>
  );
};

export default selectAppTemplate;
