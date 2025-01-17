# Hotel Analytics Dashboard

A dynamic and responsive web dashboard for analyzing hotel performance metrics, bookings, and revenue data. This application provides interactive visualizations and insights for hotel management and stakeholders.

![image](https://github.com/user-attachments/assets/57a7023a-5ac1-4be9-8344-57782fbedc92)
![image](https://github.com/user-attachments/assets/4f356fd2-1c58-4c1b-9057-5dfde8f45716)
![image](https://github.com/user-attachments/assets/bc03a5f2-6ed1-4d89-8731-c1eb482ba014)

## 📊 Features

- **Real-time Filtering**: Filter data by:
  - City
  - Property
  - Booking Platform
  - Time Period

- **Key Performance Indicators (KPIs)**:
  - Total Revenue
  - Occupancy Rate
  - Average Rating
  - Cancellation Rate

- **Interactive Visualizations**:
  - Revenue Trends Over Time
  - Room Type Occupancy Rates
  - Booking Platform Distribution
  - Rating Distribution

- **Responsive Design**:
  - Mobile-friendly interface
  - Adaptive layouts
  - Touch-friendly controls

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Local web server (due to CSV file loading requirements)
- Basic understanding of HTML, CSS, and JavaScript

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hotel-analytics.git
cd hotel-analytics
```

2. Ensure your data files are in the correct location:
```
public/data/
├── dim_date.csv
├── dim_hotels.csv
├── dim_rooms.csv
├── fact_aggregated_bookings.csv
└── fact_bookings.csv
```

3. Start a local server. You can use any of these methods:
   - Python 3: `python -m http.server`
   - Python 2: `python -m SimpleHTTPServer`
   - Node.js: `npx serve`
   - VS Code: Use the "Live Server" extension

4. Open your browser and navigate to the local server address (typically `http://localhost:8000`)

## 📁 Project Structure

```
hotel-analytics/
├── public/
│   ├── index.html
│   └── data/
│       ├── dim_date.csv
│       ├── dim_hotels.csv
│       ├── dim_rooms.csv
│       ├── fact_aggregated_bookings.csv
│       └── fact_bookings.csv
├── src/
│   ├── css/
│   │   ├── style.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── main.js
│   │   ├── filters.js
│   │   ├── charts.js
│   │   └── dataLoader.js
│   ├── components/
│   │   ├── filterPanel.js
│   │   ├── metricsCard.js
│   │   ├── revenueChart.js
│   │   ├── occupancyChart.js
│   │   ├── bookingTrendsChart.js
│   │   └── ratingDistributionChart.js
├── assets/
│   ├── images/
│   └── icons/
└── package.json
```

## 🔧 Configuration

The application uses several external libraries and resources:

- **Charts**: Chart.js
- **Data Processing**: D3.js
- **Icons**: Boxicons
- **Styling**: Bootstrap 5

## 📊 Data Structure

The dashboard works with five CSV files:

1. **dim_date.csv**: Date dimension table
   - date
   - mmm yy
   - week no
   - day_type

2. **dim_hotels.csv**: Hotel properties information
   - property_id
   - property_name
   - category
   - city

3. **dim_rooms.csv**: Room types and classifications
   - room_id
   - room_class

4. **fact_aggregated_bookings.csv**: Aggregated booking data
   - property_id
   - check_in_date
   - room_category
   - successful_bookings
   - capacity

5. **fact_bookings.csv**: Detailed booking information
   - booking_id
   - property_id
   - booking_date
   - check_in_date
   - check_out_date
   - no_guests
   - room_category
   - booking_platform
   - ratings_given
   - booking_status
   - revenue_generated
   - revenue_realized

## 🖥️ Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🔍 Metrics Calculation

The dashboard calculates several key metrics:

- **Revenue**: 
  - Total revenue generated
  - Revenue realized after cancellations
  - Revenue trends over time

- **Occupancy**: 
  - Overall occupancy rate
  - Room-type specific occupancy
  - Peak occupancy periods

- **Ratings**: 
  - Average customer ratings
  - Rating distribution
  - Property-wise rating comparison

- **Booking Patterns**: 
  - Platform-wise bookings
  - Cancellation rates
  - Booking lead times

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 👤 Authors

- Aman Kumar - *Initial work* - [YourGitHub](https://github.com/aman-24052001)

## 🙏 Acknowledgments

- Chart.js team for the visualization library
- D3.js team for data processing capabilities
- Bootstrap team for the CSS framework
- Boxicons for the icon set

---
Made with ❤️ for the hospitality industry application
