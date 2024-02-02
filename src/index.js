import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ListPage from './components/ListPage';
import PostDetailPage from './components/PostDetailPage';
import CreatePostPage from './components/CreatePostPage';
import AddAccount from "./components/AddAccount";

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/list",
    element: <ListPage />,
  },
  {
    path: "/post/:Id",
    element: <PostDetailPage />,
  },
  {
    path: "/add",
    element: <AddAccount />,
  },
  // {
  //   path: "/post/update",
  //   element: <CreatePostPage />,
  // },
  // {
  //   path: "/post/update/:id",
  //   element: <CreatePostPage />
  // },
]);

root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);
