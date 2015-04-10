export class CallExpression {
  constructor(observerLocator, targetProperty, sourceExpression, lookupFunctions){
    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.sourceExpression = sourceExpression;
    this.lookupFunctions = lookupFunctions;
  }

  createBinding(target){
    return new Call(
      this.observerLocator,
      this.sourceExpression,
      target,
      this.targetProperty,
      this.lookupFunctions
      );
  }
}

class Call {
  constructor(observerLocator, sourceExpression, target, targetProperty, lookupFunctions){
    this.sourceExpression = sourceExpression
    this.target = target;
    this.targetProperty = observerLocator.getObserver(target, targetProperty);
    this.lookupFunctions = lookupFunctions;
  }

  bind(source){
    if(this.source === source){
      return;
    }

    if(this.source){
      this.unbind();
    }

    this.source = source;
    this.targetProperty.setValue((...rest) => {
      return this.sourceExpression.evaluate(source, this.lookupFunctions, rest);
    });
  }

  unbind(){
    this.targetProperty.setValue(null);
  }
}
