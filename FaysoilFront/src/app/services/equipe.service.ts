import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  private apiUrl = 'http://localhost:3000/api/equipes'; // L'URL correcte de ton backend

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter une équipe
  ajouterEquipe(data: any): Observable<any> {
    // Optionnel: Spécifier les headers, ici JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Envoyer une requête POST avec les données de l'équipe
    return this.http.post<any>(this.apiUrl, data, httpOptions);
  }
}
