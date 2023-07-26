import { Routes } from '@angular/router';

import { UsersComponent } from 'app/components/users/users.component';
import { LevelsComponent } from 'app/components/levels/levels.component';
import { ClassesComponent } from 'app/components/classes/classes.component';
import { UserDetailComponent } from 'app/components/users/user-detail/user-detail.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'levels',      component: LevelsComponent },

    { path: 'users',       component: UsersComponent },
    { path: 'users/:id',   component: UserDetailComponent },
    
    { path: 'classes',     component: ClassesComponent }
];
