import core from 'core-js';
import {ResourceType} from 'aurelia-metadata';

function camelCase(name){
  return name.charAt(0).toLowerCase() + name.slice(1);
}

export class ValueConverterResource extends ResourceType {
  constructor(name){
    super();
    this.name = name;
  }

  static convention(name){
    if(name.endsWith('ValueConverter')){
      return new ValueConverterResource(camelCase(name.substring(0, name.length - 14)));
    }
  }

  analyze(container, target){
    this.instance = container.get(target);
  }

  register(registry, name){
    registry.registerValueConverter(name || this.name, this.instance);
  }

  load(container, target){
    return Promise.resolve(this);
  }
}

export class BindingBehaviorResource extends ResourceType {
  constructor(name){
    super();
    this.name = name;
  }

  static convention(name){
    if(name.endsWith('BindingBehavior')){
      return new BindingBehaviorResource(camelCase(name.substring(0, name.length - 15)));
    }
  }

  analyze(container, target){
    this.instance = container.get(target);
  }

  register(registry, name){
    registry.registerBindingBehavior(name || this.name, this.instance);
  }

  load(container, target){
    return Promise.resolve(this);
  }
}
