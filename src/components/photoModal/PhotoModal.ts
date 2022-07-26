import Block from '../../core/block/Block';
import CloseIcon from './closeIcon.svg';


export default class PhotoModal extends Block {
  constructor(props: TProps) {
    const defaultValues = {
      isOpened: false,
    };

    const customEvents = [
      {
        selector: '.btn-close',
        events: {
          click: () => {
            this.setProps({ isOpened: false });
          },
        },
      },

    ];

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren, customEvents);
  }

  render() {

    let isOpenedClass = this.props.isOpened ? 'modal-opened' : '';

    const temp = `<div class="modal-wrapper ${isOpenedClass}">
                       <div class="modal">
                            <a class="btn btn-nav btn-close">
                                    <img src="${CloseIcon}" />
                            </a>
                            <img src="<% this.image %>" class="modal-image" />
                       </div>
                  </div>`;
    return this.compile(temp, this.props);
  }
}
