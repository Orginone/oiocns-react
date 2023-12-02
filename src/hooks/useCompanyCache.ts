import { useState, useEffect } from 'react';
import orgCtrl from '@/ts/controller';
import { command } from '@/ts/base';
import { schema } from '@/ts/base';
import { IApplication, IDirectory, IWork } from '@/ts/core';
import { Form } from '@/ts/core/thing/standard/form';
import { useHistory } from 'react-router-dom';
type resultProps = [
  boolean,
  schema.XHomeCacheData[],
  (item: schema.XHomeCacheData) => void,
  () => void,
];

/**
 * 单位数据获取hook
 * @param {String} dataTag 单位数据标记
 * @param {String} tagName 数据分组标记
 * @return []
 */
function useConpanyCacheData(dataTag: string, tagName: string): resultProps {
  const history = useHistory();
  const [cacheDatas, setCacheDatas] = useState<schema.XHomeCacheData[]>([]);
  const [loaded, setLoaded] = useState(orgCtrl.provider.inited);
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  // const hostname = window.location.hostname;
  const hostname = 'anxinwu';
  if (!hostname.startsWith('anxinwu')) {
    return [true, [], () => {}, () => {}];
  }

  useEffect(() => {
    loaded && loadCacheData();
    const id = command.subscribeByFlag('applications', async (done: boolean) => {
      setApplications(await orgCtrl.loadApplications());
      if (done === true) {
        loadCacheData();
        setTimeout(() => {
          setLoaded(true);
        }, 100);
      }
    });
    return () => {
      command.unsubscribeByFlag(id);
    };
  }, [isRefresh]);
  /**
   * 数据获取
   */
  const loadCacheData = () => {
    const cacheData: schema.XHomeCacheData[] = [];
    for (const comp of orgCtrl.user.companys) {
      const cacheHomeData = comp.cacheObj.getValue(dataTag);
      if (cacheHomeData && typeof cacheHomeData === 'object') {
        cacheData.push(...Object.values(cacheHomeData));
      }
    }

    const result: any[] = cacheData
      .filter((item) => item.tag === tagName)
      .map((it) => {
        // it.metadata = orgCtrl.user.findMetadata(it.id)
        // it.share = orgCtrl.user.findShareById(it.id);
        return it;
      })
      .sort((a, b) => a.sort - b.sort);

    setCacheDatas(result);
  };
  /**
   * 打开数据项
   * @param {schema.XHomeCacheData} item 点击项
   * @returns {void} 无返回值
   */
  async function handleOpenItem(selected: schema.XHomeCacheData) {
    const item: any = (await findSysItem(selected)) || {};
    switch (item.typeName || selected.typeName) {
      case '目录':
      case '模块':
        {
          orgCtrl.currentKey = item.key;
          history.push('/store');
          command.emitter('executor', 'preview', item);
        }
        break;
      case '办事':
      case '表单':
        {
          command.emitter('executor', 'open', item);
        }
        break;
      case '跳转':
        {
          if (['工作流角色配置', '工作流流程配置'].includes(selected.name)) {
            const data: any = {
              id: '445708344880140288__',
              typeName: '成员目录',
              metadata: { shareId: '445708344880140288' },
            };
            const _directory: any = orgCtrl.user.companys.find(
              (v) => v.id === '445708344880140288',
            )?.directory;
            orgCtrl.currentKey = _directory.key;
            history.push('/relation');
            const _dir = await findSysItem(data);
            command.emitter('executor', 'settingIdentity', _dir, _dir.key);
            return;
          }
          orgCtrl.currentKey = '';
          history.push('/work');
        }
        break;
      default:
        break;
    }
  }
  //查找系统对应项
  async function findSysItem(item: {
    id: string;
    typeName: string;
    metadata: schema.XStandard;
  }): Promise<any> {
    //限定单位数据
    const _directory: any = orgCtrl.user.companys.find(
      (v) => v.id === '445708344880140288',
    )?.directory;
    switch (item.typeName) {
      case '成员目录': {
        return _directory.directory.memberDirectory;
      }
      case '目录': {
        return _directory && findDirectoryItem([_directory], item);
      }
      case '办事':
      case '模块':
        return await findAppItemById(
          item.id,
          applications.filter((app) => app.belongId === item.metadata.shareId),
          item.typeName === '办事' ? 'work' : 'module',
        );
      case '表单': {
        if (_directory) {
          const formDir: IDirectory = findDirectoryItem([_directory], {
            id: item.metadata.directoryId,
            typeName: '目录',
          });
          return formDir ? new Form(item.metadata as schema.XForm, formDir) : undefined;
        }
        return;
      }
      case '审批':
        break;
      default:
        console.error('Unknown item type: ' + item.typeName);
        break;
    }
  }
  // 遍历app模块查询指定数据
  async function findAppItemById(
    id: string,
    apps: IApplication[],
    type: 'work' | 'module',
  ): Promise<any> {
    for (const app of apps) {
      let result: IWork | IApplication | undefined;
      if (type === 'module') {
        result = await app.findModule(id);
      } else {
        result = await app.findWork(id);
      }
      if (result) {
        return result;
      }
    }
  }
  //遍历文件系统获取目标数据
  function findDirectoryItem(
    dirs: IDirectory[],
    findObj: { id: string; typeName: string },
  ) {
    const result = dirs.find((id) => id.id === findObj.id);
    if (result) return result;

    for (const dirItem of dirs) {
      if (dirItem.children.length > 0) {
        const childResult: any = findDirectoryItem(dirItem.children, findObj);
        if (childResult) return childResult;
      }
    }
  }
  function refresh(): void {
    setIsRefresh(!isRefresh);
  }
  return [loaded, cacheDatas, handleOpenItem, refresh];
}

export default useConpanyCacheData;
