import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./modules/counterStore";
import channelReducer from "./modules/channelStore";

// 创建根store 组合多个子模块
const store = configureStore({
  reducer: {
    counter: counterReducer,
    channel: channelReducer,
  },
});

// 导出 RootState 类型，供 useSelector 使用
export type RootState = ReturnType<typeof store.getState>;

export default store;
