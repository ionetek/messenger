import Block from '../../core/block/Block';
import './Toast.css';

export default class Toast extends Block {
  render() {
    let cl = 'text-green';
    if (this.props.type == 'error') {
      cl = 'text-red';
    }
    const temp = `<div class="toast ${cl}">
                            
                         <% if (this.type === 'error') { %>
                             😬 &nbsp;
                            <% } %>
                            
                            <% if (this.type === 'success') { %>
                             ✅ &nbsp;
                            <% } %>
                            <% if (this.text) { %>
                                <% this.text %>
                            <% } %>
                            
                                        
                        </div>`;
    // В данном случае render возвращает строкой разметку из шаблонизатора
    return this.compile(temp, this.props);
  }
}
