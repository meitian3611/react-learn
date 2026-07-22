import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { increment, decrement, addToNum } from "@/store/modules/counterStore";
import { featchChannelList } from "@/store/modules/channelStore";
import { useEffect, useState, memo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useStore from "@/store/zustand";

// memo的使用练习 - 子组件 props没有变化 不重新渲染
const MemoComponent = memo(({ value }: { value: any }) => {
  console.log("子组件被重新渲染了");
  return <div>memo + {value}</div>;
});

// redux的使用练习
export default function List() {
  const { count } = useSelector((state: RootState) => state.counter);
  const { channelList } = useSelector((state: RootState) => state.channel);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [curDate, setCurDate] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  const [countValue, setCountValue] = useState(1);

  // const { countIndex, inc } = useStore(); // zustand的使用
  const countIndex = useStore((state) => state.countIndex); // zustand的使用 单独订阅 性能最好 推荐
  const inc = useStore((state) => state.inc);

  useEffect(() => {
    dispatch(featchChannelList()); // 异步请求
  }, [dispatch]);

  // 设置url参数
  const params = new URLSearchParams({
    id: "100",
    name: "Tom",
  });

  const changeDate = () => {
    const addDate = dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss");
    setCurDate(addDate);
  };

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

      <div>
        <p>---路由跳转---</p>
        <button onClick={() => navigate("/home")}>跳转到首页 </button>
        ---
        <button
          onClick={() =>
            navigate(
              {
                pathname: "/home",
                search: `?text=aaa&${params.toString()}`, // 设置url参数
              },
              { replace: true }, // 替换当前url, 不添加到历史记录, 建议登录时使用, 默认false
            )
          }
        >
          跳转到首页 - 指定参数
        </button>
        ---
        <button onClick={() => navigate("/list/c1")}>跳转到子路由</button>
      </div>

      <div>
        <p>---嵌套的子路由---</p>
        子路由: <Outlet />
      </div>

      <div>
        <button onClick={changeDate}>改变日期</button>
      </div>
      <div>{curDate}</div>

      <div>
        <p>---memo---</p>
        <button onClick={() => setCountValue(countValue + 1)}>
          点击更新子组件props
        </button>
        <MemoComponent value={countValue} />
      </div>

      <div>
        <p>---zustand---</p>
        {countIndex} - <button onClick={inc}>使用zustand 事件</button>
      </div>
    </div>
  );
}
