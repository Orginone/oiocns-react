import React, { useState } from 'react';
import { TextArea } from 'devextreme-react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { ITextBoxOptions } from 'devextreme-react/text-box';
import { IDomEditor } from '@wangeditor/editor';
interface TreeSelectItemProps extends ITextBoxOptions {
  onFieldChange?: (name: string, value: string) => void;
}

const HtmlEditItem: React.FC<TreeSelectItemProps> = (props) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例

  return (
    <TextArea {...props} minHeight={350} width={'100%'}>
      <div style={{ padding: 30, display: 'block', height: '100%', width: '100%' }}>
        {props.readOnly !== true && (
          <Toolbar
            editor={editor}
            mode="simple"
            defaultConfig={{
              excludeKeys: [
                'insertVideo',
                'uploadVideo',
                'uploadImage',
                'fullScreen',
                'insertImage',
                'insertImage',
                'deleteImage',
                'editImage',
                'viewImageLink',
                'imageWidth30',
                'imageWidth50',
                'imageWidth100',
              ],
            }}
          />
        )}
        <Editor
          mode="simple"
          defaultHtml={props.value}
          onCreated={setEditor}
          defaultConfig={{ placeholder: '在此输入内容', readOnly: props.readOnly }}
          style={{ height: 220 }}
        />
      </div>
    </TextArea>
  );
};

export default HtmlEditItem;
