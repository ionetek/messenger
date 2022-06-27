import Block from '../../core/block/Block';

export default class Textarea extends Block {
  render() {
    const temp = `<div class="input-wrapper">
                            <% if (this.label) { %>
                                <div class="input-wrapper__label"><% this.label %></div>
                            <% } %>
                            <textarea 
                                rows="2" 
                                name="<% this.name %>" 
                                class="input-wrapper__form-control-gray <% this.errors[this.name] ? ' input-wrapper__has-error' : '' %>" 
                                placeholder="Your message"
                                ><% this.value ? this.value : '' %></textarea>
                            <% if (this.errors[this.name]) { %>
                                <div class="input-wrapper__error-text"><% this.errors[this.name] %></div>
                            <% } %>
                        </div>`;
    // В данном случае render возвращает строкой разметку из шаблонизатора
    return this.compile(temp, this.props);
  }
}
