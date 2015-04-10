export class ListenerExpression {
  constructor(eventManager, targetEvent, sourceExpression, delegate, preventDefault, lookupFunctions){
    this.eventManager = eventManager;
    this.targetEvent = targetEvent;
    this.sourceExpression = sourceExpression;
    this.delegate = delegate;
    this.discrete = true;
    this.preventDefault = preventDefault;
    this.lookupFunctions = lookupFunctions;
  }

  createBinding(target){
    return new Listener(
      this.eventManager,
      this.targetEvent,
      this.delegate,
      this.sourceExpression,
      target,
      this.preventDefault,
      this.lookupFunctions
      );
  }
}

export class Listener {
  constructor(eventManager, targetEvent, delegate, sourceExpression, target, preventDefault, lookupFunctions){
    this.eventManager = eventManager;
    this.targetEvent = targetEvent;
    this.delegate = delegate;
    this.sourceExpression = sourceExpression;
    this.target = target;
    this.preventDefault = preventDefault;
    this.lookupFunctions = lookupFunctions;
  }

  bind(source){
    var behavior, callSource;
    if ('connectBehavior' in this.sourceExpression) {
      behavior = this.behavior = this.sourceExpression.connectBehavior(this, source);
    }

    if(this._disposeListener){
      if(this.source === source){
        return;
      }

      this.unbind();
    }

    this.source = source;
    callSource = event => {
      var prevEvent = source.$event;
      source.$event = event;
      var result = this.sourceExpression.evaluate(source);
      source.$event = prevEvent;
      if(result !== true && this.preventDefault){
        event.preventDefault();
      }
      return result;
    };
    if (behavior) {
      callSource = behavior.interceptUpdateSource(callSource);
    }
    this._disposeListener = this.eventManager.addEventListener(this.target, this.targetEvent, callSource, this.delegate);
  }

  unbind(){
    if (this.behavior) {
      this.behavior.unbind();
    }
    if(this._disposeListener){
      this._disposeListener();
      this._disposeListener = null;
    }
  }
}
