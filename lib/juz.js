const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);

export const juzList = [
  { id: 1, name: "Juz 1", surahs: [1, 2] }, { id: 2, name: "Juz 2", surahs: [2] },
  { id: 3, name: "Juz 3", surahs: [2, 3] }, { id: 4, name: "Juz 4", surahs: [3, 4] },
  { id: 5, name: "Juz 5", surahs: [4] }, { id: 6, name: "Juz 6", surahs: [4, 5] },
  { id: 7, name: "Juz 7", surahs: [5, 6] }, { id: 8, name: "Juz 8", surahs: [6, 7] },
  { id: 9, name: "Juz 9", surahs: [7, 8] }, { id: 10, name: "Juz 10", surahs: [8, 9] },
  { id: 11, name: "Juz 11", surahs: [9, 10, 11] }, { id: 12, name: "Juz 12", surahs: [11, 12] },
  { id: 13, name: "Juz 13", surahs: [12, 13, 14, 15] }, { id: 14, name: "Juz 14", surahs: [15, 16] },
  { id: 15, name: "Juz 15", surahs: [17, 18] }, { id: 16, name: "Juz 16", surahs: [18, 19, 20] },
  { id: 17, name: "Juz 17", surahs: [21, 22] }, { id: 18, name: "Juz 18", surahs: [23, 24, 25] },
  { id: 19, name: "Juz 19", surahs: [25, 26, 27] }, { id: 20, name: "Juz 20", surahs: [27, 28, 29] },
  { id: 21, name: "Juz 21", surahs: range(29, 33) }, { id: 22, name: "Juz 22", surahs: range(33, 36) },
  { id: 23, name: "Juz 23", surahs: range(36, 39) }, { id: 24, name: "Juz 24", surahs: range(39, 41) },
  { id: 25, name: "Juz 25", surahs: range(41, 45) }, { id: 26, name: "Juz 26", surahs: range(46, 51) },
  { id: 27, name: "Juz 27", surahs: range(51, 57) }, { id: 28, name: "Juz 28", surahs: range(58, 66) },
  { id: 29, name: "Juz 29", surahs: range(67, 77) }, { id: 30, name: "Juz 30", surahs: range(78, 114) },
];

export const getJuzById = (id) => juzList.find((juz) => juz.id === Number(id));
