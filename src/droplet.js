'use strict';
import { html2json } from './template-parser';

let isDirty = false;
let mainContainer = document.querySelectorAll('body')[0];
let mainComponent;
let componentsList = {};

const isEvent = key => key.startsWith('on');
function componentToNode(component) {
  const { elementName, props, children } = component;
  let node;

  if (
    props &&
    props.hasOwnProperty('*if') &&
    (!props['*if'] || (typeof props['*if'] === 'function' && !props['*if']()))
  ) {
    return null;
  }

  if (!elementName) {
    if (component.model) {
      let nodes = [];
      for (let i = 0; i < component.children.length; i++) {
        let child = component.children[i];
        child.proxy.inputs = {
          ...child.proxy.inputs,
          ...component.props['*for'][i]
        };
        let childNode = componentToNode(child);
        nodes.push(childNode);
      }
      node = nodes;
    } else if (component.template) {
      node = componentToNode(component.proxy.render());
    } else {
      node = document.createTextNode(component);
    }
  } else {
    node = document.createElement(elementName);
    if (props) {
      Object.keys(props).forEach(key => {
        if (isEvent(key)) {
          const eventType = key.toLowerCase().substring(2);
          node.addEventListener(eventType, props[key]);
        } else {
          node[key] = props[key];
        }
      });
    }

    if (children) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let childNodes = componentToNode(child);
        if (childNodes) {
          if (childNodes.push) {
            for (let childNode of childNodes) {
              node.appendChild(childNode);
            }
          } else {
            node.appendChild(childNodes);
          }
        }
      }
    }
  }

  return node;
}

function reRender() {
  if (isDirty) {
    render(mainContainer, mainComponent);
    isDirty = false;
  }
  setTimeout(reRender, 30);
}
// move to requestIdleCallback approach
setTimeout(reRender, 30);

function render(container, component) {
  let mainNode = componentToNode(component.render());
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(mainNode);
}

function setEntryComponent(component) {
  mainComponent = component;
  isDirty = true;
}

function insertDynamicLinkings(component, template) {
  if (typeof template === 'string') {
    return replaceStringWithProperty(template, component);
  }
  let newTemplate = { ...template, props: {}, children: [] };
  for (let prop in template.props) {
    let actualProp = prop;
    if (prop === 'class') {
      actualProp = 'className';
    }
    if (template.props[prop][0] === '{') {
      let propertyName = template.props[prop].substring(
        1,
        template.props[prop].length - 1
      );
      newTemplate.props[actualProp] = component.get(propertyName);
      if (newTemplate.proxy) {
        newTemplate.proxy.inputs = newTemplate.props;
      }
    } else {
      newTemplate.props[actualProp] = template.props[prop];
    }
  }
  if (template.children) {
    newTemplate.children = [];
    for (let child of template.children) {
      newTemplate.children.push(insertDynamicLinkings(component, child));
    }
  }

  if (newTemplate.model) {
    let actualAmount = newTemplate.children.length;
    let inputsArray = newTemplate.props['*for'];
    let neededAmount = inputsArray.length;
    for (let i = 0; i < neededAmount - actualAmount; i++) {
      let subTemplate = generateTemplateWithChildObjects({
        ...newTemplate.model,
        inputs: { ...newTemplate.props }
      });
      template.children.push(subTemplate);
      newTemplate.children = template.children;
    }
    for (let i = 0; i < neededAmount; i++) {
      newTemplate.children[i].inputs = {
        ...newTemplate.children[i].inputs,
        ...inputsArray[i]
      };
    }
    if (neededAmount < actualAmount) {
      template.children = template.children.slice(0, neededAmount);
      newTemplate.children = newTemplate.children.slice(0, neededAmount);
    }
  }

  return newTemplate;
}

function replaceStringWithProperty(string, component) {
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{') {
      let propertyName = string.substring(i + 1, string.indexOf('}', i));
      string = string.replace(`{${propertyName}}`, component.get(propertyName));
    }
  }
  return string;
}

function generateTemplateWithChildObjects(template) {
  let generatedTemplate;
  if (typeof template === 'string') {
    generatedTemplate = template;
  } else if (componentsList[template.elementName]) {
    let element = new componentsList[template.elementName]();
    element.inputs = { ...template.inputs };
    element.props = { ...template.props };
    generatedTemplate = element;
  } else {
    let newTemplate = { ...template, children: [] };
    if (template.children) {
      newTemplate.children = [];
      for (let child of template.children) {
        newTemplate.children.push(insertChildObjects(child));
      }
    }
    generatedTemplate = newTemplate;
  }
  return generatedTemplate;
}

function insertChildObjects(template) {
  for (let prop in template.props) {
    if (prop === '*for') {
      return {
        props: template.props,
        model: template,
        children: []
      };
    }
  }

  return generateTemplateWithChildObjects(template);
}

class Component {
  inputs = {};
  template = '';

  constructor() {
    this.proxy = new Proxy(this, {
      set(target, name, value) {
        target[name] = value;
        isDirty = true;
        return true;
      }
    });

    let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (let method of methods) {
      if (typeof this[method] === 'function' && method !== 'constructor') {
        this[method] = this[method].bind(this.proxy);
      }
    }

    return this.proxy;
  }

  setTemplate(template) {
    this.template = html2json(template);
    this.template = insertChildObjects(this.template);
  }

  render() {
    return insertDynamicLinkings(this, this.template);
  }

  get(propertyPath = '') {
    let value = this;
    let properties = propertyPath.split('.');
    for (let property of properties) {
      value = value[property];
    }
    return value;
  }
}

function loadComponents(...components) {
  for (let component of components) {
    componentsList[component.name] = component;
  }
}

export { Component, setEntryComponent, loadComponents };
