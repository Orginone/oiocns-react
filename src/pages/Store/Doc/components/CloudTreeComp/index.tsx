import React, { useEffect, useState } from 'react';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import StoreClassifyTree from '@/components/CustomTreeComp';
import ResetNameModal from '../ResetName';
import CoppyOrMove from '../CoppyOrMove';
import { getItemMenu } from '../CommonMenu';
import { FolderOpenTwoTone, FolderTwoTone } from '@ant-design/icons';
import cls from './index.module.less';

const DocClassifyTree: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moveModalOpen, setMoveModalOpen] = useState<boolean>(false);
  const [reNameKey, setReNameKey] = useState<string>('');
  const [createFileName, setCreateFileName] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('新建文件夹');
  // const [expKeys, setExpKeys] = useState(['']);
  const [treeData, setTreeData] = useState<any[]>();
  const [keys, setKeys] = useState([docsCtrl.current?.key ?? '']);
  const [coppyOrMoveTitle, setCoppyOrMoveTitle] = useState<string>('复制到');
  const [currentTaget, setCurrentTaget] = useState<any>(docsCtrl.current);
  const refreshUI = () => {
    if (docsCtrl.current) {
      setKeys([docsCtrl.current.key]);
    }
    setTreeData([loadTreeData(docsCtrl.root)]);
  };
  const loadTreeData = (item: any) => {
    let result: any = {
      key: item.key,
      menus: getItemMenu(item, true),
      title: item.name,
      children: [],
      isLeaf: !item.target.hasSubDirectories,
    };
    if (item.children.length > 0) {
      for (let i = 0; i < item.children.length; i++) {
        if (item.children[i].target.isDirectory) {
          result.children.push(loadTreeData(item.children[i]));
        }
      }
    }
    return result;
  };
  useEffect(() => {
    const id = docsCtrl.subscribe(refreshUI);
    return () => {
      docsCtrl.unsubscribe(id);
    };
  }, []);

  const onSelect = (selectedKeys: string[]) => {
    if (selectedKeys.length > 0) {
      docsCtrl.open(selectedKeys[0]);
    }
  };
  const getIcon = (props: { expanded: boolean; selected: boolean; isLeaf: boolean }) => {
    // eslint-disable-next-line react/prop-types
    const { expanded, selected, isLeaf } = props;
    const color = '#c09553';
    return expanded || (selected && isLeaf) ? (
      <FolderOpenTwoTone twoToneColor={color} />
    ) : (
      <FolderTwoTone twoToneColor={color} />
    );
  };

  const handleMenuClick = async (key: string, node: any) => {
    switch (key) {
      case '1': // 删除
        if (await docsCtrl.refItem(node.key)?.delete()) {
          docsCtrl.changCallback();
        }
        break;
      case '2': // 重命名
        setReNameKey(node.key);
        setCreateFileName(node.title);
        setModalTitle('重命名');
        setIsModalOpen(true);
        break;
      case '3': // 移动到
        setCurrentTaget(docsCtrl.refItem(node.key));
        setCoppyOrMoveTitle('移动到');
        setMoveModalOpen(true);
        break;
      case '4': // 复制到
        setCurrentTaget(docsCtrl.refItem(node.key));
        setCoppyOrMoveTitle('复制到');
        setMoveModalOpen(true);
        break;
      case '5': // 下载
        break;
      case '新建文件夹': // 新建文件夹
        setReNameKey(node.key);
        setCreateFileName('');
        setModalTitle('新建文件夹');
        setIsModalOpen(true);
        break;
      case '刷新': // 刷新
        docsCtrl.refItem('')?.loadChildren(true);
        docsCtrl.changCallback();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {treeData && (
        <StoreClassifyTree
          className={cls.docTree}
          title={'文档目录'}
          fieldNames={{ title: 'name' }}
          isDirectoryTree
          menu={'menus'}
          searchable
          showIcon
          treeData={treeData}
          defaultExpandedKeys={['']}
          selectedKeys={keys}
          onSelect={onSelect}
          handleMenuClick={handleMenuClick}
          icon={getIcon}
        />
      )}
      <ResetNameModal
        reNameKey={reNameKey}
        open={isModalOpen}
        title={modalTitle}
        value={createFileName}
        onChange={setIsModalOpen}
      />
      <CoppyOrMove
        // treeData={docsCtrl.home?.parent}
        currentTaget={currentTaget}
        open={moveModalOpen}
        title={coppyOrMoveTitle}
        onChange={setMoveModalOpen}
      />
    </>
    // <div>
    //   <div className={cls.title}>全部分类</div>
    //   <div className={cls.title}>
    //     <Input size="small" prefix={<SearchOutlined />} placeholder="搜索分类" />
    //   </div>
    //   <Tree
    //     className="draggable-tree"
    //     blockNode
    //     showIcon
    //     treeData={treeData}
    //     onSelect={onSelect}
    //     selectedKeys={keys}
    //     expandedKeys={expKeys}
    //     onExpand={(keys) => {
    //       setExpKeys(
    //         keys.map((item) => {
    //           return item.toString();
    //         }),
    //       );
    //     }}></Tree>
    // </div>
  );
};

export default React.memo(DocClassifyTree);
