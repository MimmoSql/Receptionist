import { Component, OnInit } from '@angular/core';
import { UtenteService } from '../../services/utente.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../../edit-user-dialog/edit-user-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recall-elenco-utenti',
  templateUrl: './recall-elenco-utenti.component.html',
  styleUrls: ['./recall-elenco-utenti.component.css']
})
export class RecallElencoUtentiComponent implements OnInit {
  utenti: any[] = [];
  searchTerm: string = '';

  constructor(
    private utenteService: UtenteService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadUtenti();
    setInterval(() => {
      this.loadUtenti();
    }, 10000); // 10000 millisecondi = 10 secondi
  }
  
  loadUtenti(): void {
    this.utenteService.getUtenti().subscribe(
      (data: any[]) => {
        this.utenti = data;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUtente(utente: any): void {
    this.utenteService.deleteUtente(utente.interno).subscribe(
      (response) => {
        if (response && response.message) {
          this.toastr.success(response.message, 'Successo',{
            positionClass: 'toast-top-right' // Specifica la posizione per questo toast
          });
          this.loadUtenti();
        }
      },
      (error) => {
        this.toastr.error(error.error.message, 'Errore');
        console.error('Error deleting user:', error);
        this.loadUtenti();
      }
    );
  }

  editUtente(utente: any): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '250px',
      data: { ...utente },
      position: {
        top: '-50%', // Esempio: posizione a 50px dal top
        left: '35%' // Esempio: posizione a 50px dal left
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.utenteService.updateUtente(result, utente.interno).subscribe(
          (response: any) => {
            this.toastr.success(response.message, 'Successo');
            this.loadUtenti();
          },
          error => {
            this.toastr.error(error.error.message, 'Errore');
            this.loadUtenti();
          }
        );
      }
    });
  }
}
