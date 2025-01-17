// src/js/main.js

class DashboardManager {
    constructor() {
        this.dataLoader = null;
        this.filterManager = null;
        this.chartManager = null;
        this.currentData = null;
        this.previousData = null; // For trend calculations
        this.initialized = false;
    }

    async initialize() {
        try {
            await this.setupDashboard();
            this.initializeEventListeners();
            this.initializeMobileMenu();
            this.updateDateTime();
            this.initialized = true;
        } catch (error) {
            this.handleError('Dashboard initialization failed', error);
        }
    }

    async setupDashboard() {
        // Show loading state
        this.toggleLoadingState(true);

        try {
            // Initialize data loader and load data
            this.dataLoader = new DataLoader();
            this.currentData = await this.dataLoader.loadAllData();

            // Initialize managers
            this.filterManager = new FilterManager(this.currentData);
            this.chartManager = new ChartManager(this.currentData);
            window.chartManager = this.chartManager; // For global access if needed

            // Initialize filters
            this.filterManager.initializeFilters();

            // Initial updates
            this.updateDashboard(this.currentData.bookings);
            this.setupTooltips();
            this.initializeAnimations();

        } catch (error) {
            throw error;
        } finally {
            this.toggleLoadingState(false);
        }
    }

    initializeEventListeners() {
        // Filter change listeners
        document.querySelectorAll('.form-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleFilterChange(e.target.id, e.target.value);
            });
        });

        // Export button listeners
        document.querySelectorAll('.chart-actions button').forEach(button => {
            button.addEventListener('click', (e) => {
                const chartId = e.target.closest('.chart-card').querySelector('canvas').id;
                this.exportChart(chartId);
            });
        });

        // KPI card click listeners
        document.querySelectorAll('.kpi-card').forEach(card => {
            card.addEventListener('click', () => {
                const metric = card.querySelector('h6').textContent;
                this.showDetailedMetricView(metric);
            });
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            if (this.chartManager) {
                this.chartManager.updateCharts(this.currentData.bookings);
            }
        }, 250));
    }

    initializeMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        mainContent.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }

    updateDateTime() {
        const updateTime = () => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            document.getElementById('currentDate').textContent = dateStr;
        };

        updateTime();
        setInterval(updateTime, 60000); // Update every minute
    }

    async handleFilterChange(filterId, value) {
        this.toggleLoadingState(true);
        
        try {
            const filterType = filterId.replace('Filter', '').toLowerCase();
            await this.filterManager.updateFilters(filterType, value);
            
            // Store current data as previous before updating
            this.previousData = {...this.currentData};
            this.currentData = this.filterManager.getFilteredData();
            
            this.updateDashboard(this.currentData);
            this.updateTrends();
        } catch (error) {
            this.handleError('Filter update failed', error);
        } finally {
            this.toggleLoadingState(false);
        }
    }

    updateDashboard(data) {
        this.updateKPIs(data);
        this.chartManager.updateCharts(data);
        this.updateLastUpdated();
    }

    updateKPIs(data) {
        // Calculate KPIs
        const kpis = this.calculateKPIs(data);

        // Update KPI displays with animations
        this.animateValue('totalRevenue', kpis.totalRevenue, '₹');
        this.animateValue('occupancyRate', kpis.occupancyRate, '%');
        this.animateValue('avgRating', kpis.avgRating, '');
        this.animateValue('cancellationRate', kpis.cancellationRate, '%');
    }

    calculateKPIs(data) {
        const totalRevenue = data.reduce((sum, booking) => 
            sum + parseFloat(booking.revenue_realized), 0);

        const totalBookings = data.length;
        const successfulBookings = data.filter(booking => 
            booking.booking_status === 'Checked Out').length;
        const occupancyRate = (successfulBookings / totalBookings * 100) || 0;

        const ratings = data.filter(booking => booking.ratings_given);
        const avgRating = ratings.length ? 
            (ratings.reduce((sum, booking) => sum + parseFloat(booking.ratings_given), 0) / ratings.length) : 0;

        const cancelledBookings = data.filter(booking => 
            booking.booking_status === 'Cancelled').length;
        const cancellationRate = (cancelledBookings / totalBookings * 100) || 0;

        return {
            totalRevenue,
            occupancyRate,
            avgRating,
            cancellationRate
        };
    }

    animateValue(elementId, value, prefix = '') {
        const element = document.getElementById(elementId);
        const start = parseFloat(element.textContent.replace(/[^0-9.-]+/g, '')) || 0;
        const duration = 1000;
        const steps = 20;
        const increment = (value - start) / steps;
        let current = start;
        let step = 0;

        const animate = () => {
            current += increment;
            step++;
            
            if (step === steps) current = value;
            
            element.textContent = `${prefix}${current.toLocaleString(undefined, {
                minimumFractionDigits: value % 1 === 0 ? 0 : 1,
                maximumFractionDigits: 1
            })}`;

            if (step < steps) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateTrends() {
        if (!this.previousData) return;

        const current = this.calculateKPIs(this.currentData);
        const previous = this.calculateKPIs(this.previousData);

        // Update trend indicators
        Object.keys(current).forEach(metric => {
            const trend = ((current[metric] - previous[metric]) / previous[metric] * 100) || 0;
            this.updateTrendIndicator(metric, trend);
        });
    }

    updateTrendIndicator(metric, trend) {
        const element = document.querySelector(`#${metric}`).closest('.kpi-card')
            .querySelector('.trend-indicator');
        
        element.innerHTML = `
            <i class="fas fa-${trend > 0 ? 'arrow-up' : 'arrow-down'}"></i>
            ${Math.abs(trend).toFixed(1)}%
        `;
        element.className = `trend-indicator ${trend > 0 ? 'up' : 'down'}`;
    }

    setupTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            element.appendChild(tooltip);
        });
    }

    exportChart(chartId) {
        const canvas = document.getElementById(chartId);
        const link = document.createElement('a');
        link.download = `${chartId}-${new Date().toISOString()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    showDetailedMetricView(metric) {
        // Implementation for detailed metric view modal
        console.log(`Showing detailed view for ${metric}`);
        // Add your modal implementation here
    }

    toggleLoadingState(isLoading) {
        const dashboard = document.querySelector('.dashboard-container');
        if (isLoading) {
            dashboard.classList.add('loading');
        } else {
            dashboard.classList.remove('loading');
        }
    }

    updateLastUpdated() {
        const timestamp = new Date().toLocaleTimeString();
        // Add your last updated implementation here
    }

    handleError(message, error) {
        console.error(message, error);
        this.showErrorToast(message);
    }

    showErrorToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 100);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
    dashboard.initialize().catch(error => {
        console.error('Failed to initialize dashboard:', error);
    });
});