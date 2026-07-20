import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import Home from "@/pages/Home";
import Page404 from "@/pages/page404";

// 封装懒加载组件 - V6 路由
export const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType }>,
) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Outlet />}>
      <Component />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <Home />, // 静态加载
  },
  {
    path: "/list",
    lazy: async () => {
      // V7 路由版本的懒加载 - 推荐
      const module = await import("@/pages/List");
      return {
        Component: module.default,
      };
    },
    children: [
      {
        // index: true, // 默认打开子路由
        path: "c1",
        element: lazyLoad(() => import("@/pages/List/c1")), // V6 路由版本的懒加载
      },
    ],
  },
  {
    path: "*", // 写在末尾 -  路由都没匹配到的情况
    element: <Page404 />,
  },
]);

export default router;
