import Block from '../../core/block/Block';

export default class Input extends Block {
  render() {
    const temp = `<div class="input-wrapper">
                            <div class="input-wrapper__label"><% this.label %></div>
                            <input type="<% this.type %>" name="<% this.name %>" class="input-wrapper__form-control input-wrapper__form-control-lg <% this.errors[this.name] ? ' input-wrapper__has-error' : '' %>
                                "
                                value="<% this.value ? this.value : '' %>"
                                >
                            <% if (this.errors[this.name]) { %>
                                <div class="input-wrapper__error-text"><% this.errors[this.name] %></div>
                            <% } %>
                        </div>`;
    // В данном случае render возвращает строкой разметку из шаблонизатора
    return this.compile(temp, this.props);
  }
}
