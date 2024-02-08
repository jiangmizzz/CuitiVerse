# frontend-demo
调研用 demo 部分的源代码，仅前端。

## 编译与运行

### 安装依赖 
使用包管理器安装项目编译运行所需的依赖（yarn 和 npm 都可以）：
```powershell
$yarn install  #或者 npm install
```
  
### 添加 api_key 
为保证调用 openai API 密钥的保密性，需要在本地自行配置 api_key，配置方法如下：
1. 在根目录下新建文件夹 config，并在其中新建 request.ts 文件；
2. 在 request.ts 文件夹中以如下形式写入 API 配置：
  ```TypeScript
  const requestConfig = {
    apiKey: "your_api_key",
    organization: "your_organization_id",
    baseURL: "your_base_url",
    dangerouslyAllowBrowser: true,
  };
  export default requestConfig;
   ```
  
### 运行
在终端以开发环境运行源代码，可在 localhost 中访问对应的网页内容：
```powershell
$yarn run dev #或者 npm run dev
```