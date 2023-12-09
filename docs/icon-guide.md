# 奥集能icon规范


## react-icons

icon统一使用[react-icons](https://react-icons.github.io/react-icons/icons)中的icon。react-icon已包含了Ant Design Icons、Bootstrap Icons、IcoMoon Free等主流。
**注意不要直接从ant design icons 中引入icon**

## icon引入文件
同一个库的icon，引入代码写在同一个文件中。如当前无引用icon对应的库名的文件，则需新建引用icon库的文件，文件命名为该库icon前两个字母

例如
```
引入的icon 为 GrAction
对应的文件名为 gr
```

## 引入方式
引入 @react-icons/all-files/库名/icon名

例如
正确的引入方式
```ts
import { AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose';
```
错误的引入方式
```ts
import { AiOutlineClose } from 'react-icons/ai';
```



