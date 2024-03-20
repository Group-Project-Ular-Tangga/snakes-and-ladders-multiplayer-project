import {
    createBrowserRouter, redirect,
  } from "react-router-dom";
import App from "../App.jsx";
import Game from "../Game.jsx";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
    },
    {
      path: "/game",
      element: <Game/>,
    },
    {
      path: "*",
      loader: () => {
        return redirect('/')
      },
    },
  ]);

export default router