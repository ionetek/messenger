const dateFormater = (unformatedDate: string | null) => {
  if (!unformatedDate) {
    return null;
  }
  const date = new Date(unformatedDate);
  const now = new Date();
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const mouth = months[date.getMonth()];
  const day = date.getDate();
  const metaHours = date.getHours();
  const hours = metaHours >= 10 ? metaHours : `0${metaHours}`;
  const metaMinutes = date.getMinutes();
  const minutes = metaMinutes >= 10 ? metaMinutes : `0${metaMinutes}`;

  const diff = now.getDate() - day;

  let dateString = `${day} ${mouth}`;

  if (diff < 1) {
    dateString = `${hours}:${minutes}`;
  }

  if (diff === 1) {
    dateString = 'Вчера';
  }

  return dateString;
};

export default dateFormater;