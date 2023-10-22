JS Messenger without using third-party libraries
==============================

The messenger using its own template engine. The possibility of video calls between users is implemented. The project is written without using third-party libraries.

![img.png](https://oviland.ru/storage/ya-messenger.png)

Figma - https://www.figma.com/file/zlrZR8phtJLrhB6rBMRtDY/MESSENGER

👉 [Demo on Heroku](https://yandex-msngr.herokuapp.com/)
---
Setup
-----
Clone the repo:

    git clone https://github.com/ionetek/messenger.git .

Install dependencies:

    npm install

Run the project:

    npm run start

Project will be available at http://localhost:3000

Test:

    npm run test


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

### Sprint 4

✅ Switching from Parcel to Webpack

✅ Dockerfile created

✅ Adding and removing users in chats

✅ Uploading an avatar for a chat

✅ Live chat search

✅ **P2P video calls using WebRTC**

✅ Sending photos to the chat

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
