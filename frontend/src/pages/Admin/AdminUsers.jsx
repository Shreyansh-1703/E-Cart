import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminService } from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggle = async (id) => {
    try {
      await adminService.toggleUser(id);
      setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
      toast.success('User status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-8 md:p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900">User Management</h1>
        <p className="text-slate-500 font-medium">Control user access and roles</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-20 bg-slate-50 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-6 pr-4">User</th>
                  <th className="pb-6 pr-4">Email</th>
                  <th className="pb-6 pr-4">Role</th>
                  <th className="pb-6 pr-4">Status</th>
                  <th className="pb-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 pr-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="py-6 pr-4 text-sm text-slate-500">{u.email}</td>
                    <td className="py-6 pr-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>{u.role}</span>
                    </td>
                    <td className="py-6 pr-4">
                      <button onClick={() => handleToggle(u.id)} className={`flex items-center gap-2 ${u.active ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {u.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                      </button>
                    </td>
                    <td className="py-6">
                       <button className="text-slate-300 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
