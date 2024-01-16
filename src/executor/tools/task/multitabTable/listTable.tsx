import React, { useEffect } from 'react';
import GenerateThingTable from '@/executor/tools/generate/thingTable';

interface IConfig {
  label: string;
  key: string;
  tableHeader: [];
  tableData: [];
  buttonList: any;
}

interface IProps {
  tableConfig: IConfig;
  node: any;
  handleValueChange: any;
}

const ListTable: React.FC<IProps> = (props) => {
  const { tableConfig } = props;
  const { tableHeader = [], tableData = [] } = tableConfig;
  return (
    <div>
      <GenerateThingTable
        fields={tableHeader}
        height={'70vh'}
        dataSource={tableData}
        onSelectionChanged={(res) => {
          props.handleValueChange(res);
        }}
        remoteOperations={true}
        toolbar={props.tableConfig.buttonList}
      />
    </div>
  );
};

export default ListTable;
