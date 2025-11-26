"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function AdminEvacueesPage() {
    const [evacuees, setEvacuees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const fetchEvacuees = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/evacuees?q=${search}`);
            if (res.ok) {
                const data = await res.json();
                setEvacuees(data.evacuees || []);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(fetchEvacuees, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = async (id: string, district: string) => {
        if (!confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) return;

        try {
            const res = await fetch('/api/evacuees', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, partitionKey: district })
            });

            if (res.ok) {
                alert("ลบข้อมูลสำเร็จ");
                fetchEvacuees();
            } else {
                alert("ลบข้อมูลไม่สำเร็จ");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const res = await fetch('/api/evacuees', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingItem.id,
                    partitionKey: editingItem.district, // Assuming district is PK
                    firstName: editingItem.firstName,
                    lastName: editingItem.lastName,
                    shelter: editingItem.shelter,
                    status: editingItem.status,
                    note: editingItem.note
                })
            });

            if (res.ok) {
                alert("อัปเดตข้อมูลสำเร็จ");
                setEditingItem(null);
                fetchEvacuees();
            } else {
                alert("อัปเดตข้อมูลไม่สำเร็จ");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            📋 จัดการข้อมูลผู้อพยพ
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">แก้ไขหรือลบข้อมูลผู้อพยพ</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/evacuees/import">
                            <Button variant="outline" size="sm">📥 Import ข้อมูล</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">⬅️ กลับ Dashboard</Button>
                        </Link>
                    </div>
                </header>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <input
                        type="text"
                        placeholder="🔍 ค้นหาชื่อ หรือ นามสกุล..."
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-700 font-bold">
                                <tr>
                                    <th className="p-4">ชื่อ-สกุล</th>
                                    <th className="p-4">ศูนย์พักพิง</th>
                                    <th className="p-4">อำเภอ</th>
                                    <th className="p-4">สถานะ</th>
                                    <th className="p-4 text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">กำลังโหลด...</td></tr>
                                ) : evacuees.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">ไม่พบข้อมูล</td></tr>
                                ) : (
                                    evacuees.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4 font-medium">{item.firstName} {item.lastName}</td>
                                            <td className="p-4 text-blue-600">{item.shelter}</td>
                                            <td className="p-4">{item.district}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'safe' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {item.status === 'safe' ? 'ปลอดภัย' : item.status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button
                                                    onClick={() => setEditingItem(item)}
                                                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 transition-colors"
                                                >
                                                    ✏️ แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.district)}
                                                    className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                                                >
                                                    🗑️ ลบ
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

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-fade-in">
                        <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูล</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={editingItem.firstName}
                                        onChange={e => setEditingItem({ ...editingItem, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">นามสกุล</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={editingItem.lastName}
                                        onChange={e => setEditingItem({ ...editingItem, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ศูนย์พักพิง</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={editingItem.shelter}
                                    onChange={e => setEditingItem({ ...editingItem, shelter: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">สถานะ</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={editingItem.status}
                                    onChange={e => setEditingItem({ ...editingItem, status: e.target.value })}
                                >
                                    <option value="safe">ปลอดภัย</option>
                                    <option value="missing">สูญหาย</option>
                                    <option value="injured">บาดเจ็บ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">หมายเหตุ</label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={editingItem.note || ''}
                                    onChange={e => setEditingItem({ ...editingItem, note: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    บันทึกการแก้ไข
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
