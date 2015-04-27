import {
  createElement,
  createObserverLocator
} from './shared';
import attributes from './svg-attributes';

describe('SvgObserver', () => {
  var i, j, attribute, elementNames, elementName, element, observerLocator, observer, zzz = [];

  beforeAll(() => {
    observerLocator = createObserverLocator();
  });

  it('uses SvgObserver for native svg attributes', () => {
    for(i = 0; i < attributes.length; i++) {
      attribute = attributes[i];
      elementNames = attribute.elements;
      for(j = 0; j < elementNames.length; j++) {
        elementName = elementNames[j];
        element = createElement('<svg><' + elementName + '/></svg>').firstElementChild;
        observer = observerLocator.getObserver(element, attribute.name);
        if (element[attribute.name]) {
          zzz.push([elementName, element.constructor.name, attribute.name, element[attribute.name].constructor.name]);
          console.log(element[attribute.name].constructor.name);
        } else {
          zzz.push([elementName, element.constructor.name, attribute.name, 'undefined']);
          console.log(attribute.name + ' is undefined');
        }
      }
    }
    debugger;
  });
});
