const componentsList = {};

export function registerComponent(component, tag) {
  componentsList[tag] = component;

  const a = new componentsList['carrot']();
  a.update();
  console.log(a.field);
}
