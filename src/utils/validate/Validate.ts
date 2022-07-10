import Block from '../../core/block/Block';
import isEqual from '../isEqual/IsEqual';

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

        const input = child.getContent()!.querySelector('input, textarea') as HTMLInputElement;

        const value = input!.value.trim() ?? '';

        if ((value.length >= 1 && !strict) || strict) {
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
