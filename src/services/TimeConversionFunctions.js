export function parseTime(timeStr, baseDate = new Date()) {
    const [time, ampm] = timeStr.split(" "); // Split into time and AM/PM
    let [hours, minutes] = time.split(":").map(Number);
  
    if (ampm.toLowerCase() === "pm" && hours !== 12) {
        hours += 12; // Convert PM times to 24-hour format
    }
    if (ampm.toLowerCase() === "am" && hours === 12) {
        hours = 0; // Convert 12 AM to 00:00
    }
  
    const dateTime = new Date(baseDate);
    dateTime.setHours(hours, minutes, 0, 0); // Set parsed hours and minutes
    return dateTime;
  }
  
  export function hasConflict(eventStartTime, eventEndTime, userStartTime, userEndTime) {
    const now = new Date(); // Use today's date as a reference
    const eStartTime = parseTime(eventStartTime, now);
    const eEndTime = parseTime(eventEndTime, now);
    const uStartTime = parseTime(userStartTime, now);
    const uEndTime = parseTime(userEndTime, now);
  
    return eStartTime < uEndTime && eEndTime > uStartTime;
  }
  
  export function convertDurationToMinutes(duration) {
    console.log(duration);
    const parts = duration.split(" ");
    const value = parseInt(parts[0]); // Extract the numeric value
    // console.log(parts[1]);
    const unit = parts[1].toLowerCase(); // Extract the unit (hour/minutes)
  
    if (unit.startsWith("hour")) { // Handles "hour" or "hours"
        return value * 60;
    } else if (unit.startsWith("minute")) { // Handles "minute" or "minutes"
        return value;
    } else {
        throw new Error("Invalid duration format");
    }
  }
  