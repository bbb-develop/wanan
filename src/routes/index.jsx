import React from 'react';
import {
  Routes, Route, Navigate,
} from 'react-router-dom';
import routeConfigs from './config';

const Router = () => (
  <Routes>
    {
      routeConfigs.map((route) => (
        <Route key={route.id} path={route.path} element={route.component} />
      ))
    }
    <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
  </Routes>
);

export { routeConfigs };
export default Router;
