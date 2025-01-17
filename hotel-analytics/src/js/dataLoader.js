// src/js/dataLoader.js
class DataLoader {
    constructor() {
        this.data = {
            hotels: null,
            rooms: null,
            bookings: null,
            aggregatedBookings: null,
            dates: null
        };
    }

    async loadAllData() {
        try {
            const [hotels, rooms, bookings, aggregatedBookings, dates] = await Promise.all([
                this.loadCSV('../public/data/dim_hotels.csv'),
                this.loadCSV('../public/data/dim_rooms.csv'),
                this.loadCSV('../public/data/fact_bookings.csv'),
                this.loadCSV('../public/data/fact_aggregated_bookings.csv'),
                this.loadCSV('../public/data/dim_date.csv')
            ]);

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
