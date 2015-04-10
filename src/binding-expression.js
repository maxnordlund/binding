import {ONE_WAY, TWO_WAY} from './binding-modes';

export class BindingExpression {
  constructor(observerLocator, targetProperty, sourceExpression,
    mode, lookupFunctions, attribute){
    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.sourceExpression = sourceExpression;
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
    this.attribute = attribute;
    this.discrete = false;
  }

  createBinding(target){
    return new Binding(
      this.observerLocator,
      this.sourceExpression,
      target,
      this.targetProperty,
      this.mode,
      this.lookupFunctions
      );
  }
}

class Binding {
  constructor(observerLocator, sourceExpression, target, targetProperty, mode, lookupFunctions){
    this.observerLocator = observerLocator;
    this.sourceExpression = sourceExpression;
    this.targetProperty = observerLocator.getObserver(target, targetProperty);
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
  }

  getObserver(obj, propertyName){
    return this.observerLocator.getObserver(obj, propertyName);
  }

  bind(source){
    var targetProperty = this.targetProperty,
        info, updateTarget, updateSource, behavior;

    if ('connectBehavior' in this.sourceExpression) {
      behavior = this.behavior = this.sourceExpression.connectBehavior(this, source);
    }

    if ('bind' in targetProperty){
      targetProperty.bind();
    }

    if(this.mode == ONE_WAY || this.mode == TWO_WAY){
      if(this._disposeObserver){
        if(this.source === source){
          return;
        }

        this.unbind();
      }

      info = this.sourceExpression.connect(this, source);

      if(info.observer){
        updateTarget =
          newValue => {
            var existing = targetProperty.getValue();
            if(newValue !== existing){
              targetProperty.setValue(newValue);
            }
          };
        if (behavior) {
          updateTarget = behavior.interceptUpdateTarget(updateTarget);
        }
        this._disposeObserver = info.observer.subscribe(updateTarget);
      }

      if(info.value !== undefined){
        targetProperty.setValue(info.value);
      }

      if(this.mode == TWO_WAY){
        updateSource =
          newValue => {
            this.sourceExpression.assign(source, newValue, this.lookupFunctions);
          };
        if (behavior) {
          updateSource = behavior.interceptUpdateSource(updateSource);
        }
        this._disposeListener = targetProperty.subscribe(updateSource);
      }

      this.source = source;
    }else{
      var value = this.sourceExpression.evaluate(source, this.lookupFunctions);

      if(value !== undefined){
        targetProperty.setValue(value);
      }
    }
  }

  unbind(){
    if (this.behavior) {
      this.behavior.unbind();
    }
    if ('unbind' in this.targetProperty){
      this.targetProperty.unbind();
    }
    if(this._disposeObserver){
      this._disposeObserver();
      this._disposeObserver = null;
    }

    if(this._disposeListener){
      this._disposeListener();
      this._disposeListener = null;
    }
  }
}
