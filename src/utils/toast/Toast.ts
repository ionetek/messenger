import Toast from '../../components/toast/Toast';

const toast = new Toast();

export const showToast = (text: string, type: string = 'success') => {
  toast.setProps({ text, type });
  document.body.append(toast.getContent());
  setTimeout(() => {
    toast.getContent()!.classList.add('toast-open');
  }, 1);

  setTimeout(() => {
    toast.getContent()!.classList.remove('toast-open');
  }, 5000);

  setTimeout(() => {
    toast.destroy();
  }, 5300);
};
