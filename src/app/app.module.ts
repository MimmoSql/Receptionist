import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';


//SERVICE
import { UtenteService } from './services/utente.service';
//PIPE
import { FilterUsersPipe } from './pipe/FilterUsersPipe';

import { SidebarComponent } from './sidebar/sidebar.component';
import { ChiamateComponent } from './chiamate/chiamate.component';
import { StatisticaComponent } from '././statistica/statistica.component';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { RecallInserimentoUtenteComponent } from './recall/recall-inserimento-utente/recall-inserimento-utente.component';
import { RecallElencoUtentiComponent } from './recall/recall-elenco-utenti/recall-elenco-utenti.component';
import { RubricaComponent } from './rubrica/rubrica.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { RecallStatisticaComponent } from './recall-statistica/recall-statistica.component';
import { DialogOpenChartComponent } from './dialog-open-chart/dialog-open-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    RecallElencoUtentiComponent,
    RecallInserimentoUtenteComponent,
    FooterComponent,
    FilterUsersPipe,
    SidebarComponent,
    RubricaComponent,
    ChiamateComponent,
    StatisticaComponent,
    EditUserDialogComponent,
    RecallStatisticaComponent,
    DialogOpenChartComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({ echarts }),
    BrowserModule,
    AppRoutingModule,

    MatButtonModule,
    MatSliderModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatRadioModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatExpansionModule,
    DragDropModule,
    BrowserAnimationsModule, // Importante per le animazioni dei toast
    ToastrModule.forRoot({
      timeOut: 3000, // Durata della notifica
      positionClass: 'toast-bottom-left', // Posizione della notifica
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      enableHtml: true,
      easing: 'ease-in-out', // Imposta l'easing per l'animazione
      newestOnTop: true,
    })
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    UtenteService,
    ToastrService,
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
