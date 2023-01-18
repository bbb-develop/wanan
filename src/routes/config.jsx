import React from 'react';
import { Home } from '../pages/Home';
import { RoomHistory } from '../pages/RoomHistory';
import { ProfessionInfo } from '../pages/ProfessionInfo';

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
  {
    id: 'profession-info',
    name: 'ProfessionInfo',
    path: '/profession/:userId',
    component: <ProfessionInfo />,
  },
];

export default routes;