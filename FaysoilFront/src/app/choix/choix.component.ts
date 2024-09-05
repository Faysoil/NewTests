import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choix',
  templateUrl: './choix.component.html',
  styleUrls: ['./choix.component.scss']
})
export class ChoixComponent {

  constructor(private router: Router){}

  allerAuFormulaire() {
    this.router.navigate(['/formulaire']);
  }

  allerAuSolo() {
    this.router.navigate(['/solo']);
  }

}
