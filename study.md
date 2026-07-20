## 1. React 不直接修改 State

- 在 React 中，不要直接修改 state，相比 Vue，React 更强调 **数据不可变性（Immutable）**。
- 当需要更新视图时，通过 `setState` 更新 state，React 会根据新的 state 重新渲染组件，并更新视图。
- Vue 使用 Proxy 实现响应式。更偏向于数据驱动+ 响应式系统。React 更偏向于声明式的数据驱动。

> React 更新流程：
>
> 1. 通过 `setState` 更新 state
> 2. React 重新渲染组件
> 3. 生成新的 Virtual DOM
> 4. 对比新旧 DOM，更新视图

## 2. useMemo

- `useMemo` 是一个 React Hook，用于缓存计算结果。和Vue的`computed`类似。
- `useMemo` 的第一个参数是一个函数，第二个参数是一个依赖数组。
- 当依赖数组中的依赖项发生变化时，`useMemo` 会重新计算函数。

```js
const displayComments = useMemo(() => {
  return sortComments(comments, tabName);
}, [comments, tabName]); // 依赖comments和tabName 发生变化时重新触发事件
```

> 本质上，`useMemo` 是一个缓存函数，用于缓存计算结果。`useMemo`需要手动传入依赖数组，而 `computed` 是自动的, 因为底层是 Proxy 响应式的.

## 3. useEffect

- `useEffect` 是一个 React Hook，用于处理副作用。
- 可以把它理解为 Vue的 watch + mounted + beforeUnmount 的结合体。

**最简单的**

```js
useEffect(() => {
  console.log("执行了");
});
```

这种用法，会在组件每次渲染时都去执行。

**空依赖**

```js
useEffect(() => {
  console.log("只执行一次");
}, []);
```

这种用法，会在组件首次渲染时执行一次。类似 Vue的 mounted。

**有依赖**

```js
useEffect(() => {
  console.log("依赖变化时执行");
}, [count, name]);
```

这种用法，会在依赖变化时执行。类似 Vue的 watch。

**清理函数**

```js
useEffect(() => {
  const timer = setInterval(() => {
    console.log("hello");
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

这种用法，会在组件卸载时执行清理函数。类似 Vue的 beforeUnmount。

## 4. 组件通信

- React 组件通信分为两种：props 和 context。
- props 是组件之间的通信，context 是跨多个层级组件的通信。

**props**

- 父传子组件，子组件通过 props 接收父组件的数据。
- props 是单向的，只读的, 子组件不能修改父组件props的数据。
- 特殊的props：`children` 类似于 Vue的 slot 插槽。props.children

**子传父**
子组件 onClick 事件，父组件通过指定一个接收函数。子组件通过父组件指定的这个函数来传递数据。

子组件传递:

```js
function SonTest({ handleTest }) {
  const test1 = () => {
    let a = 1;
    let b = 2;
    handleTest(a, b);
  };
  return (
    <div>
      我是子组件:
      <p>
        <button onClick={test1}>测试</button>
      </p>
    </div>
  );
}
```

父组件接收：

```js
<SonTest handleTest={handleTest} />
```

**context**

- context是可以跨组件通信的。顶层组件通过 `createContext` 创建一个context 变量，任意一层的子组件可以通过`useContext(context 变量)`使用这个context
- 注意 context 变量是同一个, 组件在不同的文件 需要引用同一个context 变量。

顶层组件创建context

```js
const TextContext = createContext(null);
<TextContext.Provider value={contextValue}>
  <SonTest />
</TextContext.Provider>;
```

子组件使用context

```js
const contextValue = useContext(TextContext);
```

## 5. 自定义Hook

- 自定义Hook 就是声明一个use开头的函数，用于封装一些通用的逻辑。
- 把组件用到的状态或者回调函数封装到一个Hook中，其他组件可以直接使用这个Hook。
- 哪个组件需要用到这个Hook，就直接引入这个Hook。解构Hook中的变量即可。

```js
//  自定义hook
function useToggle() {
  const [value, setValue] = useState(true);
  const toggle = () => setValue(!value);
  return { value, toggle };
}

export default function List() {
  const { value, toggle } = useToggle(); // 使用自定义hook
  return (
    <div>
      <button onClick={toggle}>toggle</button>
      <div>{value && <p>我是文本信息</p>}</div>
    </div>
  );
}
```

## 6.路由

- React 路由使用 `react-router-dom` 库。
- 采用 React Router v6.4+ 推荐的 `createBrowserRouter` + `RouterProvider` 模式。

### 路由配置（`src/router/index.tsx`）

```ts
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import List from "@/pages/List";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,  // 默认重定向
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/list",
    element: <List />,
  },
]);

export default router;
```

### 挂载路由

```tsx
// App.tsx
import { RouterProvider } from "react-router-dom";
import router from "@/router";

function App() {
  return <RouterProvider router={router} />;
}
```

### 常用 Hook

```tsx
// 跳转（useNavigate）
const navigate = useNavigate();
navigate("/list", { replace: true });

// 获取 URL 参数（useSearchParams）
const [searchParams, setSearchParams] = useSearchParams();

// 获取当前 URL 信息（useLocation）
const { search, pathname } = useLocation();
```

### 嵌套路由

- 使用 `children` 定义嵌套路由，父路由组件中通过 `<Outlet />` 渲染子路由。

```tsx
// 路由配置
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // 父布局组件
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "list", element: <List /> },
    ],
  },
]);
```

```tsx
// Layout.tsx — 父布局，通过 Outlet 渲染子页面
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav>
        <Link to="/home">首页</Link>
        <Link to="/list">列表</Link>
      </nav>
      <main>
        <Outlet /> {/* 子路由组件在此处渲染 */}
      </main>
    </div>
  );
}
```

### 懒加载（lazy + Suspense）

- 使用 `React.lazy` + `Suspense` 实现组件按需加载（Code Splitting），减少首屏包体积。
- 封装工具函数 `lazyLoad`，统一管理 Suspense 的 loading 回退。

```tsx
// router/index.tsx
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";

// 封装懒加载工具函数
export const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType }>,
): ReactNode => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Outlet />}>
      <Component />
    </Suspense>
  );
};

// 路由中使用
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "list", element: lazyLoad(() => import("@/pages/List")) },
    ],
  },
]);
```

**适用场景**：页面级组件、不常用的弹窗或大组件。
**注意**：

- `React.lazy` 只支持默认导出（`export default`）的组件。
- 配合路由的 `children` 使用，可以让不同页面独立分包，访问时才加载对应 JS 资源。
- `Suspense` 的 `fallback` 可以是任意 React 节点（加载动画、骨架屏等）。

### 关键区别（BrowserRouter vs createBrowserRouter）

- `createBrowserRouter` 是 v6.4 新增的 Data Router API，支持路由级 `loader`、`errorElement` 等高级特性。
- 旧方式 `BrowserRouter` + `Routes` + `Route` 仍可用，但新项目推荐 `createBrowserRouter`。
