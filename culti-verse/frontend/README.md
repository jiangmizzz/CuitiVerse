# frontend

## 编译与运行

### 替换后端与图片服务器的 ip
替换 `./src/utils/request.ts` 中的 `origin` 和 `back` 分别为自己的图片服务器（图片请自行下载，图片服务需配置跨域）和后端地址（当前配置下默认为`localhost:8080`），以保证系统功能正常运行。

### 添加 api_key
为保证调用 openai API 密钥的保密性，需要在本地自行配置 api_key，配置方法如下：
1. 在 `frontend` 目录下新建文件夹 config，并在其中新建 `api_key.ts` 文件；
2. 在 `api_key.ts` 文件夹中以如下形式写入 API 配置：

```TypeScript
const apiConfig = {
  apiKey: "your_api_key",
  organization: "your_organization_id",
  baseURL: "your_base_url",
  dangerouslyAllowBrowser: true,
};

export default apiConfig;
```

### 安装依赖 
使用包管理器安装项目编译运行所需的依赖（yarn 和 npm 都可以）：
```powershell
$yarn install  #或者 npm install
```

### 运行
在终端以开发环境运行源代码，可在 localhost 中访问对应的网页内容：
```powershell
$yarn run dev #或者 npm run dev
