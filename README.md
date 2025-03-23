# Decision Matrix Application

A modern web application for creating and managing decision matrices. This tool helps you make objective decisions by evaluating multiple options against predefined criteria with weighted importance.

## Features

- Create and manage decision matrices with custom names and descriptions
- Add, edit, and remove criteria with weighted importance
- Add, edit, and remove options
- Score options against criteria using a 1-5 scale
- Real-time calculation of weighted scores
- Automatic identification of the best option
- Responsive design that works on all devices
- Modern, clean user interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd decision-matrix
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Create a New Decision Matrix**
   - Enter a name and optional description for your decision matrix
   - This helps identify the purpose of your decision-making process

2. **Add Criteria**
   - Click "Add New Criterion" to define factors that are important for your decision
   - For each criterion:
     - Enter a name
     - Assign a weight (percentage)
     - Add an optional description
   - Ensure the total weight of all criteria equals 100%

3. **Add Options**
   - Click "Add New Option" to add choices you want to evaluate
   - For each option:
     - Enter a name
     - Add an optional description
     - Rate the option against each criterion using the 1-5 scale

4. **View Results**
   - The application automatically calculates weighted scores for each option
   - The best option is highlighted based on the highest total score
   - A detailed breakdown of all scores is provided

## Technical Details

This application is built using:

- React with TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS for styling
- Headless UI and Heroicons for UI components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
