import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured, localDb } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_market_intel_2026';

export async function register(req, res) {
  try {
    const { email, password, full_name, company_name, role } = req.body;
    const userRole = role || 'Chief Intelligence Officer';

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, company_name, role: userRole }
        }
      });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      // Supabase returns an empty identities array if the user/email already exists
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email address already exists. Please sign in instead.'
        });
      }

      if (data.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          full_name,
          company_name: company_name || '',
          role: userRole
        }]);
      }

      if (!data.session) {
        return res.status(200).json({
          success: true,
          requiresConfirmation: true,
          message: 'Account registered successfully! Please check your email to verify your account before logging in.'
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          user: { id: data.user.id, email: data.user.email, full_name, company_name, role: userRole },
          token: data.session.access_token
        }
      });
    }

    // Local / Demo registration handler
    const existing = localDb.profiles.find(p => p.email && p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.'
      });
    }
    const newUser = {
      id: `u-${Date.now()}`,
      email,
      full_name,
      company_name: company_name || '',
      role: userRole
    };

    localDb.profiles.push({
      ...newUser,
      created_at: new Date().toISOString()
    });

    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      data: { user: newUser, token }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({ success: false, error: error.message });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const full_name = profile?.full_name || data.user.user_metadata?.full_name || 'Market Analyst';
      const company_name = profile?.company_name || data.user.user_metadata?.company_name || '';
      const role = profile?.role || data.user.user_metadata?.role || 'Chief Intelligence Officer';

      const token = data.session.access_token;

      return res.status(200).json({
        success: true,
        data: {
          user: { id: data.user.id, email: data.user.email, full_name, company_name, role },
          token
        }
      });
    }

    // Local environment login
    const existingProfile = localDb.profiles.find(p => p.email === email);
    const user = existingProfile ? {
      id: existingProfile.id,
      email: existingProfile.email || email,
      full_name: existingProfile.full_name,
      company_name: existingProfile.company_name || '',
      role: existingProfile.role || 'analyst'
    } : {
      id: `u-${Date.now()}`,
      email: email,
      full_name: email ? email.split('@')[0] : 'Market Analyst',
      company_name: 'Apex Strategy Inc',
      role: 'analyst'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function me(req, res) {
  return res.status(200).json({
    success: true,
    data: { user: req.user }
  });
}
