import React, { useEffect, useRef } from 'react';
import { MenuItemType } from '../../../../../typings/globelType';
import MainLayout from '../../../../components/MainLayout';
import useMenuUpdate from '../../../../hooks/useMenuUpdate';
import { Command } from '../../../../ts/base';
import orgCtrl, { Controller } from '../../../../ts/controller';
import { IDirectory } from '../../../../ts/core';
import FullScreenModal from '../../../tools/fullScreen';
import { loadMenu } from './../index';
import Top from './layout/top';

interface IProps {
  current: IDirectory;
  finished: () => void;
}

const RequestModal: React.FC<IProps> = ({ current: dir, finished }) => {
  const command = useRef(new Command());
  const ctrl = useRef(new Controller(''));

  const onSelect = (menu: MenuItemType) => {
    setSelected(menu as MenuItemType);
    command.current.emitter('', 'onSelect', menu as MenuItemType);
  };

  useEffect(() => {
    const id = command.current.subscribe((_: string, cmd: string, args: any) => {
      if (cmd == 'onAdd') {
        orgCtrl.changCallback();
        ctrl.current.changCallback();
        onSelect(args as MenuItemType);
      } else if (cmd == 'onTabSelected') {
        onSelect(args as MenuItemType);
      }
    });
    return () => {
      command.current.unsubscribe(id);
    };
  }, [command, ctrl]);

  const [_, root, selected, setSelected] = useMenuUpdate(
    () => loadMenu(dir, '请求'),
    ctrl.current,
  );

  if (!root || !selected) return <></>;
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'请求配置'}
      onCancel={() => finished()}>
      <MainLayout siderMenuData={root} selectMenu={selected} onSelect={onSelect}>
        <Top dir={dir} cmd={command.current} />
      </MainLayout>
    </FullScreenModal>
  );
};

export default RequestModal;
