##Messenger for Yandex.Practicum
A messenger for Yandex Practicum using its own template engine.

![img.png](https://oviland.ru/storage/messenger.png)

Figma - https://www.figma.com/file/zlrZR8phtJLrhB6rBMRtDY/MESSENGER

## Setup
    npm run start

##Demo:
* [Login](https://netlify.app/)
* [Registration](https://netlify.app/registration.html)
* [Empty dialog](https://netlify.app/index.html)
* [Dialog](https://netlify.app/messages.html)
* [Account](https://netlify.app/account.html)
* [Account edit](https://netlify.app/account-edit.html)
* [Password edit](https://netlify.app/password-edit.html)
* [404 Error](https://netlify.app/404.html)
* [500 Error](https://netlify.app/500.html)

##Pull request:

## Template example
 ```jsx
import Templator from '../../templator/index';
const List = (props) => {
    const temp = `
        <ul>
            <% if(this.items) {%>
                <% for (key in this.items) { %>
                    <li>
                        <% this.items[key].text %>
                    </li>
                <% } %>
            <% } %>
        </ul>      
    `;

    return new Templator(temp).compile(props);
}

export default List;
```

