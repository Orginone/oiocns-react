import React from 'react';
import GenerateThingTable from '@/executor/tools/generate/thingTable';
import CustomStore from 'devextreme/data/custom_store';
import { kernel } from '@/ts/base';

interface IConfig {
  label: string;
  key: string | number;
  tableHeader: [];
  tableData: [];
  buttonList: any;
}

interface IProps {
  tableConfig: IConfig;
  node: any;
}

const ListTable: React.FC<IProps> = (props) => {
  const { tableConfig } = props;
  const { tableHeader = [] } = tableConfig;
  let form = props.node.primaryForms[0];
  return (
    <div>
      <GenerateThingTable
        fields={tableHeader}
        height={'70vh'}
        dataSource={
          new CustomStore({
            key: 'id',
            async load(loadOptions: any) {
              let loadOption: any = loadOptions;
              loadOption.belongId = form.belongId;
              let userId = 'F' + form.id;
              loadOption.userData = [];
              loadOption.userData.push(userId);
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
        toolbar={props.tableConfig.buttonList}
      />
    </div>
  );
};

export default ListTable;
