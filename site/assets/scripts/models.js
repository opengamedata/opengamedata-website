class GameUsage {
    constructor(gameId, sessions) {
        this.gameId = gameId;
        this.sessions = sessions;
        this.chartSessions = this.getChartSessions();
    }

    // Sessions array used for chart
    getChartSessions() {
        const chartSessions = [];
        this.sessions.forEach(element => {
            const montlyUsage = new MonthlyUsage(element.year, element.month, element.total_sessions)
            chartSessions.push({
                label: montlyUsage.monthName + " " + montlyUsage.year,
                totalSessions: montlyUsage.totalSessions,
                year: element.year,
                month: element.month
            });
        });
        return chartSessions;
    }

    // Slice chart sessions array 
    chartSlice(start, end) {
        this.chartSessions = this.getChartSessions().slice(start, end);
    }


}

class MonthlyUsage {
    constructor(year, month, total_sessions) {
        this.year = year;
        this.month = month;
        this.totalSessions = total_sessions;
        this.monthName = this.getMonthName();
    }

    getMonthName() {
        return new Date(this.year, Number(this.month)-1).toLocaleString('default', { month: 'long' });
    }

}

export { GameUsage, MonthlyUsage };