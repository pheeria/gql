export const {
  APP_PORT,
  NODE_ENV,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} = process.env

export const IN_PROD = NODE_ENV === 'production'

export const CONNECTION_STRING = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
