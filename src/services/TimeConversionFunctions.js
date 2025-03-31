export function parseTime(timeStr, baseDate = new Date()) {
    const [time, ampm] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    if (ampm.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
    }
    if (ampm.toLowerCase() === "am" && hours === 12) {
        hours = 0;
    }
  
    const dateTime = new Date(baseDate);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }
  
  export function hasConflict(eventStartTime, eventEndTime, userStartTime, userEndTime) {
    const now = new Date();
    const eStartTime = parseTime(eventStartTime, now);
    const eEndTime = parseTime(eventEndTime, now);
    const uStartTime = parseTime(userStartTime, now);
    const uEndTime = parseTime(userEndTime, now);
  
    return eStartTime < uEndTime && eEndTime > uStartTime;
  }
  
  export function convertDurationToMinutes(duration) {
    console.log(duration);
    const parts = duration.split(" ");
    const value = parseInt(parts[0]);
    const unit = parts[1].toLowerCase();
  
    if (unit.startsWith("hour")) {
        return value * 60;
    } else if (unit.startsWith("minute")) {
        return value;
    } else {
        throw new Error("Invalid duration format");
    }
  }
  