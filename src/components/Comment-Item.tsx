// 封装评论组件
function CommentItem({ item, user_info, onDel }) {
  return (
    <div className="comment-item">
      <img className="avatar" src={item.avatar} alt="" />

      <div className="content">
        <div className="username">{item.username}</div>

        <div className="text">{item.text}</div>

        <div className="footer">
          <span>{item.time}</span>
          <span>点赞数：{item.like}</span>
          {user_info.username === item.username && (
            <span className="delete" onClick={() => onDel(item.id)}>
              删除
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
