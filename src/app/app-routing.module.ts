import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubricaComponent } from './rubrica/rubrica.component';
import { ChiamateComponent } from './chiamate/chiamate.component';
import { StatisticaComponent } from './statistica/statistica.component';

const routes: Routes = [
  { path: 'rubrica', component: RubricaComponent },
  { path: 'chiamate', component: ChiamateComponent },
  { path: 'statistica', component: StatisticaComponent },
  { path: '', redirectTo: '/rubrica', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
