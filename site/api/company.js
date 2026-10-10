import { companySnapshot } from '../src/data/company-readiness.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'PUBLIC_READ_ONLY_ENDPOINT' });
  }
  return res.status(200).json(companySnapshot());
}
