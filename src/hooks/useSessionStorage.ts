import { useEffect, useState } from 'react';

//设置一个值 同时存储在sessionStore里
const useSessionStorage = (
  key: string,
  defaultValue: string,
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    window.sessionStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue];
};

export default useSessionStorage;
