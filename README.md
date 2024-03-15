# Logs and Metrics Application

This application allows users to fetch and view system logs and metrics through a web interface. It consists of two main screens: Logs and Metrics. Users can toggle between these screens using the Navbar. The project is built using React.js and leverages React Router for navigation and Chart.js for rendering metrics charts.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js installed on your local machine

### Installation

 Install dependencies: npm install

### Running the Application

The application will be accessible at `http://localhost:3000`.

### Development Flow

The project follows a typical React development flow:

1. **Components**: Components are organized in the `src/components` directory. Each screen (Logs and Metrics) has its own component.

2. **Routing**: React Router (v6) is used for navigation. Routes are defined in the `App.js` file.

3. **API Integration**: Mock APIs for Logs and Metrics are provided in the `src/api` directory. These APIs mimic the behavior of real APIs for fetching logs and metrics data.

4. **Styling**: Tailwind CSS (v3) is used for styling components. Tailwind utility classes are applied directly within the components.

5. **State Management**: Component state and URL parameters are used for managing filters and states of Logs and Metrics screens.

6. **Charts**: Chart.js (v3) is used to render metrics charts. Chart data is fetched from the Metrics API and displayed in the Metrics screen.

7. **Infinite Scroll and Pagination**: Logs screen implements infinite scroll for fetching previous logs as the user scrolls up. Pagination logic is handled within the Logs component.


### Deployment

Working Link: https://frontend-assignment-mocha-xi.vercel.app/

