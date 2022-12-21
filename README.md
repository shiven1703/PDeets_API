
# Pdeets app poc API
The repository contains code for the backend API of planspiel poc app.

## Commands
- npm run start-dev
- npm run start
- npm run lint
- npm run lint-fix

## Docker
- docker build . -t pdeets_poc_api:latest
- docker run -p 4000:4000  pdeets_poc_api

## Documentation url
- /api-docs

## Environment
- Node.js 18.x
- Express
- Eslint

## Development Notes
- Always run "npm run lint" && "npm run lint-fix" commands before pushing the commit. This is to mainly maintain overall code style in the project.