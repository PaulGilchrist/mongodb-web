import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // Static Loading
    { path: '', redirectTo: '/user', pathMatch: 'full' },
    // Lazy Loading
    { path: 'user', loadChildren: () => import('./user-module/user.module').then(m => m.UserModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
