import React, { useEffect, useState } from 'react';
import { Modal, TreeSelect } from 'antd';
import thingCtrl from '@/ts/controller/thing';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import userCtrl from '@/ts/controller/setting';
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
  onOk: Function;
  onCancel: Function;
}
const { SHOW_PARENT } = TreeSelect;
const ChooseOperation: React.FC<Iprops> = (props) => {
  const [keyword, setKeyword] = useState('');
  const [treeData, setTreeData] = useState<any>();
  const [editData, setEditData] = useState<XOperation>();
  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);
  const [viewCardOpen, setViewCardOpen] = useState<boolean>(false);
  const [choosedSpeciesId, setChoosedSpeciesId] = useState<string>();
  const [species, setSpecies] = useState<any>();
  const [choosedSpecies, setChoosedSpecies] = useState<any>();

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
  const findSpeciesById = (parent: any, id: string) => {
    if (parent.id == id) {
      return parent;
    }
    if (parent.children) {
      for (let child of parent.children) {
        let result: any = findSpeciesById(child, id);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  };
  const init = async () => {
    const species = await thingCtrl.loadSpeciesTree();
    if (species) {
      setSpecies(species);
      setChoosedSpeciesId(species.id);
      setChoosedSpecies(species);
      setTreeData(buildSpeciesChildrenTree([species]));
    }
  };
  useEffect(() => {
    init();
  }, [userCtrl.space.id]);

  const tProps = {
    treeData,
    key: choosedSpeciesId,
    value: choosedSpeciesId,
    onChange: (e: any) => {
      setChoosedSpeciesId(e);
      setChoosedSpecies(findSpeciesById(species, e));
    },
    treeCheckable: false,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '选择标签',
    style: {
      width: '74%',
    },
  };

  const loadOperations = async (page: PageRequest) => {
    return (
      await kernel.querySpeciesOperation({
        id: choosedSpeciesId || '',
        spaceId: userCtrl.space.id,
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
      {
        key: '使用',
        label: '使用',
        onClick: () => {
          props.onOk({ operation: item, species: choosedSpecies, design: item });
        },
      },
    ];
  };
  return (
    <Modal
      title="选择表单"
      open={props.open}
      footer={[]}
      onCancel={() => {
        props.onCancel();
      }}
      width="80%">
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
        <TreeSelect {...tProps} />
      </div>
      <CardOrTable<XOperation>
        key={choosedSpeciesId}
        rowKey={'id'}
        param={choosedSpeciesId}
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
    </Modal>
  );
};
export default ChooseOperation;
