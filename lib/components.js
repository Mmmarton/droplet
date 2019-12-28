export const componentsList = {};

const handler = {
  set: (obj, prop, value) => {
    console.log({ prev: obj[prop], curr: value });
    obj[prop] = value;
    return true;
  }
};

export function registerComponent(component, tag) {
  componentsList[tag] = component;
}

export function createComponent(componentName) {
  const component = componentsList[componentName.toLowerCase()];
  if (component) {
    const instance = new Proxy(new component(), handler);
    return {
      component: instance,
      data: parseTemplate(instance)
    };
  } else {
    return null;
  }
}

function parseTemplate(component) {
  let template = component.template;
  template.match(/{{[a-zA-Z0-9]*}}/g).forEach(variable => {
    const name = variable.substring(2, variable.length - 2);
    template = template.replace(new RegExp(variable, 'g'), component[name]);
  });

  return template;
}
