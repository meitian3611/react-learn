import "./index.css";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { getComments } from "@/utils/api";
import CommentItem from "@/components/Comment-Item";

const user_info = {
  id: 2,
  username: "mmt",
  avatar: "https://picsum.photos/60",
};

const tabList = [
  {
    value: "new",
    label: "最新",
  },
  {
    value: "hot",
    label: "最热",
  },
];

// 封装排序函数 最新-最热
function sortComments(comments: any[], type: string) {
  // [...comments] 拷贝数组 - 避免sort修改原数组
  return [...comments].sort((a, b) =>
    type === "new"
      ? dayjs(b.time).valueOf() - dayjs(a.time).valueOf()
      : b.like - a.like,
  );
}

// 封装自定义hook 请求接口数据
function useCommentList() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getComments().then((res: any) => {
      setComments(res);
    });
  }, []);
  return {
    comments,
    setComments,
  };
}

// 封装自定义hook 发布评论
function useCommentPush(
  comments: any[],
  setComments: (value: any) => void,
  inputRef: any,
) {
  const [inputValue, setInputValue] = useState("");

  const handlePush = () => {
    if (!inputValue) return;
    const newComment = {
      id: comments.length + 1,
      username: user_info.username,
      text: inputValue,
      time: dayjs(new Date()).format("YYYY-MM-DD"),
      like: 0,
      avatar: user_info.avatar,
    };
    setComments((prev: any[]) => [newComment, ...prev]);
    setInputValue("");
    inputRef.current.focus();
  };

  return { inputValue, setInputValue, handlePush };
}

export default function Home() {
  const { comments, setComments } = useCommentList(); // 使用自定义hook
  const [tabName, setTabName] = useState("new");
  const inputRef = useRef(null);
  const { inputValue, setInputValue, handlePush } = useCommentPush(
    comments,
    setComments,
    inputRef,
  );

  // 不要把可以计算出来的数据放进 state 中   要使用 useMemo 计算|排序
  const displayComments = useMemo(() => {
    return sortComments(comments, tabName);
  }, [comments, tabName]); // 依赖comments和tabName

  // 删除评论 - 函数式删除 用于获取最新状态
  const handleDel = (id: number) => {
    setComments((prev) => prev.filter((item) => item.id !== id));
  };
  // 切换tab
  const handleTabChange = (value: string) => {
    setTabName(value);
    setComments(() => sortComments(comments, value)); // 切换后重新排序
  };

  return (
    <div className="comment-body">
      {/* 标题 */}
      <div className="btn-group">
        <div className="title">
          <h2>评论</h2>
          <span>{comments.length}条评论</span>
        </div>

        <div className="tabs">
          {tabList.map((item) => {
            return (
              <span
                key={item.value}
                className={tabName === item.value ? "active" : ""}
                onClick={() => handleTabChange(item.value)}
              >
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* 输入框 */}
      <div className="comment-input">
        <img className="avatar" src="https://picsum.photos/60" alt="" />

        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="发一条友善的评论~"
          ref={inputRef}
        />

        <button onClick={handlePush}>发布</button>
      </div>

      {/* 评论列表 */}
      <div className="comment-list">
        {displayComments.map((item) => {
          return (
            <CommentItem
              key={item.id}
              item={item}
              user_info={user_info}
              onDel={handleDel}
            ></CommentItem>
          );
        })}
      </div>
    </div>
  );
}
