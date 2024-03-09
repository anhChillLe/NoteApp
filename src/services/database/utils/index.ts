export function autoTimestamp(){
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){
    const original = descriptor.value
    descriptor.value = function(...args: []){
      const result = original.apply(this, args)
      if(result != null && typeof result == 'object'){
        result.createAt = new Date()
        result.updateAt = null
      }
      return result
    }
  }
}