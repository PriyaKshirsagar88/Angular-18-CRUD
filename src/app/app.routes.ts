import { Routes } from '@angular/router';
import { LocalStorageComponent } from './local-storage/local-storage.component';
import { ApiCRUDComponent } from './api-crud/api-crud.component';
import { SessionStorageComponent } from './session-storage/session-storage.component';

export const routes: Routes = [
    {path: 'local', component: LocalStorageComponent},
    {path: 'api', component: ApiCRUDComponent},
    {path: 'session', component: SessionStorageComponent},
    { path: '**', redirectTo: 'local' }
];
