import React, { useEffect, useState } from 'react';
import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import { SelectBox } from 'devextreme-react';
import { SelectBoxTypes } from 'devextreme-react/select-box';
import DateRangeBox from 'devextreme-react/date-range-box';
import { formatDate } from '@/utils';

interface IAttributeProps {
  current: IForm;
  notifyEmitter: Emitter;
}

const ReportConfig: React.FC<IAttributeProps> = ({ notifyEmitter, current }) => {
  const [value, setValue] = useState<string>('year');
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  const notityAttrChanged = () => {
    notifyEmitter.changCallback('form');
  };
  const items = [
    { name: '年', id: 'year' },
    { name: '月', id: 'month' },
    { name: '自定义日期', id: 'custom' },
  ];

  useEffect(() => {
    if (current.metadata?.cycle) {
      const newDate = JSON.parse(current.metadata?.cycle);
      if (newDate instanceof Array && newDate.length > 0) {
        setStartDate(newDate[0]);
        setEndDate(newDate[1]);
        setValue('custom');
      } else {
        setValue(newDate);
      }
    }
  }, [current]);

  const onValueChanged = (e: SelectBoxTypes.ValueChangedEvent) => {
    setValue(e.value);
    current.metadata.cycle = JSON.stringify(e.value);
    notityAttrChanged();
  };

  const onCurrentValueChange = (e: any) => {
    const startDate = e.value[0] ? formatDate(e.value[0], 'yyyy-MM-dd') : undefined;
    const endDate = e.value[1] ? formatDate(e.value[1], 'yyyy-MM-dd') : undefined;
    current.metadata.cycle = JSON.stringify([startDate, endDate]);
    notityAttrChanged();
  };

  return (
    <>
      <Form
        scrollingEnabled
        height={'calc(100vh - 130px)'}
        formData={current.metadata}
        onFieldDataChanged={notityAttrChanged}>
        <GroupItem caption={'报表参数'} />
        <SimpleItem dataField="name" isRequired={true} label={{ text: '名称' }} />
        <SimpleItem dataField="code" isRequired={true} label={{ text: '代码' }} />
        <SimpleItem dataField="cycle" isRequired={true} label={{ text: '填报周期' }}>
          <SelectBox
            defaultValue={value}
            searchMode="contains"
            searchExpr={'name'}
            dataSource={items}
            displayExpr={'name'}
            valueExpr={'id'}
            onValueChanged={onValueChanged}
          />
        </SimpleItem>
        {value === 'custom' && (
          <SimpleItem isRequired={true} label={{ text: '自定义日期' }}>
            <DateRangeBox
              defaultStartDate={startDate}
              defaultEndDate={endDate}
              onValueChanged={onCurrentValueChange}
              displayFormat="yyyy-MM-dd"
            />
          </SimpleItem>
        )}
        <SimpleItem
          dataField="remark"
          editorType="dxTextArea"
          isRequired={true}
          label={{ text: '报表描述' }}
          editorOptions={{
            height: 100,
          }}
        />
      </Form>
    </>
  );
};

export default ReportConfig;
