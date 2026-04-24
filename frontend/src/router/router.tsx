import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '../layouts/RootLayout';
// import { AppLayout } from '../layouts/AppLayout';

import { PublicOnlyRoute } from '../routes/PublicOnlyRoute';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import GoalDetailPage from '../pages/GoalDetailPage/GoalDetailPage';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import VerifyYourEmail from '../components/VerifyYourEmail/VerifyYourEmail';
import TaskForm from '../components/TaskForm/TaskForm';

// import { ProtectedRoute } from '../routes/ProtectedRoute/ProtectedRoute';

const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));

const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const DashboardPage = lazy(() => import('../Dashboard/DashboardPage'));
const TrashList = lazy(() => import('../components/TrashList/TrashList'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ErrorPage = lazy(() => import('../pages/ErrorPage/ErrorPage'));
const GoalsPage = lazy(() => import('../pages/GoalsPage/GoalsPage'));
// const GoalDetailPage = (() => import ('../pages/GoalDetailPage/GoalDetailPage'));
// const ResetPasswordPage = (() => import ('../pages/ResetPasswordPage/ResetPasswordPage'));
const TodosPage = lazy(() => import('../pages/TodosPage/TodosPage'));
const TasksPage = lazy(() => import('../pages/TasksPage/TasksPage'));
const MeasurementsPage = lazy(() => import('../pages/MeasurementsPage/MeasurementsPage'));
const MeasurementsForm = lazy(() => import('../components/MeasurementsForm/MeasurementsForm'));
const MeasurementsDetails = lazy(
  () => import('../components/MeasurementsDetails/MeasurementsDetails'),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/todos',
            element: <TodosPage />,
          },
          {
            path: '/tasks',
            element: <TasksPage />,
          },
          {
            path: '/task-form',
            element: <TaskForm />,
          },
          {
            path: '/goals',
            element: <GoalsPage />,
          },
          {
            path: '/goals/:id',
            element: <GoalDetailPage />,
          },
          {
            path: 'measurements',
            element: <MeasurementsPage />,
            children: [
              {
                path: 'measurements-details/:id',
                element: <MeasurementsDetails />,
              },
            ],
          },
          {
            path: 'measurement-form',
            element: <MeasurementsForm />,
          },
          {
            path: '/trash',
            element: <TrashList />,
          },
        ],
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/reset-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPasswordPage />,
      },
      {
        path: '/verify-your-email',
        element: <VerifyYourEmail />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
