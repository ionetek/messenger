Messenger for Yandex.Practicum
==============================

A messenger for Yandex Practicum using its own template engine.

Ссылка на Pull
Request: [https://github.com/ionetek/middle.messenger.praktikum.yandex/pull/2](https://github.com/ionetek/middle.messenger.praktikum.yandex/pull/2)

![img.png](https://oviland.ru/storage/messenger.png)

Figma - https://www.figma.com/file/zlrZR8phtJLrhB6rBMRtDY/MESSENGER

👉 [Pull request](https://github.com/ionetek/middle.messenger.praktikum.yandex/pull/2)
---
Setup
-----
Clone the repo:

    git clone https://github.com/ionetek/middle.messenger.praktikum.yandex.git -b sprint_2

Move to the project path:

    cd middle.messenger.praktikum.yandex

Install dependencies:

    npm install

Run the project:

    npm run start

Project will be available at http://localhost:3000

Demo:
-----

* [Login](https://statuesque-kringle-291216.netlify.app/)
* [Registration](https://statuesque-kringle-291216.netlify.app/registration.html)
* [Empty dialog](https://statuesque-kringle-291216.netlify.app/index.html)
* [Dialog](https://statuesque-kringle-291216.netlify.app/messages.html)
* [Account](https://statuesque-kringle-291216.netlify.app/account.html)
* [Account edit](https://statuesque-kringle-291216.netlify.app/account-edit.html)
* [Password edit](https://statuesque-kringle-291216.netlify.app/password-edit.html)
* [404 Error](https://statuesque-kringle-291216.netlify.app/404.html)
* [500 Error](https://statuesque-kringle-291216.netlify.app/500.html)

History
-----

### Sprint 1

✅ The design has been developed

✅ The basic structure of the project has been created

✅ A custom template engine has been created

### Sprint 2

✅ Typescript enabled

✅ Reactivity is enabled

✅ Validation of all forms has been done

✅ ESLint is connected

✅ Stylelint is connected

Template example
----------------

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

