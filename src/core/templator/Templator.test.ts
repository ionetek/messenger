import { assert } from 'chai';
import Templator from './Templator';

describe('Templator', () => {
  it('TEMPLATE VARS', () => {
    const props = {
      content: 'Some content',
    };
    const temp = '<p><% this.content %></p>';

    const template = new Templator(temp).compile(props);
    assert.equal(
      template,
      '<p>Some content</p>',
    );
  });

  it('TEMPLATE CONDITIONS', () => {
    const props = {
      val: '777',
    };
    const temp = '<p><% if (this.val == 777){ %><% this.val %><% } %></p>';

    const template = new Templator(temp).compile(props);
    assert.equal(
      template,
      '<p>777</p>',
    );
  });

  it('TEMPLATE CYCLES', () => {
    const props = {
      list: [
        'One ',
        'Two ',
        'Three',
      ],
    };
    const temp = '<p><% for (key in this.list) { %> <% this.list[key] %><% } %></p>';

    const template = new Templator(temp).compile(props);
    assert.equal(
      template,
      '<p>One Two Three</p>',
    );
  });
});
