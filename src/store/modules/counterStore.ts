import { createSlice } from "@reduxjs/toolkit";

const counterStore = createSlice({
  name: "counter", // 命名空间

  // 初始状态数据
  initialState: {
    count: 0,
  },
  // 修改状态数据的reducer - 同步方法
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    addToNum: (state, action) => {
      state.count += action.payload; // 接收传参
    },
  },
});

export const { increment, decrement, addToNum } = counterStore.actions; // 解构 导出创建 action 对象的函数 - { actionCreater }

export default counterStore.reducer; // 导出reducer函数
