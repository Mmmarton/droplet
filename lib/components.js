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
      data: instance.template
    };
  } else {
    return null;
  }
}
