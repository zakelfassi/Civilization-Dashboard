# Civilization Dashboard

## Overview

Civilization Dashboard is an interactive web application that visualizes the prosperity and historical timelines of various civilizations. Built with React, TypeScript, and Vite, it leverages D3.js for dynamic data visualization, providing users with insightful and engaging representations of historical data. This project is part of a larger exploration into the nature of time and its cyclicality, aiming to uncover patterns and rhythms across different civilizations throughout history.

## Features

- **Interactive Visualization**: Explore the prosperity scores and timelines of different civilizations through dynamic charts.
- **Tooltips**: Get detailed information about each civilization by hovering over data points.
- **Responsive Design**: The dashboard adjusts seamlessly to different screen sizes and devices.
- **Filtering**: Easily toggle the visibility of civilizations to focus on specific data subsets.
- **Legend**: Understand the patterns and colors representing different calendar systems.

## Technologies Used

- **React**: Front-end library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for enhanced code quality.
- **Vite**: Fast build tool and development server.
- **D3.js**: Data-driven documents for dynamic and interactive visualizations.
- **Material-UI (MUI)**: React UI framework for styling and components.
- **ESLint**: Linting tool to maintain code quality.
- **Emotion**: Library for writing CSS styles with JavaScript.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/zakelfassi/civilization-dashboard.git
   cd civilization-dashboard
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Run the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   Or using Yarn:

   ```bash
   yarn dev
   ```

   The application will be available at `http://localhost:5173` (port may vary).

4. **Build for Production**

   Using npm:

   ```bash
   npm run build
   ```

   Or using Yarn:

   ```bash
   yarn build
   ```

   The production-ready files will be in the `dist` directory.

5. **Preview the Production Build**

   Using npm:

   ```bash
   npm run preview
   ```

   Or using Yarn:

   ```bash
   yarn preview
   ```

   Open `http://localhost:4173` to view the build.

## Project Structure

- **src/**: Contains the source code.
  - **components/**: Reusable React components like `CivilizationDashboard`, `CivilizationChart`, and `Tooltip`.
  - **utils/**: Utility functions such as `patternGenerator`.
  - **types/**: TypeScript interfaces defining data structures.
  - **assets/**: Static assets like images and SVGs.
  - **main.tsx**: Entry point for the React application.
- **public/**: Public assets accessible by the application, including the `vite.svg`.
- **styles/**: CSS files for styling components.
- **vite.config.ts**: Vite configuration file.
- **eslint.config.js**: ESLint configuration for maintaining code quality.
- **tsconfig.json**: TypeScript configuration with project references.

## Data

The application uses a `data.csv` file located in the `public` directory, containing historical data about various civilizations, including:

- **Civilization**: Name of the civilization.
- **Calendar System**: Type of calendar used.
- **Calendar Type**: Specific type of calendar (e.g., solar, lunar).
- **Start Date** and **End Date**: Timeframe of the civilization.
- **Historical Period**: The era during which the civilization thrived.
- **Prosperity Score**: Numerical score representing the prosperity.
- **Key Events**: Notable events within the civilization's timeline.

## Usage

Once the development server is running, navigate to `http://localhost:5173` in your web browser to explore the dashboard. You can interact with the chart by:

- **Hovering** over bubbles to view detailed information about a civilization.
- **Toggling** civilizations on and off using the buttons on the right sidebar.
- **Zooming** and **panning** to explore different time periods and prosperity scores.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make Your Changes**

4. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

5. **Push to the Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Open a Pull Request**

Please ensure your code follows the project's coding standards and includes appropriate tests.

## Future Improvements and Pull Request Suggestions

We welcome contributions that enhance the project's scope and depth. Some areas for improvement include:

1. **Adding More Data Points**: Expand the dataset to include a wider range of civilizations and historical periods.
2. **Extending Beyond Civilizations**: Adapt the visualization to represent other dimensions of human experience, such as:
   - Personal timelines
   - Tribal histories
   - Family genealogies
   - Friend group dynamics
3. **Enhanced Cyclicality Analysis**: Implement features that highlight patterns and cycles across different time scales.
4. **Interactive Time Comparisons**: Develop tools for users to compare different civilizations or time periods side-by-side.
5. **Integration with External Data Sources**: Connect the dashboard to reputable historical databases for real-time data updates.

These improvements will contribute to a more comprehensive exploration of time's cyclical nature across various human experiences and social structures.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **Author**: Zak El Fassi
- **GitHub**: [zakelfassi](https://github.com/zakelfassi)
- **Repository**: [civilization-dashboard](https://github.com/zakelfassi/civilization-dashboard)
# Civilization-Dashboard
