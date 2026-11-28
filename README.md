# TaskVIDIA frontend

- Frontend at `http://localhost:3000`
- Backend API at `http://localhost:3001`
- Swagger docs at `http://localhost:3001/docs`

## 1. What you need first

Install:

- node js 24 or higher
- pnpm

Also start the backend first by following the backend readme file. 

## 2. Install frontend packages

-In terminal change dir to the frontend repo, then:

pnpm i

- make the env file similar to .env.example

## 4. Start the frontend

pnpm run dev

and open:

http://localhost:3000

## 5. Log in

The backend Docker seed creates four demo users. All of them use the same password:

Password123!

Use any of these emails:

maya@studio.co
noah@studio.co
olivia@studio.co
ethan@studio.co

## 6. File management and code abstraction:

- Api calls made directly from server are in /app/api whereas api calls made from the client side first navigates to /api then gets called from the server.
- I made it like this so that no sensitive info like session cookies are exposed to client side.
- All the client side api calls are in the service file for cleaner, abstracted and readable code
- Also i have made 2 api wrappers each for server and client side. Both are in /lib 
--> api-client.ts: has the client side api wrapper which takes in path and headers and also returns proper response
--> api-server.ts: similar to the client version but also attaches bearer token and calls the nest js server directly 

This way there is no repeated boilerplate code in each api call and you can just pass path and necessary headers when calling api instead of having to construct the whole api call again. 