import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../service/userService";
import authService from "../service/authService";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, username: "", password: "", roleName: "customer" });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userApi.getUsers();
      setUsers(data);
    } catch (error) {
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    try {
      if (isEditing) {
        // For update, only send non-empty fields
        const updateData = {};
        if (form.username) updateData.username = form.username;
        if (form.password) updateData.password = form.password;
        if (form.roleName) updateData.roleName = form.roleName;
        await userApi.updateUser(form.id, updateData);
      } else {
        await userApi.addUser(form);
      }
      setForm({ id: null, username: "", password: "", roleName: "customer" });
      setIsEditing(false);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
  
    }
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: "" }); // Don't pre-fill password for security
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await userApi.deleteUser(id);
      if (isEditing && form.id === id) {
        setIsEditing(false);
        setForm({ id: null, username: "", password: "", roleName: "customer" });
      }
      fetchUsers();
    } catch (error) {
      // handle error
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({ id: null, username: "", password: "", roleName: "customer" });
    setShowModal(false);
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%)', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(60,60,120,0.13)', padding: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 38, color: '#2563eb' }}>👥</span>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 36, color: '#222', letterSpacing: 1, margin: 0 }}>User Management</h2>
              <p style={{ margin: 0, color: '#718096', fontSize: 14 }}>
                Admin Dashboard - Welcome, {authService.getCurrentUser()?.username}!
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={() => { setShowModal(true); setForm({ id: null, username: "", password: "", roleName: "customer" }); setIsEditing(false); }}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px #e0e7ef', transition: 'background 0.2s' }}
            >
              <span style={{ fontSize: 20 }}>➕</span> Add User
            </button>
            <button
              onClick={handleLogout}
              style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px #e0e7ef', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#c53030'}
              onMouseOut={(e) => e.target.style.background = '#e53e3e'}
            >
              🚪 Logout
            </button>
          </div>
        </div>
        {/* Modal Popup */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(60,60,120,0.18)', padding: 36, minWidth: 340, maxWidth: '90vw', width: 400, position: 'relative' }}>
              <h3 style={{ margin: 0, marginBottom: 24, fontWeight: 700, fontSize: 24, color: '#2563eb', textAlign: 'center' }}>{isEditing ? 'Edit User' : 'Add User'}</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <input
                  name="username"
                  placeholder="Username (3-50 characters)"
                  value={form.username}
                  onChange={handleChange}
                  required={!isEditing}
                  minLength={3}
                  maxLength={50}
                  style={{ padding: 12, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 4px #e0e7ef' }}
                  autoFocus
                />
                <input
                  name="password"
                  placeholder={isEditing ? "Password (leave empty to keep current)" : "Password (6-255 characters)"}
                  value={form.password}
                  onChange={handleChange}
                  required={!isEditing}
                  minLength={6}
                  maxLength={255}
                  type="password"
                  style={{ padding: 12, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 4px #e0e7ef' }}
                />
                <select
                  name="roleName"
                  value={form.roleName}
                  onChange={handleChange}
                  required
                  style={{ padding: 12, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 4px #e0e7ef', background: '#fff' }}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                  <button type="submit" style={{ background: isEditing ? '#f59e42' : '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isEditing ? <span>✏️ Update</span> : <span>➕ Add</span>}
                  </button>
                  <button type="button" onClick={handleCancel} style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    ❌ Cancel
                  </button>
                </div>
              </form>
              <button onClick={handleCancel} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} title="Close">×</button>
            </div>
          </div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#f9fafb', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(60,60,120,0.06)' }}>
            <thead style={{ background: '#2563eb', color: '#fff' }}>
              <tr>
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5, borderTopLeftRadius: 12 }}>Username</th>
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>Role</th>
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>Created At</th>
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5, borderTopRightRadius: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 28, color: '#6b7280', fontSize: 19 }}>No users found.</td>
                </tr>
              ) : (
                users.map((u, idx) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#f3f6fa', transition: 'background 0.2s', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.background = '#e0e7ef'}
                    onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f3f6fa'}
                  >
                    <td style={{ padding: 16, fontSize: 17, color: '#222', fontWeight: 500 }}>{u.username}</td>
                    <td style={{ padding: 16, fontSize: 17, color: '#222', fontWeight: 500 }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        background: u.roleName === 'admin' ? '#fef3c7' : '#dbeafe',
                        color: u.roleName === 'admin' ? '#92400e' : '#1e40af'
                      }}>
                        {u.roleName}
                      </span>
                    </td>
                    <td style={{ padding: 16, fontSize: 17, color: '#222', fontWeight: 500 }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(u)} style={{ background: '#f59e42', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px #f3f6fa', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#fbbf24'}
                        onMouseOut={e => e.currentTarget.style.background = '#f59e42'}
                      >
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(u.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px #f3f6fa', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#dc2626'}
                        onMouseOut={e => e.currentTarget.style.background = '#ef4444'}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
