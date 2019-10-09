const components = (function(global) {
  const droplet = global.droplet;
  if (!droplet) {
    throw new Error('Please import droplet core.');
  }

  droplet.components = [];
})(typeof window === 'undefined' ? global : window);

export class Component {
  constructor(template, parent) {
    this.template = template;
    this.children = [];
    this.parent = parent;
  }

  addComponent(component) {
    if (!component) {
      throw new Error('Trying to add invalid component.');
    }
    component.parent = this;
    this.children.push(component);
    droplet.components.push(component);
  }
}
