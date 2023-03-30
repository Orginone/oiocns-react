import { useState } from 'react';

//设置一个值 同时存储在sessionStore里
const useSessionStorage = (
  key: string,
  defaultValue: string,
): [string, (newValue: string) => void] => {
  const [value, setValue] = useState<string>(
    window.sessionStorage.getItem(key) || defaultValue,
  );
  const setNewValue = (newValue: string) => {
    if (newValue != value) {
      setValue(newValue);
      window.sessionStorage.setItem(key, newValue);
    }
  };
  return [value, setNewValue];
};

export default useSessionStorage;
