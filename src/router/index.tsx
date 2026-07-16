import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home";
import List from "@/pages/List";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/list",
    element: <List />,
  },
]);

export default router;
