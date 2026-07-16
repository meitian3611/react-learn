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
}, [count,name]);
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
      </TextContext.Provider>
```
子组件使用context
```js
const contextValue = useContext(TextContext);
```

##  5. 自定义Hook
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