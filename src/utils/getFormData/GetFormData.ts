export const getFormData = (target: TObj) => {
  const formData = {} as IFormData;
  if (target) {
    target.forEach((item: HTMLInputElement) => {
      if (['INPUT', 'TEXTAREA'].includes(item.nodeName)) {
        if (item.name && formData) {
          formData[item.name] = item.value;
        }
      }
    });
  }
  return formData;
};
