import { Route } from '@angular/router';
import { HomePage } from './home/home-page';
import { UpdatesPage } from './updates/updates-page/updates-page';

export const appRoutes: Route[] = [
  { path: '', component: HomePage },
  { path: 'updates', component: UpdatesPage },
];
