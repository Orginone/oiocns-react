import { FileItemShare } from '@/ts/base/model';
import useWindowSize from '@/utils/windowsize';
import { Button, Image, Modal } from 'antd';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import FileViewer from 'react-file-viewer';
import './index.less';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
interface IProps {
  files: FileItemShare[];
  previewDone: () => void;
}

/** 文件预览 */
const FilePreview = ({ files, previewDone }: IProps) => {
  if (files.length === 0) return <></>;
  const [view, setView] = useState(false);
  const size = useWindowSize();
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      setView(true);
    }, 100);
  }, []);

  const getBody = useMemo(() => {
    console.log('files', files, current);

    if (!files) {
      return <></>;
    }
    const _file = files[current];
    if (_file?.thumbnail && _file.thumbnail.length > 0) {
      return <Image src={_file.shareLink} title={_file.name} preview={false} />;
    }
    // 自定义文件类型处理
    switch (_file?.extension) {
      case '.mat':
        break;
    }
    return (
      <FileViewer
        key={view}
        fileType={_file?.extension?.substring(1)}
        filePath={_file?.shareLink}
        errorComponent={(val: any) => {
          console.log('err=', val);
        }}
      />
    );
  }, [current]);
  const handleCurrentChange = (type: 'left' | 'right') => {
    const num = type === 'left' ? current - 1 : current + 1;
    setCurrent(num);
  };

  return (
    <Modal
      centered
      open={true}
      destroyOnClose
      title={files[current]?.name}
      width={size.width * 0.8}
      className="filesModal"
      onCancel={() => previewDone()}
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}>
      <div style={{ width: '100%', height: size.height * 0.5 }}>
        <Button
          className="btnL"
          type="primary"
          shape="circle"
          icon={<LeftCircleOutlined />}
          disabled={current === 0}
          onClick={() => handleCurrentChange('left')}></Button>
        <Button
          className="btnR"
          type="primary"
          shape="circle"
          icon={<RightCircleOutlined />}
          disabled={current === files.length - 1}
          onClick={() => handleCurrentChange('right')}></Button>
        {getBody}
      </div>
    </Modal>
  );
};

export default FilePreview;
