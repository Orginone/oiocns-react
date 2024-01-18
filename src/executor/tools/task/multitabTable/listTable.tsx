import React, { useState } from 'react';
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
  handleChange: any;
}

const ListTable: React.FC<IProps> = (props) => {
  const { tableConfig } = props;
  const { tableHeader = [], tableData = [] } = tableConfig;
  const [checkList, setCheckList] = useState([]);
  // if (Number(props.tableConfig.key) - 1 == 0) {
  //   let newData = [...tableData];
  //   console.log('newData', newData);
  //   newData.forEach((element) => {
  //     for (const key in element.data.primary) {
  //       element['T' + key] = element.data.primary[key];
  //     }
  //   });
  // }
  // useEffect(() => {

  //   setTabTableData(newData);
  //   console.log('newData', newData);
  // }, []);
  const getbtns = (index: number, checkList: any) => {
    let data = [
      {
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '新增',
              icon: 'add',
              onClick: () => {
                props.handleChange(checkList, 'add');
              },
            },
            visible: true,
          },
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '编辑',
              onClick: () => {
                props.handleChange(checkList, 'edit');
              },
            },
            visible: true,
          },
          {
            name: 'remove',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '删除',
              onClick: () => {
                props.handleChange(checkList, 'remove');
              },
            },
            visible: true,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
      {
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '查看',
              icon: '',
              onClick: () => {
                props.handleChange(checkList, 'add');
              },
            },
            visible: true,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
      {
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '查看',
              icon: '',
              onClick: () => {
                props.handleChange(checkList, 'add');
              },
            },
            visible: true,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
    ];
    return data[index];
  };
  return (
    <div>
      <GenerateThingTable
        fields={tableHeader}
        height={'70vh'}
        dataSource={tableData}
        onSelectionChanged={(res: any) => {
          setCheckList(res);
        }}
        remoteOperations={true}
        toolbar={getbtns(Number(props.tableConfig.key) - 1, checkList)}
      />
    </div>
  );
};

export default ListTable;
