import React, { useState } from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { IForm } from '@/ts/core';
import * as config from './config';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import MinLayout from '@/components/MainLayout/minLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import WorkForm from '@/components/DataStandard/WorkForm';
import GenerateThingTable from '@/executor/tools/generate/thingTable';
import CustomStore from 'devextreme/data/custom_store';
import { kernel } from '@/ts/base';
import { ImCopy, ImShuffle, ImTicket } from 'react-icons/im';
import { Controller } from '@/ts/controller';
import { Spin, message } from 'antd';
import ThingView from './detail';
import useAsyncLoad from '@/hooks/useAsyncLoad';

interface IProps {
  form: IForm;
  finished: () => void;
}

/** 表单查看 */
const FormView: React.FC<IProps> = ({ form, finished }) => {
  const [select, setSelcet] = useState();
  const [loaded] = useAsyncLoad(() => form.loadContent());
  const FormBrower: React.FC = () => {
    const [, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
      () => config.loadSpeciesItemMenu(form),
      new Controller(form.key),
    );
    if (!selectMenu || !rootMenu) return <></>;
    const loadContent = () => {
      if (select) {
        return (
          <ThingView form={form} thingData={select} onBack={() => setSelcet(undefined)} />
        );
      }
      return (
        <GenerateThingTable
          key={form.key}
          height={'100%'}
          fields={form.fields}
          onRowDblClick={(e: any) => setSelcet(e.data)}
          filterValue={JSON.parse(form.metadata.searchRule ?? '[]')}
          dataSource={
            new CustomStore({
              key: 'id',
              async load(loadOptions) {
                loadOptions.userData = [`F${form.id}`];
                if (selectMenu.item?.value) {
                  loadOptions.userData.push(selectMenu.item.value);
                } else if (selectMenu.item?.code) {
                  loadOptions.userData.push(selectMenu.item.code);
                }
                const result = await kernel.loadThing(
                  form.belongId,
                  [form.belongId],
                  loadOptions,
                );
                return result;
              },
            })
          }
          remoteOperations={true}
          toolbar={{
            visible: true,
            items: [
              {
                name: 'columnChooserButton',
                location: 'after',
              },
              {
                name: 'searchPanel',
                location: 'after',
              },
            ],
          }}
          dataMenus={{
            items: [
              {
                key: 'createNFT',
                label: '生成存证',
                icon: <ImTicket fontSize={22} color={'#3838b9'} />,
                onClick: () => {
                  message.success('存证成功!');
                },
              },
              {
                key: 'copyBoard',
                label: '复制数据',
                icon: <ImCopy fontSize={22} color={'#3838b9'} />,
              },
              {
                key: 'startWork',
                label: '发起办事',
                icon: <ImShuffle fontSize={22} color={'#3838b9'} />,
              },
            ],
            onMenuClick(key, data) {
              // console.log(key, data);
            },
          }}
        />
      );
    };
    return (
      <MinLayout
        selectMenu={selectMenu}
        onSelect={(data) => {
          setSelectMenu(data);
        }}
        siderMenuData={rootMenu}>
        {loadContent()}
      </MinLayout>
    );
  };
  return (
    <FullScreenModal
      centered
      open={true}
      fullScreen
      width={'80vw'}
      title={form.name}
      bodyHeight={'80vh'}
      icon={<EntityIcon entityId={form.id} />}
      destroyOnClose
      onCancel={() => finished()}>
      {loaded ? (
        form.canDesign ? (
          <FormBrower />
        ) : (
          <WorkForm form={form} />
        )
      ) : (
        <Spin tip={'配置信息加载中...'}>
          <div style={{ width: '100%', height: '100%' }}></div>
        </Spin>
      )}
    </FullScreenModal>
  );
};

export default FormView;
