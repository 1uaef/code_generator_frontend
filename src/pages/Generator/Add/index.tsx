import type {ProFormInstance} from '@ant-design/pro-components';
import {
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import {message, UploadFile} from 'antd';
import {useEffect, useRef, useState} from 'react';
import PictureUploader from "@/components/PictureUploader";
import FileUploader from '@/components/FileUploader';
import {
  addGeneratorUsingPost,
  editGeneratorUsingPost,
  getGeneratorVoByIdUsingGet
} from "@/services/backend/generatorController";
import {useSearchParams} from "@@/exports";
import {COS_HOST} from "@/constants";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const GeneratorAddPage: React.FC = () => {
  // 跟新内容主要回显老数据
  const [oldData, setOldData] = useState<API.GeneratorEditRequest>();
  // 获取id
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const formRef = useRef<ProFormInstance>();
  /**
   * 获取老数据
   */
  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!id) {
      return;
    }
    try {
      // @ts-ignore
      const res = await getGeneratorVoByIdUsingGet({id,});
      console.log(res.data)
      // 处理文件路径

      // 处理文件路径
      if (res.data) {
        const { distPath } = res.data ?? {};
        console.log("distPath:"+distPath)
        if (distPath) {
          // @ts-ignore
          res.data.distPath = [
            {
              uid: id,
              name: '文件' + id,
              status: 'done',
              url: COS_HOST + distPath,
              response: distPath,
            } as UploadFile,
          ];
        }
        setOldData(res.data);
        // formRef.current?.setFieldsValue(res.data);
      }
    } catch (error: any) {
      message.error('加载数据失败，' + error.message);
    }
  };
  // 更新数据
  const doUpdate = async (values: API.GeneratorEditRequest) => {
    try {
      const res = await editGeneratorUsingPost(values);
      if (res.data) {
        message.success("更新成功");
        // todo 跳转到详情页
      }

    } catch (e: any) {
      message.error("更新失败" + e.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);
  const doAdd = async (values: API.GeneratorAddRequest) => {
    try {
      const res = await addGeneratorUsingPost(values);
      if (res.data) {
        message.success("添加成功");
        // todo 跳转到详情页
      }

    } catch (e: any) {
      message.error("添加失败" + e.message);
    }
  }
    const doSubmit = async (values: API.GeneratorAddRequest) => {
      // 数据转换
      if (!values.fileConfig) {
        values.fileConfig = {};
      }
      if (!values.modelConfig) {
        values.modelConfig = {};
      }
      // 文件列表转 url
      if (values.distPath && values.distPath.length > 0) {
        // @ts-ignore
        values.distPath = values.distPath[0].response;
      }

      if (id) {
        // @ts-ignore
        // @ts-ignore
        await doUpdate({id, ...values,});
      } else {
        await doAdd(values);
      }

// 上传

}

return (
  <ProCard>
    {(!id || oldData) && (
      <StepsForm<API.GeneratorAddRequest | API.GeneratorEditRequest>
        formRef={formRef}
        formProps={{
          initialValues: oldData,
        }}
        onFinish={doSubmit}
      >
        <StepsForm.StepForm
          name="base"
          title="基本信息"
          stepProps={{
            description: '这里填入的都是基本信息',
          }}
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            await waitTime(2000);
            return true;
          }}
        >
          <ProFormText
            name="name"
            label="名称"
            width="md"
            tooltip="最长为 24 位，用于标定的唯一 id"
            placeholder="请输入名称"
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="description"
            label="描述"
            width="md"
            placeholder="请输入描述"
            rules={[{required: true}]}
          />
          <ProFormText
            name="basePackage"
            label="基础包"
            placeholder="请输入基础包"
            rules={[{required: true}]}
          />
          <ProFormText
            name="version"
            label="版本"
            placeholder="请输入版本"
            rules={[{required: true}]}
          />
          <ProFormText
            name="author"
            label="作者"
            placeholder="请输入作者"
            rules={[{required: true}]}
          />
          <ProFormSelect
            label="标签"
            mode="tags"
            name="tags"
            placeholder="请输入标签列表"
            rules={[{required: true}]}
          />
          <ProFormText name="picture" label="图片" placeholder="请输入图片">
            <PictureUploader biz='generator_picture'/>
          </ProFormText>
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="fileConfig"
          title="文件配置"
          stepProps={{
            description: '这里填入文件配置参数',
          }}
        >
          {/*todo 带开发*/}
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="modelConfig"
          title="模型配置"
          stepProps={{
            description: '这里填入模型配置参数',
          }}
        >
          {/*todo 带开发*/}
        </StepsForm.StepForm>

        <StepsForm.StepForm
          name="dist"
          title="生成器文件"
          stepProps={{
            description: '这里填入生成器文件参数',
          }}
        >
          <ProFormText label="产物包" name="distPath">
            <FileUploader biz='generator_dist' description={'请上传生成器文件压缩包'}/>
          </ProFormText>

        </StepsForm.StepForm>
      </StepsForm>)}
  </ProCard>
);
}
;
export default GeneratorAddPage;
