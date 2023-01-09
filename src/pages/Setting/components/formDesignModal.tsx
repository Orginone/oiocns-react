import React from 'react';
import Generator, { FRGeneratorProps } from 'fr-generator';

interface FormDesignProps extends FRGeneratorProps {
  onSchemaChange: (schema: any) => void;
}

/*
  表单设计模态框
*/
const FormDesignModal = (props: FormDesignProps) => {
  let defaultValue = undefined;
  if (typeof props.defaultValue === 'string') {
    defaultValue = JSON.parse(props.defaultValue);
  } else {
    defaultValue = props.defaultValue;
  }
  return (
    <Generator
      defaultValue={defaultValue}
      onSchemaChange={(schema) => props.onSchemaChange(schema)}
    />
  );
};

export default FormDesignModal;
