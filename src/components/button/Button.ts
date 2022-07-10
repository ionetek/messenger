import Block from '../../core/block/Block';
import Loader from '../loader/Loader';

export default class Button extends Block {
  render() {
    const className = this.props.className ?? '';

    this.children.loader = new Loader({
      className: 'spinner-border-xs',
    });

    const temp = `
                        <button 
                            type="<% if (this.type) { %><% this.type %><% } %>" 
                            class="${className}" 
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
    return this.compile(temp, this.props);
  }
}
