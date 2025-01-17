// src/js/charts.js
class ChartManager {
    constructor(data) {
        this.data = data;
        this.charts = {};
        this.initializeCharts();
    }

    initializeCharts() {
        this.createRevenueChart();
        this.createPlatformChart();
        this.createOccupancyChart();
        this.createRatingChart();
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Revenue Generated',
                        borderColor: '#2ecc71',
                        data: []
                    },
                    {
                        label: 'Revenue Realized',
                        borderColor: '#3498db',
                        data: []
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Revenue (₹)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    createPlatformChart() {
        const ctx = document.getElementById('platformChart').getContext('2d');
        this.charts.platform = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#2ecc71',
                        '#3498db',
                        '#e74c3c',
                        '#f1c40f',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    createOccupancyChart() {
        const ctx = document.getElementById('occupancyChart').getContext('2d');
        this.charts.occupancy = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Occupancy Rate',
                    backgroundColor: '#3498db',
                    data: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Occupancy Rate (%)'
                        }
                    }
                }
            }
        });
    }

    createRatingChart() {
        const ctx = document.getElementById('ratingChart').getContext('2d');
        this.charts.rating = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1★', '2★', '3★', '4★', '5★'],
                datasets: [{
                    label: 'Number of Ratings',
                    backgroundColor: '#f1c40f',
                    data: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Reviews'
                        }
                    }
                }
            }
        });
    }

    updateCharts(filteredData) {
        this.updateRevenueChart(filteredData);
        this.updatePlatformChart(filteredData);
        this.updateOccupancyChart(filteredData);
        this.updateRatingChart(filteredData);
    }

    updateRevenueChart(filteredData) {
        const revenueByDate = {};
        filteredData.forEach(booking => {
            const date = new Date(booking.check_in_date).toLocaleDateString();
            if (!revenueByDate[date]) {
                revenueByDate[date] = {
                    generated: 0,
                    realized: 0
                };
            }
            revenueByDate[date].generated += parseFloat(booking.revenue_generated);
            revenueByDate[date].realized += parseFloat(booking.revenue_realized);
        });

        const dates = Object.keys(revenueByDate).sort();
        this.charts.revenue.data.labels = dates;
        this.charts.revenue.data.datasets[0].data = dates.map(date => revenueByDate[date].generated);
        this.charts.revenue.data.datasets[1].data = dates.map(date => revenueByDate[date].realized);
        this.charts.revenue.update();
    }

    updatePlatformChart(filteredData) {
        const platformCounts = {};
        filteredData.forEach(booking => {
            platformCounts[booking.booking_platform] = (platformCounts[booking.booking_platform] || 0) + 1;
        });

        this.charts.platform.data.labels = Object.keys(platformCounts);
        this.charts.platform.data.datasets[0].data = Object.values(platformCounts);
        this.charts.platform.update();
    }

    updateOccupancyChart(filteredData) {
        const occupancyByRoom = {};
        const totalCapacity = {};

        this.data.aggregatedBookings.forEach(booking => {
            if (!occupancyByRoom[booking.room_category]) {
                occupancyByRoom[booking.room_category] = 0;
                totalCapacity[booking.room_category] = 0;
            }
            occupancyByRoom[booking.room_category] += parseInt(booking.successful_bookings);
            totalCapacity[booking.room_category] += parseInt(booking.capacity);
        });

        const roomCategories = Object.keys(occupancyByRoom);
        const occupancyRates = roomCategories.map(room => 
            (occupancyByRoom[room] / totalCapacity[room] * 100).toFixed(2)
        );

        this.charts.occupancy.data.labels = roomCategories;
        this.charts.occupancy.data.datasets[0].data = occupancyRates;
        this.charts.occupancy.update();
    }

    updateRatingChart(filteredData) {
        const ratings = [0, 0, 0, 0, 0];
        filteredData.forEach(booking => {
            if (booking.ratings_given) {
                ratings[Math.floor(booking.ratings_given) - 1]++;
            }
        });

        this.charts.rating.data.datasets[0].data = ratings;
        this.charts.rating.update();
    }
}