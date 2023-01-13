import React from 'react';
import { Home } from '../pages/Home';
import { RoomHistory } from '../pages/RoomHistory';

const routes = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    component: <Home />,
  },
  {
    id: 'room-history',
    name: 'RoomHistory',
    path: '/room/histories/:roomId',
    component: <RoomHistory />,
  },
];

export default routes;