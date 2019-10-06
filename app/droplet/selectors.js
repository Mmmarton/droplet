function find(element, nth = 0) {
  function convertToViewElement(htmlElement) {
    htmlElement.setContent = content => {
      htmlElement.innerHTML = content;
    };
    return htmlElement;
  }

  const elements = document.getElementsByTagName(element);
  return elements
    ? elements.length > nth
      ? convertToViewElement(elements[nth])
      : null
    : null;
}

export { find };
