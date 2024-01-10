import React from 'react';
import GenerateThingTable from '@/executor/tools/generate/thingTable';

interface IConfig {
  label: string;
  key: string | number;
  tableHeader: [];
  tableData: []
  buttonList?: []
}

interface IProps {
  tableConfig: IConfig;
}

const ListTable: React.FC<IProps> = (props) => {
  const { tableConfig } = props;
  console.log('tableConfig====', tableConfig)
  const { tableHeader = [], tableData = [] } = tableConfig;
  return (
    <div>
      <GenerateThingTable
        fields={tableHeader}
        height={'70vh'}
        dataSource={tableData}
        remoteOperations={true}
      />
    </div>
  );
};

export default ListTable;