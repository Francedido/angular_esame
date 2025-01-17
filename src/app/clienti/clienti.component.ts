import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client, ClientService } from '../client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
  styleUrl: './clienti.component.css'
})
export class ClientiComponent implements OnInit{
  displayedColumns: string[] = ['id', 'codiceFiscale', 'nome', 'cognome', 'dataNascita', 'azienda','edit','delete'];
  selectedClientId: number | null = null;
  customers: Client[] = [];

  isVisible: boolean = false;

  userForm: FormGroup;

  constructor(private clientService: ClientService, private fb: FormBuilder){
    this.userForm = this.fb.group({
      codiceFiscale: ['', Validators.required],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      dataNascita: ['', Validators.required],
      azienda: ['', Validators.required]
    });
  }

  getClient(): void {
    let id = sessionStorage.getItem('userId');
    this.clientService.getClientsById(parseInt(id as string)).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => {
        console.error('Error retrieving clients:', error);
      }
    });
  }

  ngOnInit(): void {
    this.getClient();
  }

  onSubmit(): void {
    let id = sessionStorage.getItem('userId');
    if(this.userForm.valid) {
      const cliente = {...this.userForm.value, userId: id};
      this.clientService.addClient(cliente).subscribe({
        next: (response) => {
          this.isVisible = false;
          this.getClient();
        },
        error: (error) => {
          console.error('Errore durante l\'aggiunta del cliente:', error);
        }
      });
    }
  }

  mostra(): void {
    this.isVisible = !this.isVisible;
  }
  onEdit(customer: Client): void{
    this.isVisible = true;
    this.userForm.patchValue({
      codiceFiscale: customer.codiceFiscale,
      nome: customer.nome,
      cognome: customer.cognome,
      dataNascita: customer.dataDiNascita,
      azienda: customer.azienda
    });

    this.selectedClientId = customer.id !== undefined ? customer.id : null;
  }
  onDelete() {}
} 
