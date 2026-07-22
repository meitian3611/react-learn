import type { StateCreator } from "zustand";

// 模块1的类型定义
export interface Test1Slice {
  countIndex: number;
  inc: () => void;
}

// StateCreator<当前模块State> —— 最简写法，后三个参数有默认值无需显式指定
// 如需跨模块访问，可传第二个泛型: StateCreator<Test1Slice, [], [], Store>
const createTest1Slice: StateCreator<Test1Slice> = (set) => ({
  countIndex: 0,
  inc: () => set((state) => ({ countIndex: state.countIndex + 1 })),
});

export default createTest1Slice;
