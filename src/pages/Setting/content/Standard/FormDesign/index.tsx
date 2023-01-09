import React from 'react';
import Generator from 'fr-generator';

const defaultValue = {
  type: 'object',
  properties: {
    inputName: {
      title: '简单输入框',
      type: 'string',
    },
  },
};

const FormDesign: React.FC = () => {
  return (
    <Generator
      defaultValue={defaultValue}
      onChange={(data) => console.log('data:change', data)}
      onSchemaChange={(schema) => console.log('schema:change', schema)}
    />
  );
};

export default FormDesign;
