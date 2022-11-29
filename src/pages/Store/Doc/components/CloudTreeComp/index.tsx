// import { SearchOutlined } from '@ant-design/icons';
// import { Input, Tree } from 'antd';
import { ImFolderOpen, ImFolder, ImRedo, ImFilesEmpty, ImDownload } from 'react-icons/im';
import React, { useEffect, useState } from 'react';

import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import StoreClassifyTree from '@/components/CustomTreeComp';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import ResetNameModal from '../ResetName';
import CoppyOrMove from '../CoppyOrMove';

const DocClassifyTree: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moveModalOpen, setMoveModalOpen] = useState<boolean>(false);
  const [reNameKey, setReNameKey] = useState<string>('');
  const [createFileName, setCreateFileName] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('新建文件夹');
  const [expKeys, setExpKeys] = useState(['']);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [keys, setKeys] = useState([docsCtrl.current?.key ?? '']);
  const [coppyOrMoveTitle, setCoppyOrMoveTitle] = useState<string>('复制到');
  const [currentTaget, setCurrentTaget] = useState<any>(docsCtrl.current);
  const refreshUI = () => {
    if (docsCtrl.current) {
      setKeys([docsCtrl.current.key]);
      let tkeys = docsCtrl.current.key.split('/');
      tkeys.forEach((_, index) => {
        const item = tkeys.slice(0, index + 1).join('/');
        if (!expKeys.includes(item)) {
          expKeys.push(item);
        }
      });
      setExpKeys([...expKeys]);
    }
    setTreeData([loadTreeData(docsCtrl.root)]);
  };
  const loadTreeData = (item: any) => {
    let result: any = {
      key: item.key,
      icon: expKeys.includes(item.key) ? (
        <ImFolderOpen color="#c09553" />
      ) : (
        <ImFolder color="#c09553" />
      ),
      menus: getItemMenu(item),
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
    console.log(selectedKeys);
    if (selectedKeys.length > 0) {
      docsCtrl.open(selectedKeys[0]);
    }
  };
  const loadChild = async (node: any) => {
    if (node.children.length === 0) await docsCtrl.open(node.key);
  };
  const getItemMenu = (el: any) => {
    if (el.key === '') {
      return ['刷新', '新建文件夹'];
    }
    if (el.key === '主目录')
      return [
        {
          key: '4',
          icon: <ImFilesEmpty />,
          label: <div>复制到</div>,
        },
      ];
    return [
      {
        key: '1',
        icon: <FaTrashAlt />,
        label: `删除`,
      },
      {
        key: '2',
        icon: <FaEdit />,
        label: `重命名`,
      },
      {
        key: '3',
        icon: <ImRedo />,
        label: <div>移动到</div>,
      },
      {
        key: '4',
        icon: <ImFilesEmpty />,
        label: <div>复制到</div>,
      },
      {
        key: '5',
        icon: <ImDownload />,
        label: <div>下载</div>,
      },
    ];
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
        setCurrentTaget(node);
        setCoppyOrMoveTitle('移动到');
        setMoveModalOpen(true);
        break;
      case '4': // 复制到
        setCurrentTaget(node);
        setCoppyOrMoveTitle('复制到');
        setMoveModalOpen(true);
        break;
      case '5': // 下载
        setReNameKey(node.title);
        setModalTitle('重命名');
        setIsModalOpen(true);
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
      <StoreClassifyTree
        isDirectoryTree
        menu={'menus'}
        searchable
        showIcon
        treeData={treeData}
        // loadData={loadChild}
        expandedKeys={expKeys}
        selectedKeys={keys}
        onSelect={onSelect}
        onExpand={(
          expandedKeys: string[],
          { expanded: bool, node }: { expanded: boolean; node: any },
        ) => {
          if (expandedKeys.length > 0 && bool) {
            loadChild(node);
          }
          setExpKeys(
            expandedKeys.map((item) => {
              return item.toString();
            }),
          );
        }}
        // handleTitleClick={(node) => docsCtrl.open(node.key)}
        // handleAddClick={handleAddShop}
        handleMenuClick={handleMenuClick}
      />
      <ResetNameModal
        reNameKey={reNameKey}
        open={isModalOpen}
        title={modalTitle}
        value={createFileName}
        onChange={setIsModalOpen}
      />
      <CoppyOrMove
        treeData={treeData}
        currentTaget={currentTaget}
        onSelect={onSelect}
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
