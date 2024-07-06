# Corona Graph

A web application that visualizes COVID-19 statistics in Germany using a single interactive line chart. The application is built using SvelteKit for the frontend and Node.js with Redis for the backend. Docker is used to containerize the application for easy deployment.

## Features

- Fetches and visualizes COVID-19 statistics (infections, deaths, recoveries) from an API
- Data caching with Redis to reduce API calls and improve performance
- Interactive line chart for data visualization using Chart.js
- Responsive design with a simple and clean UI

## Libraries and Tools Used

- **Frontend**
  - [SvelteKit](https://kit.svelte.dev/)
  - [Chart.js](https://www.chartjs.org/)
  - [Bootstrap](https://getbootstrap.com/)
  - [FontAwesome](https://fontawesome.com/)
- **Backend**
  - [Node.js](https://nodejs.org/)
  - [Redis](https://redis.io/)
- **Containerization**
  - [Docker](https://www.docker.com/)

## API

This project uses the data from this [API](https://api.corona-zahlen.org/docs/) by Marlon Lückert to fetch COVID-19 statistics for Germany.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GlaubeKeinemDev/Corona-Graph-Website.git
   cd Corona-Graph-Website
   ```
2. **Build the repository:**

    ```bash
    docker compose build
    ```
   
3. **Run the application:**

    ```bash
    docker compose up -d
    ```
   
4. **Verify the installation:**
   - Open the frontend at: `http://localhost:5173`
   - Open the backend at: `http://localhost:3000`

    
5. **Security**

    Make sure to configure your firewall settings right. The backend shouldn't be accessible from outside of your network.