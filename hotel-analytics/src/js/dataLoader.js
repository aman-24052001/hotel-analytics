// src/js/dataLoader.js
class DataLoader {
    constructor() {
        // Get the repository name from package.json or window.location
        this.repoName = 'hotel-analytics/hotel-analytics'; // Change this to your repo name
        this.basePath = window.location.hostname === 'localhost' 
            ? '' 
            : `/${this.repoName}`;
    }

    async loadAllData() {
        try {
            const [hotels, rooms, dates, bookings, aggregatedBookings] = await Promise.all([
                d3.csv(`${this.basePath}/public/data/dim_hotels.csv`),
                d3.csv(`${this.basePath}/public/data/dim_rooms.csv`),
                d3.csv(`${this.basePath}/public/data/dim_date.csv`),
                d3.csv(`${this.basePath}/public/data/fact_bookings.csv`),
                d3.csv(`${this.basePath}/public/data/fact_aggregated_bookings.csv`)
            ])

            this.data = {
                hotels,
                rooms,
                bookings,
                aggregatedBookings,
                dates
            };

            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    async loadCSV(filepath) {
        return new Promise((resolve, reject) => {
            Papa.parse(filepath, {
                download: true,
                header: true,
                complete: (results) => resolve(results.data),
                error: (error) => reject(error)
            });
        });
    }
}
