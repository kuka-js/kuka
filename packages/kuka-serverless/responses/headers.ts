const domain = process.env.FRONTEND_DOMAIN
  ? process.env.FRONTEND_DOMAIN
  : "http://localhost:5000"
export const headers = {
  "Access-Control-Allow-Origin": domain, // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
}
