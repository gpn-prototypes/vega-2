import { getPluralForm } from '../../../../../../../utils/getPluralForm';

type UploadStatisticsType = {
  filesLeftMessage: string;
  timeLeftMessage: string;
  progressPercent: number;
};

export const getUploadStatistics = (fileList: File[]): UploadStatisticsType => {
  const filePluralForm = getPluralForm(['файл', 'файла', 'файлов'], { includeNumber: true });
  const timePluralForm = getPluralForm(['минута', 'минуты', 'минут'], { includeNumber: true });

  const filesLeft = fileList.length;
  const timeLeft = 2; // заглушка
  const progressPercent = 66; // заглушка

  const filesLeftMessage = `Загружается ${filePluralForm(filesLeft)}`;
  const timeLeftMessage = `Осталось ориентировочно ${timePluralForm(timeLeft)}`;

  return { filesLeftMessage, timeLeftMessage, progressPercent };
};

export const formatBytes = (bytes: number, decimal: number): string => {
  const marker = 1024;
  const kiloBytes = marker;
  const megaBytes = kiloBytes * marker;
  const gigaBytes = megaBytes * marker;

  if (bytes < kiloBytes) return `${bytes} Б`;
  if (bytes < megaBytes) return `${(bytes / kiloBytes).toFixed(decimal)} Кб`;
  if (bytes < gigaBytes) return `${(bytes / megaBytes).toFixed(decimal)} Мб`;

  return `${(bytes / gigaBytes).toFixed(decimal)} Гб`;
};

/*

  ""                            -->   ""
  "name"                        -->   ""
  "name.txt"                    -->   "txt"
  ".htpasswd"                   -->   ""
  "name.with.many.dots.ext"     -->   "ext"

*/

export const getExtension = (name: string): string => {
  const index = name.lastIndexOf('.');

  if (name === '' || index < 1) return '';

  return name.slice(index + 1).toLowerCase();
};
