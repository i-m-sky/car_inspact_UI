import { useRoutes, Navigate } from "react-router-dom";
import Main from "./Pages/Main";
import View360 from "./Pages/View360";
import FinalSubmitted from "./components/Modals/FinalSubmitted";
import Capture from "./Pages/Capture";
import CaptureSingle from "./Pages/CaptureSingle";

const Routes = () => {
  const element = useRoutes([
    { path: "/", element: <Main /> },
    { path: "view360", element: <View360 /> },
    { path: "/capture", element: <Capture /> },
    { path: "/capture-single", element: <CaptureSingle /> },
    { path: "/submitted", element: <FinalSubmitted /> },
  ]);

  return element;
};

export default Routes;
