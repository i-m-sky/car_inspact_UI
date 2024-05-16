import { useRoutes, Navigate } from "react-router-dom";
import Main from "./Pages/Main";
import View360 from "./Pages/View360";

const Routes = () => {
  const element = useRoutes([
    { path: "/", element: <Main /> },
    { path: "view360", element: <View360 /> },
  ]);

  return element;
};

export default Routes;
