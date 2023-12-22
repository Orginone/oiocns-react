import React, { useEffect, useState } from 'react';
import { IFile, ITarget, IWorkTask } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus, operatesToMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';
import { Button, Spin } from 'antd';
import { targetOperates } from '@/ts/core/public';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import { ImUndo2 } from 'react-icons/im';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

/**
 * 关系-内容导航
 */
const Content: React.FC = () => {
  const [current, setCurrent] = useState<ITarget | 'disk'>('disk');
  const [key] = useCtrlUpdate(current === 'disk' ? orgCtrl.user : current);
  const [currentTag, setCurrentTag] = useState('全部');
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();
  useEffect(() => {
    command.emitter('preview', 'relation', focusFile);
  }, [focusFile]);
  useEffect(() => {
    setCurrentTag('全部');
  }, [current]);
  const contextMenu = (file?: IFile) => {
    const entity = file ?? current;
    if (entity != 'disk') {
      return {
        items: cleanMenus(loadFileMenus(entity)) || [],
        onClick: ({ key }: { key: string }) => {
          command.emitter('executor', key, entity);
        },
      };
    } else {
      return {
        items:
          cleanMenus(
            operatesToMenus(
              [targetOperates.NewCompany, targetOperates.JoinCompany],
              orgCtrl.user,
            ),
          ) || [],
        onClick: ({ key }: { key: string }) => {
          command.emitter('executor', key, orgCtrl.user);
        },
      };
    }
  };

  const focusHanlder = (file: IFile | undefined) => {
    const focused = file && focusFile && file.key === focusFile.key;
    if (focused) {
      setFocusFile(undefined);
    } else {
      setFocusFile(file);
    }
  };

  const clickHanlder = (file: ITarget | undefined, dblclick: boolean) => {
    if (dblclick) {
      clearHanlder();
      if (file) {
        setCurrent(file);
      }
    } else {
      submitHanlder(() => focusHanlder(file), 300);
    }
  };

  const getContent = () => {
    const contents: IFile[] = [];
    if (current === 'disk') {
      contents.push(orgCtrl.user, ...orgCtrl.user.companys);
    } else {
      contents.push(...current.content());
    }
    return contents;
  };

  const renderHeader = () => {
    return (
      <div style={{ marginLeft: 10, padding: 2, fontSize: 16, height: 28 }}>
        {current != 'disk' && (
          <Button
            type="link"
            title="返回"
            icon={<ImUndo2 />}
            onClick={() => setCurrent(current.superior as ITarget)}
          />
        )}
        {current != 'disk' ? (
          <>
            <EntityIcon entity={current.metadata} notAvatar disInfo size={22} />
            <span style={{ paddingLeft: 6 }}>{current.name}</span>
          </>
        ) : (
          <>
            <OrgIcons relation />
            <span style={{ paddingLeft: 6 }}>设置</span>
          </>
        )}
      </div>
    );
  };
  return (
    <Spin spinning={false} tip={'加载中...'}>
      {renderHeader()}
      <DirectoryViewer
        key={key}
        initTags={['全部']}
        selectFiles={[]}
        extraTags={true}
        focusFile={focusFile}
        content={getContent()}
        currentTag={currentTag}
        tagChanged={(t) => setCurrentTag(t)}
        fileOpen={(entity, dblclick) => clickHanlder(entity as ITarget, dblclick)}
        contextMenu={(entity) => contextMenu(entity as IWorkTask)}
      />
    </Spin>
  );
};
export default Content;
