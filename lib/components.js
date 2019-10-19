const componentsList = {};

const handler = {
  set: (obj, prop, value) => {
    console.log({ prev: obj[prop], curr: value });
    obj[prop] = value;
    return true;
  }
};

export function registerComponent(component, tag) {
  componentsList[tag] = component;

  const a = new Proxy(new componentsList['carrot'](), handler);
  a.update();
  a.update();
  a.field = 'bumm';
  a.array.push('mik');
}
