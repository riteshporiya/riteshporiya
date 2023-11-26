import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  backgroundImagePath: string = 'src/assets/images/bg_1.png'; // Set the actual path of your image
  greeting:string = '👋 Hello!';
  name:string = 'Ritesh Poriya';
  role:string = 'MEAN Stack Developer 💻';
  location:string = 'Surat';

  constructor() {}
}
