import { showToast } from '../toast/Toast';

export const errorHandler = (e: TObj) => {
  if (e!.reason) {
    showToast(e!.reason, 'error');
  } else {
    showToast('Something went wrong', 'error');
  }
};
