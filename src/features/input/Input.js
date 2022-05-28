import Templator from '../../templator/index';


const Input = (props) => {
    const temp = `
        <div class="input-wrapper">
                            <div class="input-wrapper__label"><% this.label %></div>
                            <input type="<% this.type %>" class="
                                    input-wrapper__form-control 
                                    input-wrapper__form-control-lg 
                                    <% this.error ? 'input-wrapper__has-error' : '' %>
                                "
                                value="<% this.value ? this.value : '' %>"
                                >
                            <% if (this.error) { %>
                                <div class="input-wrapper__error-text"><% this.error %></div>
                            <% } %>
                        </div>       
    `;

    return new Templator(temp).compile(props);
}

export default Input;



