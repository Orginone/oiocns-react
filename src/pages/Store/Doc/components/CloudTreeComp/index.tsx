import React, { useEffect, useState } from 'react';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import StoreClassifyTree from '@/components/CustomTreeComp';
import ResetNameModal from '../ResetName';
import CoppyOrMove from '../CoppyOrMove';
import { getIcon, getItemMenu } from '../CommonMenu';
import cls from './index.module.less';

const DocClassifyTree: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moveModalOpen, setMoveModalOpen] = useState<boolean>(false);
  const [reNameKey, setReNameKey] = useState<string>('');
  const [createFileName, setCreateFileName] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('新建文件夹');
  const [treeData, setTreeData] = useState<any[]>();
  const [keys, setKeys] = useState([docsCtrl.current?.key ?? '']);
  const [expKeys, setExpKeys] = useState([docsCtrl.current?.key ?? '']);
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
      setCurrentTaget(docsCtrl.current);
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
  const onExpand = async (
    expandedKeys: string[],
    { expanded, node }: { expanded: boolean; node: any },
  ) => {
    setExpKeys(expandedKeys);
    if (expanded) {
      await docsCtrl.open(node.key);
    }
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
          expandedKeys={expKeys}
          selectedKeys={keys}
          onSelect={onSelect}
          onExpand={onExpand}
          handleMenuClick={handleMenuClick}
          icon={getIcon}
        />
      )}
      <ResetNameModal
        reNameKey={reNameKey}
        open={isModalOpen}
        title={modalTitle}
        value={createFileName}
        onChange={(val) => {
          setIsModalOpen(val);
          setCurrentTaget(docsCtrl.current);
        }}
      />
      <CoppyOrMove
        currentTaget={currentTaget}
        open={moveModalOpen}
        title={coppyOrMoveTitle}
        onChange={(val) => {
          setMoveModalOpen(val);
          setCurrentTaget(docsCtrl.current);
        }}
      />
    </>
  );
};

export default React.memo(DocClassifyTree);
