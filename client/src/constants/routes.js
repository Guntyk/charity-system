import { Organizations } from 'pages/Organizations';
import { Transactions } from 'pages/Transactions';
import { Volunteers } from 'pages/Volunteers';
import { Dashboard } from 'pages/Dashboard';
import { Projects } from 'pages/Projects';
import { Users } from 'pages/Users';
import {
  faBuildingUser,
  faChartSimple,
  faHandshakeSimple,
  faSackDollar,
  faSitemap,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

export const routes = [
  { id: 1, title: 'Dashboard', link: '/dashboard', icon: faChartSimple, component: Dashboard },
  { id: 2, title: 'Organizations', link: '/organizations', icon: faBuildingUser, component: Organizations },
  { id: 3, title: 'Projects', link: '/projects', icon: faSitemap, component: Projects },
  { id: 4, title: 'Transactions', link: '/transactions', icon: faSackDollar, component: Transactions },
  { id: 5, title: 'Volunteers', link: '/volunteers', icon: faHandshakeSimple, component: Volunteers },
  { id: 6, title: 'Users', link: '/users', icon: faUserGroup, component: Users },
];
