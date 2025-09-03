import React, { useState, useEffect } from "react";
import customerApi from"../service/customerService";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getCustomers();
      setCustomers(data);
    } catch (error) {
      setCustomers([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    try {
      if (isEditing) {
        await customerApi.updateCustomer(form.id, form);
      } else {
        await customerApi.addCustomer(form);
      }
      setForm({ id: null, name: "", email: "", phone: "" });
      setIsEditing(false);
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
  
    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await customerApi.deleteCustomer(id);
      if (isEditing && form.id === id) {
        setIsEditing(false);
        setForm({ id: null, name: "", email: "", phone: "" });
      }
      fetchCustomers();
    } catch (error) {
      // handle error
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({ id: null, name: "", email: "", phone: "" });
    setShowModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%)', padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(60,60,120,0.13)', padding: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 38, color: '#2563eb' }}>👥</span>
            <h2 style={{ fontWeight: 800, fontSize: 36, color: '#222', letterSpacing: 1, margin: 0 }}>Customer Management</h2>
          </div>
          <button
            onClick={() => { setShowModal(true); setForm({ id: null, name: "", email: "", phone: "" }); setIsEditing(false); }}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px #e0e7ef', transition: 'background 0.2s' }}
          >
            <span style={{ fontSize: 20 }}>➕</span> Add
          </button>
        </div>
        {/* Modal Popup */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(60,60,120,0.18)', padding: 36, minWidth: 340, maxWidth: '90vw', width: 400, position: 'relative' }}>
              <h3 style={{ margin: 0, marginBottom: 24, fontWeight: 700, fontSize: 24, color: '#2563eb', textAlign: 'center' }}>{isEditing ? 'Edit Customer' : 'Add Customer'}</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{ padding: 12, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 4px #e0e7ef' }}
                  autoFocus
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  style={{ padding: 12, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 4px #e0e7ef' }}
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  style={{ padding: 12, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 4px #e0e7ef' }}
                />
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
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5, borderTopLeftRadius: 12 }}>Name</th>
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>Email</th>
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>Phone</th>
                <th style={{ padding: 16, fontWeight: 800, fontSize: 18, letterSpacing: 0.5, borderTopRightRadius: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 28, color: '#6b7280', fontSize: 19 }}>No customers found.</td>
                </tr>
              ) : (
                customers.map((c, idx) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#f3f6fa', transition: 'background 0.2s', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.background = '#e0e7ef'}
                    onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f3f6fa'}
                  >
                    <td style={{ padding: 16, fontSize: 17, color: '#222', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: 16, fontSize: 17, color: '#222', fontWeight: 500 }}>{c.email}</td>
                    <td style={{ padding: 16, fontSize: 17, color: '#222', fontWeight: 500 }}>{c.phone}</td>
                    <td style={{ padding: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(c)} style={{ background: '#f59e42', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px #f3f6fa', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#fbbf24'}
                        onMouseOut={e => e.currentTarget.style.background = '#f59e42'}
                      >
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px #f3f6fa', transition: 'background 0.2s' }}
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
