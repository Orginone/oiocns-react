import { FileItemModel } from '@/ts/base/model';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import FullScreenModal from '@/executor/tools/fullScreen';
import cla from './index.module.less';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
interface IProps {
  share: FileItemModel;
  finished: () => void;
}

const MarkdownView: React.FC<IProps> = ({ share, finished }) => {
  const [mdContent, setMdCOntent] = useState('');
  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
    console.log(share.shareLink);
    fetch(share.shareLink)
      .then((res) => res.text())
      .then((text) => setMdCOntent(text));
    return (
      <FullScreenModal
        centered
        open={true}
        fullScreen
        width={'80vw'}
        destroyOnClose
        title={share.name}
        bodyHeight={'80vh'}
        onCancel={() => finished()}>
        {
          // eslint-disable-next-line
      }<ReactMarkdown remarkPlugins ={[ gfm ]} className={cla['markdown-view']} children={mdContent}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              style={vs} // theme
                              language={match[1]}
                              PreTag='section' // parent tag
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
      ></ReactMarkdown>
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};

export default MarkdownView;
