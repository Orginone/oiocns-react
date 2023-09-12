import React, { useState } from 'react';
import { Col, InputNumber, Row, Slider } from 'antd';
type SliderNumberProps = {
  onChange?: (value: any) => void;
};
const SliderNumber = (props: SliderNumberProps) => {
  const { onChange } = props;
  const [inputValue, setInputValue] = useState(100);
  const handChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue + '%');
    }
    setInputValue(newValue);
  };

  return (
    <Row>
      <Col span={14}>
        <Slider
          min={0}
          max={100}
          onChange={handChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
        />
      </Col>
      <Col span={6}>
        <InputNumber
          min={0}
          max={100}
          style={{ margin: '0 16px' }}
          value={inputValue}
          defaultValue={100}
          formatter={(value) => `${value}%`}
          parser={(value) => value!.replace('%', '')}
          onChange={handChange}
        />
      </Col>
    </Row>
  );
};

export default SliderNumber;
