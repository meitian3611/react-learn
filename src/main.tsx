import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

import store from "./store";
import "./index.css";
import App from "./App.tsx";

dayjs.locale("zh-cn"); //  设置中文

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* antd 配置默认中文*/}
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
);
