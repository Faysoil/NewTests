import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EquipeService } from '../services/equipe.service'; // Import du service

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent {

  constructor(private router: Router, private equipeService: EquipeService) {} // Injection du service
  
  nomCapitaine: string = '';
  prenomCapitaine: string = '';
  nomEquipe: string = '';
  joueurs: { nom: string, prenom: string, pseudo: string, dob: string }[] = [{ nom: '', prenom: '', pseudo: '', dob: '' }];
  tournoiChoisi?: string;
  
  ajouterJoueur() {
    this.joueurs.push({ nom: '', prenom: '', pseudo: '', dob:'' });
  }

  supprimerJoueur(index: number) {
    this.joueurs.splice(index, 1);
  }

  // Méthode pour soumettre le formulaire
  submitForm() {
    const equipeData = {
      nomCapitaine: this.nomCapitaine,
      prenomCapitaine: this.prenomCapitaine,
      nomEquipe: this.nomEquipe,
      joueurs: this.joueurs,
      tournoiChoisi: this.tournoiChoisi
    };

    this.equipeService.ajouterEquipe(equipeData).subscribe({
      next: (response: any) => {
        console.log('Équipe ajoutée avec succès:', response);
        this.resetForm();
        alert('L\'équipe a bien été ajoutée.');
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'ajout de l\'équipe:', error);
        alert('Erreur lors de l\'ajout de l\'équipe.');
      }
    });
  }

  // Méthode pour reset le formulaire
  resetForm() {
    this.nomCapitaine = '';
    this.prenomCapitaine = '';
    this.nomEquipe = '';
    this.joueurs = [{ nom: '', prenom: '', pseudo: '', dob: '' }];
    this.tournoiChoisi = undefined;
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  retournerAuChoix() {
    this.router.navigate(['/choix']);
  }
}
