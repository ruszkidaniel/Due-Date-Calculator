// Working hours
const WH_START = 9;
const WH_END = 17;
const WH_SHIFT = WH_END - WH_START;

/**
 * Calculates the due date from a submit date, and the turnaround time.
 * 
 * @param {Date} submitDate
 * @param {Number} turnaroundTime
 * @throws exception when the submitDate is not in the working hour range.
 * @returns {Date} the due date of an issue
 */
function calculateDueDate(submitDate, turnaroundTime) {

    // input type check
    if(!(submitDate instanceof Date)) {
        throw 'Invalid type of submitDate.';
    }
    
    const dueDate = new Date(submitDate);
    const submitDay = submitDate.getDay();
    const submitHour = submitDate.getHours();
    const submitMinute = submitDate.getMinutes();
    
    if(typeof turnaroundTime !== 'number') {
        throw 'Invalid type of turnaroundTime.';
    }

    // submit hour check
    if(submitHour < WH_START || submitHour >= WH_END) {
        throw 'Submit hour must be in the working hour range.';
    }

    if(turnaroundTime < 0) {
        throw 'Turnaround time must be larger than 0.';
    }

    // get days to add, and the remaining hours
    const turnaroundDays = Math.floor(turnaroundTime / WH_SHIFT);
    const hoursLeft = turnaroundTime - turnaroundDays * WH_SHIFT;

    let finalHour = submitHour + hoursLeft;
    let finalDays = turnaroundDays;

    // add plus day if the due hour overflows the work shift BUT count in the end of the shift
    if(finalHour > WH_END || finalHour == WH_END && submitMinute > 0) {
        finalDays++;
        finalHour -= WH_SHIFT;
    }
    
    // edge case workaround...
    if(hoursLeft == 0 && submitHour == WH_START && submitMinute == 0) {
        finalHour = WH_END;
        finalDays--; // undo that +1 we did before
    }

    // do the operation
    dueDate.setDate(dueDate.getDate() + finalDays);
    dueDate.setHours(finalHour);

    // get the amount of full weekends between the two dates 
    const innerWeekends = Math.floor((submitDay + turnaroundDays) / 7);
    if(innerWeekends > 0) {
        dueDate.setDate(dueDate.getDate() + 2 * innerWeekends);
    }

    // overflow to next week if due date is still a weekend
    const dueDay = dueDate.getDay();
    if(dueDay % 6 == 0) {
        dueDate.setDate(dueDate.getDate() + 2);
    }

    return dueDate;
}

module.exports = calculateDueDate;