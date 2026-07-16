import { useState } from "react";

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
