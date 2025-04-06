# Purple Currency Converter

## Tech Stack
- **Frontend**: Preact.js (3kB alternative to React with the same API)
- **Backend**: Node.js with Koa.js
- **Database**: MongoDB
- **Other**: Webpack, Vite

## Installation

### Prerequisites
- Node.js (v14 or higher recommended)
- PNPM (package manager)

### Setup

1. Clone the repo:

	```bash
		git clone git@github.com:adstrafe/purple-currency-converter.git
	```

2. Set up backend config:
	- In the `api/config/` folder, create a `development.json` file.
	- Fill in the values according to the `config.json.example` file, using the data provided in the email.

3. Install dependencies:
	- Go into the root directory of the project and run the following commands:
	```bash
		pnpm install
		pnpm installDep
		pnpm dev
	```

	- The API should run on the host and port provided in `development.json`.
	- The frontend should run on the default Vite values: `localhost:5173`.

	- **NOTE**: If you change the host or port in `development.json`, you need to change the endpoint inside `frontend/src/index.tsx` as well, as it is hardcoded there.