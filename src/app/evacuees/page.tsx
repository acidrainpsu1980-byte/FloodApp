"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function EvacueesPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/evacuees?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.evacuees || []);
            setHasSearched(true);
        } catch (error) {
            console.error("Search error:", error);
            alert("เกิดข้อผิดพลาดในการค้นหา");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">ตรวจสอบรายชื่อผู้อพยพ</h1>
                    <p className="text-slate-600">ศูนย์พักพิงผู้ประสบภัย มหาวิทยาลัยสงขลานครินทร์ (ม.อ.)</p>
                </header>

                <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="พิมพ์ชื่อ หรือ นามสกุล เพื่อค้นหา..."
                            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-slate-400"
                        >
                            {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
                    {!hasSearched ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="text-lg">กรุณากรอกชื่อเพื่อค้นหา</p>
                            <p className="text-sm mt-2">ข้อมูลมีการอัปเดตอย่างต่อเนื่อง</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="text-lg text-red-500">ไม่พบข้อมูล "{query}"</p>
                            <p className="text-sm mt-2">โปรดตรวจสอบตัวสะกด หรือลองค้นหาด้วยคำอื่น</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-700">
                                    <tr>
                                        <th className="p-4 border-b">ชื่อ-สกุล</th>
                                        <th className="p-4 border-b">ศูนย์พักพิง</th>
                                        <th className="p-4 border-b">สถานะ</th>
                                        <th className="p-4 border-b">อัปเดตเมื่อ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((person) => (
                                        <tr key={person.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4 font-medium text-lg text-slate-800">
                                                {person.firstName} {person.lastName}
                                            </td>
                                            <td className="p-4 text-blue-600 font-medium">
                                                {person.shelter}
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    ปลอดภัย
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 text-sm">
                                                {person.timestamp}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </main>
    );
}
