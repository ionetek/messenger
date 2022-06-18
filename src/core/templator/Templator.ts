export default class Templator {
    // Регулярное выражение для поиска тегов шаблонизатора вида <% %>
    private TEMPLATE_TAG: RegExp = /<%(.*?)?%>/g;

    // Регулярное выражение для поиска js содержимого внутри тегов шаблонизатора
    private TEMPLATE_TAG_JS_CONTENT: RegExp = /(^( )?(for|if|else|switch|case|break|{|}))(.*)?/g;

    private _template: string;

    private props: TProps;

    constructor(template: string) {
      this._template = template;
    }

    public compile(ctx: TProps) {
      this.props = ctx;
      return this._compileTemplate();
    }

    private _compileTemplate = () => {
      const tmpl: string = this._template;
      const { props } = this;

      // Объявляем переменную templateFunc.
      // Она представляет собой строку с JS синтаксисом,
      // который будем дополнять построчно при обходе шаблона
      // Каждую новую строку пишем в массив templateFuncRows

      let templateFunc: string = 'let templateFuncRows=[]; ';

      let rowStartPoint: number = 0;
      let match: any;

      const addRow = (row: string, isJavascript: boolean) => {
        if (isJavascript) {
          if (row.match(this.TEMPLATE_TAG_JS_CONTENT)) {
            templateFunc += `${row.trim()}`;
          } else {
            templateFunc += `templateFuncRows.push(${row.trim()});`;
          }
        } else if (row !== '') {
          if (row.replace(/"/g, '\\\\"').trim()) {
            templateFunc += `templateFuncRows.push("${row.replace(/\r?\n/g, '').replace(/"/g, '\\"').trim()}");`;
          }
        } else {
          templateFunc += '';
        }
        return addRow;
      };

      // Проходимся по шаблону и ищем теги вида <% %>
      while (match = this.TEMPLATE_TAG.exec(tmpl)) {
        // Отправляем в ф-цию addRow() сначала строку находящуююся до тега <% %>,
        // а потом содержимое тега <% %>
        addRow(tmpl.slice(rowStartPoint, match.index), false)(match[1], true);

        // Обновляем rowStartPoint для того, чтобы в след. раз
        // отправить ф-ции addRow строку не с самого начала шаблона
        // а с последнего найденного тега <% %>
        rowStartPoint = match.index + match[0].length;
      }

      addRow(tmpl.substr(rowStartPoint, tmpl.length - rowStartPoint), false);

      // Конвертируем массив строк templateFuncRows в единую JS строку
      templateFunc += 'return templateFuncRows.join("");';

      // Генерируем реальную JS функцию из строки templateFunc, приправив ее пропсами
      return new Function(templateFunc).apply(props);
    }
}
