import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import './index.less';
import { debounce } from '@/utils/tools';
// import { IBelong } from '@/ts/core';
// import OrgCtrl from '@/ts/controller';
// import { XAttribute } from '@/ts/base/schema';
//  $formData:获取表单数据；$company:获取当前单位信息；$user:获取用户信息，$BM:编码生成器
const defaultCode = `({$user}) => {
  //输出用户名称
  return $user.name;
}`;
// const User = OrgCtrl.user;
const CodeEdit = ({
  // attributes,
  // belongId,
  onCodeChange,
  defaultVal,
}: {
  // attributes: XAttribute[];
  // belongId: string;
  onCodeChange: (d: string) => void;
  defaultVal: any;
}) => {
  const [code, setCode] = useState<string>(defaultCode);

  //TODO:升级为使用 vm，提高安全性

  const handleEval = () => {
    try {
      // const evalResult = eval(code);
      // console.log(
      //   '运行规则',
      //   evalResult({
      //     $formData: undefined,
      //     $attrs: attributes,
      //     $company: Company,
      //     $user: User,
      //   }),
      // );
    } catch (err) {
      console.log('handleEval错误', err);
    }
  };
  const handleCodeChange = debounce((code: string) => {
    handleEval();
    setCode(code);
    onCodeChange(code);
  });

  return (
    <LiveProvider code={defaultVal?.value || code} noInline={false}>
      <LiveEditor onChange={(code: string) => handleCodeChange(code)} />
      {/* <LiveError /> */}
      {/* <LivePreview /> */}
    </LiveProvider>
  );
};

export default React.memo(CodeEdit);
