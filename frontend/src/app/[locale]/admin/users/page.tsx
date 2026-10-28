'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLocale } from 'next-intl';
import { 
  Users, 
  Trash2, 
  Mail, 
  Phone,
  Tag,
  Loader2,
  Search
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'vendor' | 'admin';
  phone?: string;
  vendor_profile?: {
    business_name: string;
    category: string;
  };
}

export default function AdminUsers() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?role=${roleFilter}`);
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-8 text-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">
            {isRtl ? 'إدارة المستخدمين' : 'Gestion des Utilisateurs'}
          </h1>
          <p className="text-gray-400 mt-1">
            {isRtl ? 'عرض وإدارة جميع حسابات المنصة.' : 'Gérez tous les comptes de la plateforme.'}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">{isRtl ? 'جميع الأدوار' : 'Tous les rôles'}</option>
            <option value="client">{isRtl ? 'عميل' : 'Client'}</option>
            <option value="vendor">{isRtl ? 'مزود خدمة' : 'Prestataire'}</option>
            <option value="admin">{isRtl ? 'مسؤول' : 'Admin'}</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-700/50 text-gray-400 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">{isRtl ? 'المستخدم' : 'Utilisateur'}</th>
                  <th className="px-6 py-4">{isRtl ? 'الدور' : 'Rôle'}</th>
                  <th className="px-6 py-4">{isRtl ? 'التفاصيل' : 'Détails'}</th>
                  <th className="px-6 py-4 text-right">{isRtl ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-primary font-bold">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-bold uppercase
                        ${user.role === 'admin' ? 'bg-red-900/40 text-red-400' : 
                          user.role === 'vendor' ? 'bg-primary/20 text-primary' : 
                          'bg-blue-900/40 text-blue-400'}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm text-gray-400">
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        {user.vendor_profile && (
                          <div className="flex items-center gap-2">
                            <Tag size={14} />
                            <span>{user.vendor_profile.business_name}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
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
}
