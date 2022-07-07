import { expect } from 'chai';
import Block from './Block';

describe('BLOCK TESTING:', () => {
  let isMounted = false;
  let isRendered = false;
  let isRenderAfterUpdate = false;

  class TestComponent extends Block {
    constructor(props: TProps) {
      super({
        value: props?.value ?? '',
      });
    }

    componentDidMount() {
      isMounted = true;
    }

    render() {
      isRendered = true;
      if (this.props.value === 'New value') {
        isRenderAfterUpdate = true;
      }
      const temp = `<div class="input-wrapper">
                            <input type="text" value="<% this.value ? this.value : '' %>">
                      </div>`;
      return this.compile(temp, this.props);
    }
  }

  it('MOUNTING', () => {
    expect(isMounted).to.eq(true);
  });

  it('RENDER', () => {
    expect(isRendered).to.eq(true);
  });

  it('CREATING COMPONENT WITHOUT PROPS', () => {
    const testComponentWithoutProps = new TestComponent({ value: '' });
    expect(testComponentWithoutProps.props.value).to.eq('');
  });

  it('CREATING COMPONENT WITH PROPS', () => {
    const testComponentWithProps = new TestComponent({ value: 'Some value' });
    expect(testComponentWithProps.props.value).to.eq('Some value');
  });

  const testComponent = new TestComponent({});

  it('SETTING PROPS', () => {
    testComponent.setProps({
      value: 'New value',
    });
    expect(testComponent.props.value).to.eq('New value');
  });

  it('RENDER AFTER SETTING PROPS', () => {
    expect(isRenderAfterUpdate).to.eq(true);
  });
});
