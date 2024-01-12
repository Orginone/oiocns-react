import React from 'react';
import GenerateThingTable from '@/executor/tools/generate/thingTable';

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
  const { tableHeader = [], tableData = [] } = tableConfig;
  let form = props.node.primaryForms[0];
  return (
    <div>
      <GenerateThingTable
        fields={tableHeader}
        height={'70vh'}
        dataSource={tableData}
        onSelectionChanged={(res) => {
          console.log('选中的值', res);
        }}
        remoteOperations={true}
        toolbar={props.tableConfig.buttonList}
      />
    </div>
  );
};

export default ListTable;
