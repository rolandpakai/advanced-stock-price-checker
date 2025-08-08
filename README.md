# Advanced Stock Price Checker

## Objective
Create a simple stock price checker using Express.js, TypeScript, and any free Stock Market
API of your choice (e.g., Alpha Vantage, IEX Cloud, or Finnhub). The application should
periodically check the prices and calculate the moving average.

# Requirements

## Project Setup
● Set up a new Node.js project.  
● Install necessary dependencies: Express, TypeScript, axios (or any HTTP client), etc.  
● Set up tsconfig.json for TypeScript.  
● Create an Express/NestJS/Koa/TRPC application.  

## API Integration and Periodic Checks
● Integrate with the chosen Stock Market API to fetch real-time stock prices.  
● Set up a scheduled job (e.g., using node-cron) to fetch stock prices for a certain stock
symbol every minute.  
● Store the prices for a given symbol to be able to calculate the moving average. You may
store any other necessary information you want ;)  
● Use an RDBMS with Prisma/TypeORM/etc for managing DB schema and storing price data.  
● API Key for finnhub.io: ciqlqj9r01qjff7cr300ciqlqj9r01qjff7cr30g
Moving Average Calculation  
● Implement a function to calculate the moving average of the last 10 stock prices for a
given symbol.  

## Endpoints
● Create a GET route /stock/:symbol that retrieves and displays the current stock price, the
last updated time, and the moving average for the given symbol.  
● Create a PUT route /stock/:symbol that starts the periodic checks for a given symbol.
Criteria for Evaluation  
● Correctness of the API.  
● Code organization and quality.  
● Proper usage of TypeScript types and interfaces.  
● Proper handling and presentation of third-party API data.  
● Proper usage of the chosen ORM.  
● Implementation of the scheduled job and moving average calculation.  
● Error handling (Incorrect symbol, errors from the third-party API, etc.).  

## Bonus Points
● Create Swagger documentation.  
● Dockerize your application.  