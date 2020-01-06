const isEvent = key => key.startsWith('on');

function createComponent(structure) {
  const { type, props, children } = structure;
  let element;

  if (!type) {
    element = document.createTextNode(structure);
  } else {
    element = document.createElement(type);
  }

  if (props) {
    Object.keys(props).forEach(key => {
      if (isEvent(key)) {
        const eventType = key.toLowerCase().substring(2);
        document.addEventListener(eventType, props[key]);
      } else {
        element[key] = props[key];
      }
    });
  }

  if (children) {
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      element.appendChild(createComponent(child));
    }
  }
  return element;
}

// the application

const root = document.querySelectorAll('body')[0];
const main = {
  type: 'div',
  children: [
    {
      type: 'h1',
      props: {
        className: 'main-title',
        onClick: () => console.log('heya')
      },
      children: ['title']
    },
    {
      type: 'p',
      children: ['some content']
    }
  ]
};
let mainComponent = createComponent(main);
root.appendChild(mainComponent);
