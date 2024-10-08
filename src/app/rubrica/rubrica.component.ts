import { Component, OnInit } from '@angular/core';
import { UtenteService } from '../services/utente.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import 'notyf/notyf.min.css'; // Importa lo stile CSS

@Component({

  selector: 'app-rubrica',
  templateUrl: './rubrica.component.html',
  styleUrl: './rubrica.component.css'
})
export class RubricaComponent implements OnInit {

  nome: string = '';
  cognome: string = '';
  sinonimi: string[] = [];
  sinonimo: string = '';
  interno: string = '';

  constructor(private utenteService: UtenteService,  public dialog: MatDialog,
    private toastr: ToastrService,) {}

  ngOnInit(): void {
  }


  aggiungiSinonimo(): void {
    if (this.sinonimo.trim() !== '') {
      this.sinonimi.push(this.sinonimo.trim());
      this.sinonimo = ''; // Resetta l'input dopo l'aggiunta del sinonimo
    }
  }

  rimuoviSinonimo(index: number): void {
    this.sinonimi.splice(index, 1);
  }

  addUtente(): void {
    const nuovoUtente = {
      nome: this.nome,
      cognome: this.cognome,
      sinonimo: this.sinonimi.join(','), // Unisce i sinonimi in una stringa separata da virgole
      interno: this.interno
    };

    this.utenteService.addUtente(nuovoUtente).subscribe(
      response => {
        this.toastr.success(response.message, 'Successo');
      },
      error => {
        this.toastr.error(error.error.message, 'Errore');
      }
    );
  }

  onSubmit() {
    this.addUtente();
  }

  
  utenti: any[] = [];
  searchTerm: string = '';

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
