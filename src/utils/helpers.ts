import dayjs from "dayjs";

export function priorityFlag(p: string): string {
    switch (p) {
      case "ONE":
        return "red";
      case "TWO":
        return "orange";
      case "THREE":
        return "blue";
      case "FOUR":
        return "yellow";
      case "FIVE":
        return "white";
      default:
        return "gray";
    }
  }
  
export const priority = (p: string): string => {
    switch (p) {
      case "ONE":
        return "p1";
      case "TWO":
        return "p2";
      case "THREE":
        return "p3";
      case "FOUR":
        return "p4";
      case "FIVE":
        return "p5";
      default:
        return "p5";
    }
  };

export const formatDate = (inputDate: number)=>{

  const now = dayjs();
  const input = dayjs(inputDate);

  if (input.year() === now.year()) {
    return input.format("D MMM h:mm A"); // Format as "9 Feb"
  } else {
    return input.format("D MMM YYYY h:mm A"); // Format as "9 Feb 2026"
  }
}