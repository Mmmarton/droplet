import { registerComponent } from '..combined/components';

export class Carrot {
  componentName = 'carrot';
  field = 'Something';
  array = ['pam'];

  update() {
    this.field += 'd';
  }
}

registerComponent(Carrot, 'carrot');
