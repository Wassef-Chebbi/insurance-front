import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { UsersComponent } from './users/users.component';

export default [

    { path: 'users', component: UsersComponent },
    { path: 'crud', component: Crud },


] as Routes;
