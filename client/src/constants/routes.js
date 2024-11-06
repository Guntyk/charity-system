import { Dashboard } from 'pages/Dashboard';
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
  { id: 2, title: 'Organizations', link: '/organizations', icon: faBuildingUser },
  { id: 3, title: 'Projects', link: '/projects', icon: faSitemap },
  { id: 4, title: 'Volunteers', link: '/volunteers', icon: faHandshakeSimple },
  { id: 5, title: 'Donations', link: '/donations', icon: faSackDollar },
  { id: 6, title: 'Users', link: '/users', icon: faUserGroup },
];
