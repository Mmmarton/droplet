'use strict';

function setCharAt(string, character, index) {
  return string.substring(0, index) + character + string.substring(index + 1);
}

function html2jsonString(html = '') {
  let json = '';
  let lastClosingIndex = 0;
  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<' && html[i + 1] !== '/') {
      //get content before element
      if (i > lastClosingIndex + 1) {
        json += `"${html.substring(lastClosingIndex, i)}",`;
      }

      //get element
      let endIndex = html.indexOf('>', i);
      let element = html.substring(i + 1, endIndex);
      let elementName = element.split(' ')[0];
      json += ` {"elementName":"${elementName}",`;

      //get props
      let props = getProps(element, elementName);
      if (props) {
        json += `"props":{${props}},`;
      }

      //get element inner content
      let hasChildren = element[element.length - 1] !== '/';
      if (hasChildren) {
        html = setCharAt(html, ' ', endIndex);
        let startIndex = endIndex + 1;
        endIndex = html.indexOf(`</${elementName}>`, endIndex);
        let content = html.substring(startIndex, endIndex);
        json += `"children":[${html2jsonString(content)}]`;
        i = endIndex + 1;
      }
    } else if (html[i] === '>') {
      json += '},';
      lastClosingIndex = i + 1;
    }
  }
  if (lastClosingIndex !== html.length) {
    json += `"${html.substring(lastClosingIndex)}",`;
  }
  return json;
}

function getProps(element, elementName) {
  return element
    .substring(elementName.length)
    .replace(/((\/)|( \/))?/, '')
    .replace(
      new RegExp(/([a-zA-Z0-9]+?)\=['"](.+?)['"]((\/)|( \/))?/, 'g'),
      '"$1":"$2",'
    );
}

function html2json(html) {
  html = html.replace(new RegExp(/[\n\r\t]/, 'g'), ' ');
  html = html.replace(new RegExp(/ {2,}/, 'g'), ' ');
  html = html.replace(new RegExp(/> </, 'g'), '><');
  let jsonString = html2jsonString(html);
  jsonString = jsonString.replace(new RegExp(/(,([\]\}$]))|(,$)/, 'g'), '$1');
  jsonString = jsonString.replace(new RegExp(/,([\]\}$])/, 'g'), '$1');
  return JSON.parse(jsonString);
}

export { html2json };
