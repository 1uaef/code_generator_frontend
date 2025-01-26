import {message, Upload, UploadProps} from 'antd';
import {useState} from "react";
// @ts-ignore
import {uploadFileUsingPost} from "@/services/backend/fileController";
import {COS_HOST} from "@/constants";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

/**
 * 图片上传组件
 */
interface Props {
  biz: string;
  onChange?: (url: string) => void;
  value?: string;
}

const PictureUploader: React.FC<Props> = (props) => {
  const { biz, onChange, value } = props;
  const [loading, setLoading] = useState(false);
  const uploadProps :UploadProps={
    name: 'file',
    listType: 'picture-card', // multiple: true,
    showUploadList: false,
    multiple: false,
    maxCount: 1, // 上传数量限制
    customRequest: async (fileObj:any) =>  {
      setLoading(true);
      try {
        const res = await uploadFileUsingPost({biz},{}, fileObj.file);
        const fullUrl =COS_HOST+ res.data;
        if (onChange) {
          onChange(fullUrl ?? '');
        }
        fileObj.onSuccess(res.data);
        message.success('上传成功');
      }catch (e:any){
        fileObj.onError(e);
        message.error('上传失败，' + e.message);
      }
      setLoading(false);
    }

  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return <Upload {...uploadProps}>
    {value ? <img src={value} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
  </Upload>;
};
export default PictureUploader;
