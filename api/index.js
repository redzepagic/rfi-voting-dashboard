// Vercel serverless function
import { createApp } from '../server/app.js';

let app;

export default async function handler(req, res) {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
}
