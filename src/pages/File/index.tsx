import type { UploadProps } from 'antd';
import { Button, Card, Divider, Flex, Image, message, Upload } from 'antd';
import React, { useState } from 'react';

// @ts-ignore
import {testDownloadFileUsingGet, testUploadFileUsingPost,} from '@/services/backend/fileController';
import { InboxOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const { Dragger } = Upload;

const FilePage: React.FC = () => {
  const [value, setValue] = useState<string>();
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    customRequest: async (fileObj: any) => {
      try {
        const res = await testUploadFileUsingPost({}, fileObj.file);
        fileObj.onSuccess(res.data); // 注意这里是 onSuccess 而不是 OnSuccess
        setValue(res.data);
        message.success('上传成功');
      } catch (e: any) {
        message.error('上传失败，' + e.message);
        fileObj.onError(e); // 注意这里是 onError 而不是 OnError
      }
    },
    onRemove() {
      setValue(undefined);
    },
  };
  return (
    <div>
      <h1>文件上传下载</h1>
      <Flex gap={16}>
        <Card title="文件上传">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
            <p className="ant-upload-hint">
              支持单次或批量上传。严禁上传公司数据或其他 被禁止的文件。
            </p>
          </Dragger>
        </Card>

        <Card title="文件下载" loading={value === undefined} >
          <div>文件下载地址：{value}</div>
          <Divider />
          <Image src={value} width={200} height={180}/>
          <Divider />
          <Button type="primary"
          onClick={async () => {
            const blob = await testDownloadFileUsingGet({filepath: value},{
              responseType: 'blob',
            },);
            const fullUrl = value;
            // @ts-ignore
            saveAs(blob, fullUrl);
          }}
          >下载</Button>
        </Card>
      </Flex>
    </div>
  );
};

export default FilePage;
