import { useRoutes, Navigate } from "react-router-dom";
import Main from "./Pages/Main";
import View360 from "./Pages/View360";
import FinalSubmitted from "./components/Modals/FinalSubmitted";
import Camera from "./Pages/Camera";

const Routes = () => {
  const element = useRoutes([
    { path: "/", element: <Main /> },
    { path: "view360", element: <View360 /> },
    { path: "/submitted", element: <FinalSubmitted /> },
    { path: "/camera", element: <Camera /> },
  ]);

  return element;
};

export default Routes;
