# React App

基于 React 19 + TypeScript + Vite 构建的前端项目。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **路由**: React Router v8（`createBrowserRouter` + 嵌套路由 + 懒加载）
- **状态管理**: Redux Toolkit
- **HTTP 请求**: Axios（封装统一实例，设置 baseURL `/api`） + ahooks `useRequest`
- **UI 组件库**: Ant Design 5
- **Mock 数据**: json-server（`db.json`）
- **日期处理**: dayjs
- **包管理**: pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务

```bash
pnpm dev
```

开发服务器默认运行在 `http://localhost:5173`。

### 启动 Mock 数据服务

项目使用 `json-server` 提供 Mock 数据，`db.json` 中包含了示例数据。

```bash
pnpm json-server
```

Mock 服务默认运行在 `http://localhost:3003`，提供以下接口：

| 接口            | 说明         |
|-----------------|--------------|
| `GET /getList`  | 获取评论列表 |

### 同时启动开发服务和 Mock 服务

建议开两个终端分别运行：

```bash
# 终端 1：启动前端
pnpm dev

# 终端 2：启动 Mock 数据
pnpm json-server
```

> **注意**：Vite 已配置代理，前端请求 `/api/*` 会自动转发到 `http://localhost:3003/*`，开发时无需关心跨域问题。

## 可用脚本

| 命令               | 说明                       |
|--------------------|----------------------------|
| `pnpm dev`         | 启动 Vite 开发服务器       |
| `pnpm build`       | 构建生产版本               |
| `pnpm preview`     | 预览生产构建               |
| `pnpm lint`        | ESLint 代码检查            |
| `pnpm json-server` | 启动 json-server Mock 服务  |

## 项目结构

```
src/
├── assets/                 # 静态资源
├── components/             # 公共组件
│   └── Comment-Item.tsx    # 评论项组件
├── pages/                  # 页面组件
│   ├── Home/               # 首页（评论列表、评论发布）
│   ├── List/               # 列表页 + 嵌套子路由 c1
│   ├── Study/              # 学习笔记页
│   └── page404.tsx         # 404 页面
├── router/                 # 路由配置（懒加载、嵌套路由）
├── store/                  # Redux 状态管理
│   ├── modules/            # 子模块（counter、channel）
│   └── index.ts            # 根 store 配置
├── utils/                  # 工具模块
│   ├── api.ts              # API 接口封装（getComments）
│   └── request.ts          # Axios 实例（baseURL /api、响应拦截）
├── App.tsx                 # 根组件（RouterProvider）
├── App.scss
├── index.css               # 全局样式
└── main.tsx                # 入口文件（Provider + ConfigProvider）
```

## 关键实现

| 模块/文件                    | 说明                                                |
|------------------------------|-----------------------------------------------------|
| `utils/request.ts`           | 创建 axios 实例，统一 `baseURL: "/api"`、响应拦截解包 |
| `utils/api.ts`               | 封装业务接口（`getComments`），支持传参              |
| `router/index.tsx`           | `createBrowserRouter` + 嵌套路由 + 两种懒加载方式     |
| `pages/Home/`                | `useRequest` 自动请求 + `useCommentPush` 自定义 Hook  |
| `store/`                     | Redux Toolkit（counter 计数 + channel 频道列表）     |
| `main.tsx`                   | `Provider` 注入 Redux + `ConfigProvider` 配置 antd 中文 |
