import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../service/authService";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      console.log('Already authenticated user:', user);
      
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields according to LoginDto requirements
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (form.username.length < 3 || form.username.length > 50) {
      setError("Username must be between 3 and 50 characters");
      return;
    }

    if (form.password.length < 6 || form.password.length > 255) {
      setError("Password must be between 6 and 255 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('Sending login request:', { 
        username: form.username, 
        password: '***', 
        url: 'http://localhost:5070/api/auth/login' 
      });
      
      const result = await authService.login(form.username, form.password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        const user = result.user;
        
        // Show success message briefly before redirect
        console.log('Login successful:', {
          user: user,
          token: result.token ? 'received' : 'missing',
          expires: result.expires
        });
        
        // Debug: Show what we're checking for role
        console.log('Role check:', {
          'user.roleName': user?.roleName,
          'user.role': user?.role,
          'typeof roleName': typeof user?.roleName
        });
        
        // Redirect based on role - prioritize user object from server response
        const userRole = user?.roleName || user?.role;
        
        if (userRole === 'admin') {
          console.log('Redirecting to /admin');
          navigate('/admin');
        } else if (userRole === 'customer') {
          console.log('Redirecting to /customer');
          navigate('/customer');
        } else {
          // Fallback: try to get role from current user after token is set
          console.log('Fallback: checking JWT token role');
          const currentUser = authService.getCurrentUser();
          console.log('JWT decoded user:', currentUser);
          
          if (currentUser?.role === 'admin') {
            console.log('JWT says admin, redirecting to /admin');
            navigate('/admin');
          } else {
            console.log('JWT says customer or unknown, redirecting to /customer');
            navigate('/customer');
          }
        }
      } else {
        console.error('Login failed:', result);
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      setError(`Login failed: ${error.response?.data?.message || error.response?.data || error.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 20
    }}>
             <div style={{ 
         background: '#fff', 
         borderRadius: 24, 
         boxShadow: '0 20px 60px rgba(0,0,0,0.1)', 
         padding: 48,
         width: '100%',
         minWidth: 400,
          maxWidth: 480,
       }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h1 style={{ 
            fontWeight: 800, 
            fontSize: 32, 
            color: '#2d3748', 
            margin: 0, 
            marginBottom: 8 
          }}>
            Login form
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{ 
              background: '#fed7d7', 
              color: '#c53030', 
              padding: 12, 
              borderRadius: 8, 
              fontSize: 14,
              textAlign: 'center',
              border: '1px solid #feb2b2'
            }}>
              {error}
            </div>
          )}

                     <div>
             <input
               name="username"
               type="text"
               placeholder="Username"
               value={form.username}
               onChange={handleChange}
               disabled={loading}
               required
               minLength={3}
               maxLength={50}
               style={{ 
                 width: '100%',
                 padding: 16, 
                 borderRadius: 12, 
                 border: '2px solid #e2e8f0', 
                 fontSize: 16, 
                 outline: 'none', 
                 transition: 'all 0.2s',
                 background: loading ? '#f7fafc' : '#fff',
                 boxSizing: 'border-box'
               }}
               onFocus={(e) => e.target.style.borderColor = '#667eea'}
               onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
             />
           </div>

           <div>
             <input
               name="password"
               type="password"
               placeholder="Password"
               value={form.password}
               onChange={handleChange}
               disabled={loading}
               required
               minLength={6}
               maxLength={255}
               style={{ 
                 width: '100%',
                 padding: 16, 
                 borderRadius: 12, 
                 border: '2px solid #e2e8f0', 
                 fontSize: 16, 
                 outline: 'none', 
                 transition: 'all 0.2s',
                 background: loading ? '#f7fafc' : '#fff',
                 boxSizing: 'border-box'
               }}
               onFocus={(e) => e.target.style.borderColor = '#667eea'}
               onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
             />
           </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 12, 
              padding: '16px 24px', 
              fontWeight: 700, 
              fontSize: 16, 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              transform: loading ? 'none' : 'translateY(0)',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16,
                  height: 16,
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Signing in...
              </>
            ) : (
              <>
                🚀 Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 24, 
          color: '#718096', 
          fontSize: 14 
        }}>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
