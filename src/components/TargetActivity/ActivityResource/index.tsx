import React from 'react';
import { Image } from 'antd';
import { FileItemShare } from '@/ts/base/model';
import { shareOpenLink } from '@/utils/tools';
import { command } from '@/ts/base';
import { AiOutlineFileUnknown } from '@/icons/ai';
const ActivityResource = (
  fileList: FileItemShare[],
  maxWidth: number,
  columns: number = 3,
) => {
  if (fileList.length < 1) return <></>;
  const renderResource = (item: FileItemShare) => {
    if (item.contentType?.startsWith('image')) {
      return (
        <div key={item.shareLink}>
          <Image
            width={'190px'}
            height={'190px'}
            src={shareOpenLink(item.shareLink)}
            preview={{
              src: shareOpenLink(item.shareLink),
            }}></Image>
        </div>
      );
    }
    if (item.contentType?.startsWith('video')) {
      return (
        <div key={item.shareLink} title={`点击播放${item.name}`}>
          <Image
            width={'190px'}
            height={'190px'}
            onClick={() => {
              command.emitter('executor', 'open', item);
            }}
            preview={false}
            src={item.poster ? shareOpenLink(item.poster) : item.thumbnail}
          />
        </div>
      );
    }
    if (item.contentType?.includes('pdf') || item.contentType?.startsWith('text')) {
      return (
        <iframe
          width={maxWidth}
          height={maxWidth}
          loading="eager"
          name={item.name}
          src={shareOpenLink(item.shareLink)}
        />
      );
    }
    return <AiOutlineFileUnknown size={190} />;
  };
  return fileList.map((item) => renderResource(item));
};

export default ActivityResource;
