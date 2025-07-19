# Todo API

## Prerequisites

- Node.js >= 20
- Yarn 1.x

## Setup Instructions

1. Create an `.env` file by copying the contents of `.env.example`:

   ```bash
   cp .env.example .env
   ```

2. Populate the `.env` file with the appropriate values for each environment variable as required for the project.


3. Install the necessary dependencies by running the following command:

   ```bash
   yarn install
   ```

4. Start the containers by running the following commands:

   ```bash
   docker-compose up -d
   ```

5. Launch the development server using the command:

   ```bash
   yarn start
   ```

   Alternatively, you can start [Run and Debug](https://code.visualstudio.com/docs/editor/debugging) in Visual Studio Code.

   Run in watch mode:

   ```bash
   yarn start:dev
   ```

   Run in production mode:

   ```bash
   yarn start:prod
   ```

## Run Tests

1. Unit tests:

   ```bash
   yarn test
   ```

2. E2E tests:

   ```bash
   yarn test:e2e
   ```

3. Test coverage:

   ```bash
   yarn test:cov
   ```

## Migrations

1. To run migrations, use the command:

   ```bash
   yarn migration:run
   ```

2. To revert a migration, execute:

   ```bash
   yarn migration:revert
   ```

3. To generate a migration file based on schema changes, use:

   ```bash
   yarn migration:generate ./src/database/migrations/{name}
   ```
