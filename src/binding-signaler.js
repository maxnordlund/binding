export class BindingSignaler {
  constructor() {
    this.bindings = {};
    this.sources = {};
  }

  registerBinding(binding, source, name) {
    var bindings = this.bindings[name] = this.bindings[name] || [],
        sources = this.sources[name] = this.sources[name] || [];
    bindings.push(binding);
    sources.push(source);
  }

  unregisterBinding(binding, source, name) {
    var bindings = this.bindings[name],
        sources = this.sources[name],
        index = bindings ? bindings.indexOf(binding) : -1;
    if (index === -1) {
      return;
    }
    bindings.splice(index, 1);
    sources.splice(index, 1);
  }

  signal(name) {
    var bindings = this.bindings[name],
        sources = this.sources[name],
        i = bindings ? bindings.length : 0,
        binding, source, value;
    while(i--) {
      binding = bindings[i];
      source = sources[i];

      if (binding.interpolate) {
        binding.setValue();
        return;
      }

      value = binding.sourceExpression.evaluate(source, binding.lookupFunctions);
      if(value !== undefined){
        binding.targetProperty.setValue(value);
      }
    }
  }
}
