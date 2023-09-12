import { useState } from 'react';

//设置一个值 同时存储在sessionStore里
function useStorage<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
  const getValue = (key: string, defaultValue: T) => {
    const userStore = window.localStorage.getItem('userStore');
    if (userStore && userStore.length > 0) {
      const data = JSON.parse(userStore);
      if (data && data[key]) {
        return data[key];
      }
    }
    return defaultValue;
  };
  const setNewValue = (newValue: T) => {
    setValue(newValue);
    const userStore = window.localStorage.getItem('userStore') || '{}';
    const data = JSON.parse(userStore);
    data[key] = newValue;
    window.localStorage.setItem('userStore', JSON.stringify(data));
  };
  const [value, setValue] = useState<T>(getValue(key, defaultValue));
  return [value, setNewValue];
}

export default useStorage;
