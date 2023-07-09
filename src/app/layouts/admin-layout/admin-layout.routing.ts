import { Routes } from '@angular/router';

import { UsersComponent } from 'app/components/users/users.component';
import { LevelsComponent } from 'app/components/levels/levels.component';
import { ClassesComponent } from 'app/components/classes/classes.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'levels',      component: LevelsComponent },
    { path: 'users',       component: UsersComponent },
    { path: 'classes',     component: ClassesComponent }
];
