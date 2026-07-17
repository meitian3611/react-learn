import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { increment, decrement, addToNum } from "@/store/modules/counterStore";
import { featchChannelList } from "@/store/modules/channelStore";
import { useEffect } from "react";

// redux的使用练习
export default function List() {
  const { count } = useSelector((state: RootState) => state.counter);
  const { channelList } = useSelector((state: RootState) => state.channel);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(featchChannelList()); // 异步请求
  }, [dispatch]);

  return (
    <div>
      <div>
        <button onClick={() => dispatch(increment())}>增加+</button>
        -----
        <button onClick={() => dispatch(addToNum(100))}>增加指定数量</button>
        <p>{count}</p>
        <button onClick={() => dispatch(decrement())}>减少-</button>
      </div>

      <div>
        <p>---获取异步数据---</p>
        <div>
          {channelList.map((item) => {
            return (
              <div key={item.id}>
                {item.username} - {item.time}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
