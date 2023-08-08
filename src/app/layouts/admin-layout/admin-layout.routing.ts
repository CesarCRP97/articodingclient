import { Routes } from '@angular/router';

import { UsersComponent } from 'app/components/users/users.component';
import { LevelsComponent } from 'app/components/levels/levels.component';
import { LevelDetailComponent } from 'app/components/levels/level-detail/level-detail.component';
import { ClassesComponent } from 'app/components/classes/classes.component';
import { UserDetailComponent } from 'app/components/users/user-detail/user-detail.component';
import { ClaseDetailComponent } from 'app/components/classes/clase-detail/clase-detail.component';
import { CreateUserComponent } from 'app/components/users/create-user/create-user.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'levels',      component: LevelsComponent },
    { path: 'levels/:id',  component: LevelDetailComponent },

    { path: 'users',       component: UsersComponent },
    { path: 'users/new',   component: CreateUserComponent },
    { path: 'users/:id',   component: UserDetailComponent },
    
    { path: 'classes',     component: ClassesComponent },
    { path: 'classes/:id',     component: ClaseDetailComponent }
];
