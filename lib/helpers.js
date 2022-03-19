import format from "date-fns/format";
import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";

export const getFormatedTimestamp = timestamp => {
  if (!timestamp) return null;
  let createdAt =
    typeof date === "number" ? new Date(timestamp) : timestamp.toDate();

  if (isToday(createdAt)) return format(createdAt, "hh:mm aaa");
  if (isYesterday(createdAt)) return "Yesterday";

  return format(createdAt, "MMMM dd");
};
