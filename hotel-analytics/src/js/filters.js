// src/js/filters.js
class FilterManager {
    constructor(data) {
        this.data = data;
        this.activeFilters = {
            city: '',
            property: '',
            platform: '',
            status: '',
            month: ''
        };
    }

    initializeFilters() {
        // Populate filter dropdowns
        const cities = [...new Set(this.data.hotels.map(hotel => hotel.city))];
        const platforms = [...new Set(this.data.bookings.map(booking => booking.booking_platform))];
        const statuses = [...new Set(this.data.bookings.map(booking => booking.booking_status))];

        this.populateDropdown('cityFilter', cities);
        this.populateDropdown('platformFilter', platforms);
        this.populateDropdown('statusFilter', statuses);

        // Event listeners
        document.getElementById('cityFilter').addEventListener('change', (e) => this.updateFilters('city', e.target.value));
        document.getElementById('propertyFilter').addEventListener('change', (e) => this.updateFilters('property', e.target.value));
        document.getElementById('platformFilter').addEventListener('change', (e) => this.updateFilters('platform', e.target.value));
        document.getElementById('statusFilter').addEventListener('change', (e) => this.updateFilters('status', e.target.value));
        document.getElementById('monthSelector').addEventListener('change', (e) => this.updateFilters('month', e.target.value));
    }

    populateDropdown(elementId, values) {
        const dropdown = document.getElementById(elementId);
        dropdown.innerHTML = `<option value="">Select ${elementId.replace('Filter', '')}</option>`;
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            dropdown.appendChild(option);
        });
    }

    updateFilters(filterType, value) {
        this.activeFilters[filterType] = value;
        
        // Update dependent dropdowns
        if (filterType === 'city') {
            const properties = this.data.hotels
                .filter(hotel => !value || hotel.city === value)
                .map(hotel => hotel.property_name);
            this.populateDropdown('propertyFilter', properties);
        }

        // Trigger data update
        this.applyFilters();
    }

    applyFilters() {
        let filteredData = this.data.bookings;

        // Apply each active filter
        if (this.activeFilters.city) {
            const cityHotels = this.data.hotels
                .filter(hotel => hotel.city === this.activeFilters.city)
                .map(hotel => hotel.property_id);
            filteredData = filteredData.filter(booking => cityHotels.includes(booking.property_id));
        }

        if (this.activeFilters.property) {
            const propertyId = this.data.hotels.find(hotel => hotel.property_name === this.activeFilters.property)?.property_id;
            filteredData = filteredData.filter(booking => booking.property_id === propertyId);
        }

        if (this.activeFilters.platform) {
            filteredData = filteredData.filter(booking => booking.booking_platform === this.activeFilters.platform);
        }

        if (this.activeFilters.status) {
            filteredData = filteredData.filter(booking => booking.booking_status === this.activeFilters.status);
        }

        

        // src/js/filters.js (continuation)
        if (this.activeFilters.month) {
        filteredData = filteredData.filter(booking => {
            const bookingMonth = new Date(booking.check_in_date)
                .toLocaleString('en-US', { month: 'short', year: '2-digit' });
            return bookingMonth === this.activeFilters.month;
        });
    }

    // Trigger chart updates
    window.chartManager.updateCharts(filteredData);
    window.updateKPIs(filteredData);
}

    getFilteredData() {
        return this.applyFilters();
    }
}