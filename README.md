## webpack4 + vue + less + eslint
## 开发环境命令优化
  ``` javascript
    npm run dev // 启动所有页面的开发构建
    npm run dev demo1,demo2 // 可启动不同页面的构建
  ```
  - 开发环境下会自动将node_module下的依赖打为一个vendor
  - 生产环境下将 vue / vue-router打为一个vendor
  - HMR + hotReload
### githook
  - git commit & git push时会启用eslint语法校验 error时无法提交和push
### eslint校验说明
  - 项目下会有.vscode文件夹,里面配置了工作区的eslint配置 vscode安装eslint插件即可生效
  - eslint规则页面: http://eslint.cn/docs/rules/

### 接下来的优化点
- happypack  ? 
- typescript ?
- 单元测试

## 项目结构
- assets
- config  放置环境/插件配置等数据
- directive ? 公用指令集
- components 公用组件库
- filters ? 公用过滤器
- growio ? 主要存放growio相关的代码 如主动埋点事件的整理
- mixins 存放vue的mix混合项
- plugins 业务功能插件
- request 请求接口的封装和拦截
- utils 工具库

##### *directive/components/filters/mixins的内容在添加时需注明 用途 + 用法 必要时可建md说明*