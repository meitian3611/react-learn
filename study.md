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

## 2. 缓存相关 Hooks

三个 API 都用于避免不必要的重复计算/渲染，核心思路是**依赖不变则返回上一次缓存结果**。

### 2.1 useMemo —— 缓存计算结果

类似 Vue 的 `computed`，区别在于 React 需要**手动声明依赖**（Vue 基于 Proxy 自动追踪）。

```ts
const sortedList = useMemo(() => {
  return sortComments(comments, tabName);
}, [comments, tabName]); // 仅当依赖变化时重新计算
```

### 2.2 React.memo —— 缓存组件

高阶组件，props 不变时跳过子组件渲染。**只做浅比较**，对象/数组/函数 props 每次渲染引用都会变，需配合 `useMemo` / `useCallback`。

```tsx
const MemoChild = memo(({ value }: { value: number }) => {
  return <div>{value}</div>;
});
```

使用前提：子组件渲染开销大 且 props 不常变。简单组件滥用反而增加比较开销。

### 2.3 useCallback —— 缓存函数引用

`useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)` —— 依赖不变时返回同一个函数引用。主要配合 `React.memo` 使用，避免函数 props 引用变化导致 memo 失效；也用于 `useEffect` 的依赖项防止死循环。

```tsx
// 不用 useCallback：每次渲染 handleClick 都是新函数 → memo 失效
const handleClick = useCallback(() => setCount((c) => c + 1), []);
// ✅ 空依赖：函数永远不变；用 state => state 避免 stale closure

<MemoChild onClick={handleClick} />;
```

|          | useMemo        | React.memo     | useCallback          |
| -------- | -------------- | -------------- | -------------------- |
| 缓存目标 | 计算结果（值） | 整个组件       | 函数引用             |
| 类型     | Hook           | HOC            | Hook                 |
| 典型场景 | 昂贵计算       | 子组件跳过渲染 | 传给 memo 组件的回调 |

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

## 7. Zustand 状态管理

- 轻量级状态管理，无需 Provider / Reducer / Action Creator。通过 `create` 创建 Hook，组件直接使用。
- `create<Store>()(fn)` 需要两次调用：第一次传类型，第二次传初始化函数（保证 TS 类型推断）。

### 基础用法

```ts
// 定义 store
import { create } from "zustand";

type Store = { count: number; inc: () => void };

const useStore = create<Store>()((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
// set 两种写法
set({ count: 100 }); // 直接覆盖
set((state) => ({ count: state.count + 1 })); // 基于旧 state 计算
```

```tsx
// 组件中使用
const { count, inc } = useStore(); // 订阅整个 store
const count = useStore((state) => state.count); // selector：只订阅 count，避免不必要渲染
```

### 组件外读写

```ts
useStore.getState();      // 获取快照（不订阅）
useStore.setState({...}); // 更新状态
const unsub = useStore.subscribe((state) => {...}); // 订阅变化，返回取消函数
```

### 分模块（Slice 模式）

用 `StateCreator` 按功能拆分模块，在 `create` 中组合。`StateCreator<模块State>` 为最简写法。

**模块文件**（`zustandModules/test_1.ts`）：

```ts
import type { StateCreator } from "zustand";

export interface Test1Slice {
  countIndex: number;
  inc: () => void;
}

const createTest1Slice: StateCreator<Test1Slice> = (set) => ({
  countIndex: 0,
  inc: () => set((state) => ({ countIndex: state.countIndex + 1 })),
});

export default createTest1Slice;
```

**组合入口**（`zustand.ts`）：

```ts
import { create } from "zustand";
import createTest1Slice, { type Test1Slice } from "./zustandModules/test_1";

export type Store = Test1Slice; // 多模块: Test1Slice & Test2Slice & ...

const useStore = create<Store>()((...args) => ({
  ...createTest1Slice(...args), // (...args) 即 (set, get, api)，展开共享给各模块
}));

export default useStore;
```

**跨模块访问**：需要 `get()` 读取其他模块时，声明第四个泛型为完整 `Store`：

```ts
const createTest2Slice: StateCreator<Test2Slice, [], [], Store> = (
  set,
  get,
) => ({
  doubleCount: () => get().countIndex * 2, // 跨模块读取 Test1Slice
});
```

**添加新模块**：新建模块文件 → import 并展开到 `create` → `Store` 类型 `&` 连接。
