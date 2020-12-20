export const roomEnding = (num: number): string => {
  switch (num) {
    case 1:
      return "комната";
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
      return "комнат";
    default:
      return "комнаты";
  }
};
