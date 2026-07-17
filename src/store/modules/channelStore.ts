import { createSlice } from "@reduxjs/toolkit";
import { getComments } from "@/utils/api";

const channelStore = createSlice({
  name: "channel",

  initialState: {
    channelList: [],
  },
  reducers: {
    setChannelList: (state, action) => {
      state.channelList = action.payload;
    },
  },
});

const { setChannelList } = channelStore.actions; // 解构获取
// 异步请求 action
const featchChannelList = (): any => {
  return async (dispatch: any) => {
    const data = await getComments();
    dispatch(setChannelList(data));
  };
};

export { featchChannelList }; // 导出异步action
export default channelStore.reducer;
