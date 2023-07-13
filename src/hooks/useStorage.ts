import { useState } from 'react';

//设置一个值 同时存储在sessionStore里
const useStorage = (
  key: string,
  defaultValue: string,
): [string, (newValue: string) => void] => {
  const [value, setValue] = useState<string>(
    window.localStorage.getItem(key) || defaultValue,
  );
  const setNewValue = (newValue: string) => {
    if (newValue != value) {
      setValue(newValue);
      window.localStorage.setItem(key, newValue);
    }
  };
  return [value, setNewValue];
};

export default useStorage;
