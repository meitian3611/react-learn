import { create } from "zustand";
import createTest1Slice, { type Test1Slice } from "./zustandModules/test_1";

// 合并所有模块的 State 类型（当有多个模块时，用 & 连接）
// 例如: Test1Slice & Test2Slice & Test3Slice
export type Store = Test1Slice;

// 创建 store —— 将 set/get/api 传递给每个模块的 createSlice
const useStore = create<Store>()((...args) => ({
  ...createTest1Slice(...args),
  // 后续添加新模块:
  // ...createTest2Slice(...args),
}));

export default useStore;
