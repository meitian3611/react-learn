import { RouterProvider } from "react-router-dom";

import router from "@/router";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
