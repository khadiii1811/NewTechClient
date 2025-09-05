import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../service/authService";

export default function CustomerPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)',
      padding: 24 
    }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        padding: 20,
        marginBottom: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 32 }}>👤</div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: 24, 
              fontWeight: 800, 
              color: '#2d3748' 
            }}>
              Customer Dashboard
            </h1>
            <p style={{ 
              margin: 0, 
              color: '#718096', 
              fontSize: 14 
            }}>
              Welcome back, {user.username}!
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#c53030'}
          onMouseOut={(e) => e.target.style.background = '#e53e3e'}
        >
          🚪 Logout
        </button>
      </div>

      <div style={{ width: '100%', margin: '0 auto' }}>
        {/* User Info Card */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 32,
          marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            margin: 0, 
            marginBottom: 24, 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            ℹ️ Your Profile Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <div style={{ 
              background: '#f7fafc', 
              padding: 20, 
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: 14, 
                color: '#718096', 
                marginBottom: 8, 
                fontWeight: 600 
              }}>
                Username
              </div>
              <div style={{ 
                fontSize: 18, 
                color: '#2d3748', 
                fontWeight: 700 
              }}>
                {user.username}
              </div>
            </div>

            <div style={{ 
              background: '#f7fafc', 
              padding: 20, 
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: 14, 
                color: '#718096', 
                marginBottom: 8, 
                fontWeight: 600 
              }}>
                Role
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8 
              }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: '#dbeafe',
                  color: '#1e40af'
                }}>
                  {user.role}
                </span>
              </div>
            </div>

            <div style={{ 
              background: '#f7fafc', 
              padding: 20, 
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: 14, 
                color: '#718096', 
                marginBottom: 8, 
                fontWeight: 600 
              }}>
                User ID
              </div>
              <div style={{ 
                fontSize: 18, 
                color: '#2d3748', 
                fontWeight: 700 
              }}>
                {user.id}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
