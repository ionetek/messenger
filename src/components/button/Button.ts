import Block from '../../core/block/Block';
import Loader from '../loader/Loader';

export default class Button extends Block {
  render() {
    let cl;
    if (this.props.className) {
      cl = this.props.className;
    } else {
      cl = '';
    }

    this.children.loader = new Loader({
      className: 'spinner-border-xs',
    });

    const temp = `
                        <button 
                            type="<% if (this.type) { %><% this.type %><% } %>" 
                            class="${cl}" 
                            <% if (this.isLoading) { %>
                                disabled
                            <% } %> 
                        >
                        <% if (this.isLoading) { %>
                            <% this.loader %>
                        <% } else { %>
                            <% this.text %>
                        <% } %>
                            
                            
                        </button>
                    `;
    // В данном случае render возвращает строкой разметку из шаблонизатора
    return this.compile(temp, this.props);
  }
}
