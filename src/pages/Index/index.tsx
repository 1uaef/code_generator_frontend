import { listGeneratorVoByPageUsingPost } from '@/services/backend/generatorController';
import { UserOutlined } from '@ant-design/icons';
import { PageContainer, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-components';
import { Avatar, Card, Flex, Image, Input, List, message, Tabs, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const { Search } = Input;
// 定义收索参数
const DEFAULT_SEARCH_PARAMS: PageRequest = {
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
};

const IndexPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  // 总条数
  const [total, setTotal] = useState<number>(0);
  //收索参数 ---APi请求参数
  const [searchParams, setSearchParams] = useState<API.GeneratorQueryRequest>({
    ...DEFAULT_SEARCH_PARAMS,
  });
  // 数据
  const [dataList, setDataList] = useState<API.GeneratorVO[]>([]);

  // 获取数据
  const doSeacrch = async () => {
    setLoading(true);
    try {
      const res = await listGeneratorVoByPageUsingPost(searchParams);
      setDataList(res.data?.records ?? []);
      setTotal(res.data?.total ?? 0);
      console.log(res);
    } catch (error) {
      message.error('查询失败，请重试');
    }
    setLoading(false);
  };

  // 获取标签列表
  const getTags = (tags?: string[]) => {
    if (!tags) {
      return <></>;
    }
    return (
      <div style={{ marginBottom: '10px' }}>
        {tags.map((item) => (
          <Tag color={'blue'} key={item}>
            {item}
          </Tag>
        ))}
      </div>
    );
  };

  // 监听事件--当改变的时候，触发监听
  useEffect(() => {
    doSeacrch();
  }, [searchParams]);

  return (
    <PageContainer>
      <Flex justify={'center'}>
        <Search
          style={{ width: '50%', marginBottom: 6 }}
          placeholder="请收索"
          allowClear
          enterButton="收索"
          size="large"
          onSearch={(value: string) => {
            setSearchParams({
              ...searchParams,
              searchText: value,
            });
          }}
        />
      </Flex>

      <Tabs
        defaultActiveKey={'news'}
        size={'large'}
        items={[
          {
            key: 'news',
            label: '最新',
          },
          {
            key: 'recommend',
            label: '推荐',
          },
        ]}
        onChange={() => {}}
      />
      <QueryFilter
        span={12}
        labelWidth="auto"
        labelAlign={'left'}
        defaultChecked={false}
        style={{ padding: ' 20px 0 ' }}
        onFinish={async (valus: API.GeneratorQueryRequest) => {
          setSearchParams({
            ...valus
          })
        }}
        onChange={() => {}}
      >
        <ProFormSelect name="tags" label="标签" mode="tags"  width={230}/>

        <ProFormText name="name" label="名称" />
        <ProFormText name="description" label="描述" />
      </QueryFilter>
      <List<API.GeneratorVO>
        rowKey="id"
        loading={loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={dataList}
        pagination={{
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total,
          onChange(current: number, pageSize: number) {
            setSearchParams({
              ...searchParams,
              current,
              pageSize,
            });
          },
        }}
        renderItem={(data) => (
          <List.Item>
            <Card hoverable cover={<Image alt={data.name} src={data.picture} />}>
              <Card.Meta
                title={<a>{data.name}</a>}
                description={
                  <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                    {data.description}
                  </Typography.Paragraph>
                }
              />
              {getTags(data.tags)}
              <Flex justify="space-between" align="center">
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {moment(data.createTime).fromNow()}
                </Typography.Text>
                <div>
                  <Avatar src={data.user?.userAvatar ?? <UserOutlined />} />
                </div>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default IndexPage;
