import Block from '../../core/block/Block';

export default class Button extends Block {
  render() {
    const temp = `
                        <button type="<% if (this.type) { %><% this.type %><% } %>" >
                            <% this.text %>
                        </button>
                    `;
    // В данном случае render возвращает строкой разметку из шаблонизатора
    return this.compile(temp, this.props);
  }
}
