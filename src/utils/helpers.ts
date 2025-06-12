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

  export const taskbg = (p: string): string => {
    switch(p){
      case "ONE":
        return "#fae0e4";
      case "TWO":
        return "#ffd7ba";
      case "THREE":
        return "#e3f2fd";
      case "FOUR":
        return "#fff6cc";
      case "FIVE":
        return "#ffffff";
      default:
        return "#f8f9fa";
    }
  }
  
export const priority = (p: string): string => {
    switch (p) {
      case "ONE":
        return "urgent";
      case "TWO":
        return "high";
      case "THREE":
        return "medium";
      case "FOUR":
        return "low";
      case "FIVE":
        return "normal";
      default:
        return "normal";
    }
  };
export const priorityValues = (p: string): number => {
    switch (p) {
      case "ONE":
        return 1;
      case "TWO":
        return 2;
      case "THREE":
        return 3;
      case "FOUR":
        return 4;
      case "FIVE":
        return 5;
      default:
        return 5;
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