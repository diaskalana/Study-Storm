import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import Loading from "./components/loading.jsx";

import PrivateRoute from "./components/privateRoute.jsx";
import AdminRoute from "./components/adminRoute.jsx";

import App from "./App.jsx";
import HomePage from "./pages/home.jsx";
import NotFoundPage from "./pages/404.jsx";

import "./index.css";
import CourseHomePage from "./pages/coursemanagement/index.jsx";
import CoursePage from "./pages/coursemanagement/course.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import AdminRegisterPage from "./pages/admin/register.jsx";
import ForgotPasswordPage from "./pages/forgotPassword.jsx";
import CourseContentPage from "./pages/coursemanagement/courseContent.jsx";

import UserProfilePage from "./pages/user/userProfile.jsx";
import CourseDetailsPage from "./components/home/CourseDetailsPage.jsx";
import CardPage from "./components/home/card.jsx";
import MyCoursesPage from "./components/home/MyCoursesPage.jsx";
import InstructorRoute from "./components/instructorRoute.jsx";
import AdminCourseHomePage from "./pages/coursemanagement/pendingCourses.jsx";

import AllUsersPage from "./pages/admin/users.jsx";

import CourseContent from "./components/home/CourseContent.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/course-details/:id" element ={<CourseDetailsPage />} /> 
      <Route path="/paymentPage" element={<CardPage />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/learner" element={<UserProfilePage />} />
        <Route path="/admin" element={<UserProfilePage />} />
        <Route path="/instructor" element={<UserProfilePage />} />

        <Route path="/learner/courses" element={<MyCoursesPage />} />
        <Route path="/learner/course/:id" element={<CourseContent />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin/courses" element={<AdminCourseHomePage />} />
          <Route path="/admin/courses/:id" element={<CourseContentPage />} />

          <Route path="/admin/users/create" element={<AdminRegisterPage />} />
          <Route path="/admin/users/all" element={<AllUsersPage />} />
        </Route>

        {/* Instructor Routes */}
        <Route path="/instructor" element={<InstructorRoute />}>
          <Route path="/instructor/courses" element={<CourseHomePage />} />
          <Route path="/instructor/courses/create" element={<CoursePage />} />
          <Route path="/instructor/courses/update/:id" element={<CoursePage />} />
          <Route path="/instructor/courses/:id" element={<CourseContentPage />} />
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    {/* </React.StrictMode> */}
  </Provider>
);
