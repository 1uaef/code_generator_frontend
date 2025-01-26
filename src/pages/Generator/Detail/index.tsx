/**
 * 详情页
 * @constructor
 */
import {useParams, useSearchParams} from "@@/exports";
import {useState} from "react";

const GeneratorDetailPage: React.FC = () => {

  // url 获取--获取的是路径参数
  const{ id } = useParams();
  const [oldData, setOldData]  = useState<API.GeneratorVO>();

}


export default GeneratorDetailPage;
