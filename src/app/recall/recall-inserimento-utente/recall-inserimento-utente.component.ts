import { Component, OnInit } from '@angular/core';
import { UtenteService } from '../../services/utente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recall-inserimento-utente',
  templateUrl: './recall-inserimento-utente.component.html',
  styleUrls: ['./recall-inserimento-utente.component.css']
})
export class RecallInserimentoUtenteComponent implements OnInit {
  nome: string = '';
  cognome: string = '';
  sinonimi: string[] = [];
  sinonimo: string = '';
  interno: string = '';

  constructor(private utenteService: UtenteService, private toastr: ToastrService) {}

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
}
