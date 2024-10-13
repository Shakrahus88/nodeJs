function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let current = new Date(start.getFullYear(), start.getMonth(), 1); // Start at the first of the start month
    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];
    let totalWorkingDays = 0;
    let totalWorkedDays = 0;

    // Helper function to check if a date is a Friday
    function isFriday(date) {
        return date.getDay() === 5;
    }

    // Function to get the total number of working days in a month (excluding Fridays)
    function countWorkingDaysInMonth(year, month) {
        let count = 0;
        let date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            if (!isFriday(date)) count++;
            date.setDate(date.getDate() + 1);
        }
        return count;
    }

    // Function to get actual working days within a specific range in a month (excluding Fridays)
    function countActualWorkingDaysInMonth(startDate, endDate) {
        let count = 0;
        let date = new Date(startDate);
        while (date <= endDate) {
            if (!isFriday(date)) count++;
            date.setDate(date.getDate() + 1);
        }
        return count;
    }

    // Loop through each month in the range
    while (current <= end) {
        const year = current.getFullYear();
        const month = current.getMonth();

        // Get the total working days in this month
        const totalDaysInMonth = countWorkingDaysInMonth(year, month);
        daysExcludingFridays.push(totalDaysInMonth);
        totalWorkingDays += totalDaysInMonth;

        // Get the actual working days within the given date range
        const monthStartDate = new Date(year, month, 1);
        const monthEndDate = new Date(year, month + 1, 0); // Last day of the month

        const actualStartDate = (current.getTime() < start.getTime()) ? start : monthStartDate;
        const actualEndDate = (end.getTime() < monthEndDate.getTime()) ? end : monthEndDate;

        const workedDaysInMonth = countActualWorkingDaysInMonth(actualStartDate, actualEndDate);
        daysWorkedExcludingFridays.push(workedDaysInMonth);
        totalWorkedDays += workedDaysInMonth;

        current.setMonth(current.getMonth() + 1); // Move to the next month
    }

    // Calculate the monthly targets based on the working days
    const dailyTarget = totalAnnualTarget / totalWorkingDays;
    for (let i = 0; i < daysWorkedExcludingFridays.length; i++) {
        const monthTarget = dailyTarget * daysWorkedExcludingFridays[i];
        monthlyTargets.push(monthTarget);
    }

    const totalTarget = monthlyTargets.reduce((acc, val) => acc + val, 0);

    return {
        daysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget
    };
}

// Example usage
const result = calculateTotalTarget('2024-01-01', '2024-03-31', 5000);
console.log(result);