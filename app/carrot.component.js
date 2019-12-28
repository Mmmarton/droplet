import { registerComponent } from '..combined/components';

export class Carrot {
  template = `
  <span style="color: orange; border: 1px solid red">Carrot {{number}}</span>
  `;

  number = Math.floor(Math.random() * 100) / 100;
}

registerComponent(Carrot, 'carrot');
