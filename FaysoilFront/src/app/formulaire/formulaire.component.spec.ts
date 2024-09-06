import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormulaireComponent } from './formulaire.component';
import { EquipeService } from '../services/equipe.service';

// Créons un service fictif pour simuler le comportement de EquipeService
class MockEquipeService {
  ajouterEquipe(equipeData: any) {
    return of({ message: 'Équipe ajoutée avec succès' });
  }
}

class MockRouter {
  navigate(commands: any[]) {}
}

describe('FormulaireComponent', () => {
  let component: FormulaireComponent;
  let fixture: ComponentFixture<FormulaireComponent>;
  let mockEquipeService: MockEquipeService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: EquipeService, useClass: MockEquipeService },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireComponent);
    component = fixture.componentInstance;
    mockEquipeService = TestBed.inject(EquipeService) as unknown as MockEquipeService;
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with one joueur', () => {
    expect(component.joueurs.length).toBe(1);
  });

  it('should add a joueur', () => {
    component.ajouterJoueur();
    expect(component.joueurs.length).toBe(2);
  });

  it('should remove a joueur', () => {
    component.ajouterJoueur();
    component.supprimerJoueur(0);
    expect(component.joueurs.length).toBe(1);
  });

  it('should submit form successfully', () => {
    spyOn(window, 'alert');
    spyOn(mockEquipeService, 'ajouterEquipe').and.returnValue(of({ message: 'Équipe ajoutée avec succès' }));
    
    component.submitForm();
    
    expect(mockEquipeService.ajouterEquipe).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('L\'équipe a bien été ajoutée.');
  });

  it('should handle form submission error', () => {
    spyOn(window, 'alert');
    spyOn(mockEquipeService, 'ajouterEquipe').and.returnValue(throwError(() => new Error('Erreur lors de l\'ajout de l\'équipe')));
    
    component.submitForm();
    
    expect(mockEquipeService.ajouterEquipe).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'ajout de l\'équipe.');
  });

  it('should navigate to /choix', () => {
    spyOn(mockRouter, 'navigate');
    
    component.retournerAuChoix();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/choix']);
  });
});
