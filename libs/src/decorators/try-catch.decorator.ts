export function TryCatchDec(): ClassDecorator {
  return (target: any) => {
    const originalMethods = Object.getOwnPropertyNames(target.prototype);

    originalMethods.forEach((methodName) => {
      const originalMethod = target.prototype[methodName];

      if (typeof originalMethod === 'function') {
        target.prototype[methodName] = async function (...args: any[]) {
          try {
            const result = await originalMethod.apply(this, args);
            console.log(
              `Executed in ${target.name} method ${methodName}: successfully`,
            );
            return result;
          } catch (error) {
            console.error(
              `Error in ${target.name} method ${methodName}: ${error.message}`,
              error.stack,
            );
            throw error;
          }
        };
      }
    });

    return target;
  };
}
