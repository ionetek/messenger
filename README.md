Messenger for Yandex.Practicum
==============================

A messenger for Yandex Practicum using its own template engine.

Ссылка на Pull
Request: [https://github.com/ionetek/middle.messenger.praktikum.yandex/pull/6](https://github.com/ionetek/middle.messenger.praktikum.yandex/pull/7)

![img.png](https://oviland.ru/storage/messenger.png)

Figma - https://www.figma.com/file/zlrZR8phtJLrhB6rBMRtDY/MESSENGER

👉 [Demo](https://statuesque-kringle-291216.netlify.app/)
---
Setup
-----
Clone the repo:

    git clone https://github.com/ionetek/middle.messenger.praktikum.yandex.git -b sprint_3

Move to the project path:

    cd middle.messenger.praktikum.yandex

Install dependencies:

    npm install

Run the project:

    npm run start

Project will be available at http://localhost:3000

Test:

    npm run test

Demo:
-----

* [Login](https://statuesque-kringle-291216.netlify.app/)
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

### Sprint 3

✅ Implemented full-fledged routing with obtaining parameters from the SEO URL and checking access rights

✅ API created

✅ Sign in, Registration, Account editing, Avatar uploading were implemented

✅ Store created

✅ WebSocket is enabled for chat messages

✅ Tests have been written for the template engine, router, component, request sending module(Mocha, Chai)

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