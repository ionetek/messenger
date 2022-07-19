export const getPeerData = (message: string): boolean | TObj => {

  let content;
  try {
    //Пытаемся преобразовать полученное сообщение в JSON
    content = JSON.parse(`${message}`);
  } catch {
    return false;
  }

  if (content && content.type === 'videoCall') {
    return { type: 'videoCall', id: content.peerId };
  } else {
    return false;
  }
};

 