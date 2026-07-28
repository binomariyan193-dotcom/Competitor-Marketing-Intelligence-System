import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_market_intel_2026';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Authorization header missing or malformed.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (isSupabaseConfigured) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired authentication token.'
        });
      }
      req.user = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Market Analyst',
        role: user.user_metadata?.role || 'analyst'
      };
      return next();
    }

    // JWT fallback verification for local environment
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        full_name: decoded.full_name || 'Market Analyst',
        role: decoded.role || 'analyst'
      };
      return next();
    } catch {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authentication token.'
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication error: ' + error.message
    });
  }
}
