import { registerComponent } from '..combined/components';

export class Carrot {
  template = `
  <span style="color: orange; border: 1px solid red">Carrot</span>
  `;
}

registerComponent(Carrot, 'carrot');
