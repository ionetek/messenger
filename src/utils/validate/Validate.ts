import Block from '../../core/block/Block';

function isEqual(a: TObj, b: TObj) {
  // @ts-ignore
  if (Object.entries(a).length !== Object.entries(b).length) return false;
  // @ts-ignore
  for (let i = 0; i < Object.entries(a).length; i++) {
    // @ts-ignore
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const validate = (object: Block, strict = false) => {
  // Валидация бывает строгая и нестрогая. За это отвечает параметр strict
  // НЕСТРОГАЯ ВАЛИДАЦИЯ - Не проверяет поле, если в него не было введено ни одного символа.
  // Это сделано, чтобы при blur всю форму не заваливало ошибками
  // СТРОГАЯ ВАЛИДАЦИЯ - проверяет все поля и выводит все ошибки. Срабатывает при submit
  const errors: TObj = [];
  Object.entries(object.children).forEach(([key, child]) => {
    if (object.children[key].props.required) {
      const r = child.props.required;
      const n = child.props.name;

      // Проверяем существование текста ошибки
      if (!r.text) {
        r.text = 'Required';
      }

      // Проверяем, есть ли правила валидаци
      if (r.rules) {
        // Если поле обязательно и отсутствует MIN, то объявляем его
        if (!r.rules.min) {
          r.rules.min = 1;
        }

        // @ts-ignore
        const value = child.getContent()!.querySelector('input, textarea').value.trim();

        if ((value.length >= 1 && strict === false) || strict === true) {
          // Проверяем MIN
          if (r.rules.min) {
            if (value.length < r.rules.min) {
              errors[n] = r.text;
            }
          }

          // Проверяем MAX
          if (r.rules.max) {
            if (value.length > r.rules.max) {
              errors[n] = r.text;
            }
          }
          // PATTERN
          if (r.rules.pattern) {
            const re = new RegExp(r.rules.pattern);
            if (re.test(value) === false) {
              errors[n] = r.text;
            }
          }
        }
      }
    }
  });
  if (!isEqual(object.props.errors, errors)) {
    object.setProps({ errors });
  }

  if (Object.entries(errors).length > 0) {
    return false;
  }

  return true;
};
export default validate;
