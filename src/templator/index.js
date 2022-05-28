export default class Templator {

    //Регулярное выражение для поиска тегов шаблонизатора вида <% %>
    TEMPLATE_TAG = /<%(.*?)?%>/g;

    //Регулярное выражение для поиска js содержимого внутри тегов шаблонизатора
    TEMPLATE_TAG_JS_CONTENT = /(^( )?(for|if|else|switch|case|break|{|}))(.*)?/g;

    constructor(template) {
        this._template = template;

    }

    compile(ctx) {
        this.props = ctx;
        return this._compileTemplate(ctx);

    }

    _compileTemplate = (ctx) => {

        let tmpl = this._template;
        let props = this.props;

        //Объявляем переменную templateFunc.
        //Она представляет собой строку с JS синтаксисом,
        //который будем дополнять построчно при обходе шаблона
        //Каждую новую строку пишем в массив templateFuncRows

        let templateFunc = 'let templateFuncRows=[]; ';

        let rowStartPoint = 0;
        let match;

        const addRow = (row, isJavascript) => {
            if (isJavascript) {
                if (row.match(this.TEMPLATE_TAG_JS_CONTENT)) {
                    templateFunc += row.trim() + '';
                } else {
                    templateFunc += 'templateFuncRows.push(' + row.trim() + ');';
                }
            } else {
                if (row !== '') {
                    if( row.replace(/"/g, '\\\\"').trim()) {
                        templateFunc += 'templateFuncRows.push("' + row.replace(/\r?\n/g, "").replace(/\"/g, '\\"').trim() + '");';
                    }
                } else {
                    templateFunc += '';
                }
            }
            return addRow;
        }

        //Проходимся по шаблону и ищем теги вида <% %>
        while(match = this.TEMPLATE_TAG.exec(tmpl)) {

            //Отправляем в ф-цию addRow() сначала строку находящуююся до тега <% %>,
            //а потом содержимое тега <% %>
            addRow(tmpl.slice(rowStartPoint, match.index))(match[1], true);

            //Обновляем rowStartPoint для того, чтобы в след. раз
            //отправить ф-ции addRow строку не с самого начала шаблона, а с последнего найденного тега <% %>
            rowStartPoint = match.index + match[0].length;
        }

        addRow(tmpl.substr(rowStartPoint, tmpl.length - rowStartPoint));

        //Конвертируем массив строк templateFuncRows в единую JS строку
        templateFunc += 'return templateFuncRows.join("");';

        console.log(templateFunc);

        //Генерируем реальную JS функцию из строки templateFunc, приправив ее пропсами
        return Function(templateFunc).apply(props);
    }
}
