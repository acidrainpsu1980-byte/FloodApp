"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ImportEvacueesPage() {
    const [inputData, setInputData] = useState("");
    const [previewData, setPreviewData] = useState<any[]>([]);

    const handlePreview = () => {
        // Simple CSV/TSV parser for demo
        const lines = inputData.trim().split('\n');
        const headers = lines[0].split(/\t|,/); // Split by tab or comma

        const data = lines.slice(1).map(line => {
            const values = line.split(/\t|,/);
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = values[index]?.trim();
            });
            return obj;
        });

        setPreviewData(data);
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            📥 นำเข้าข้อมูลผู้อพยพ (Google Sheets)
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Copy ข้อมูลจาก Google Sheets แล้ววางลงในช่องด้านล่าง</p>
                    </div>
                    <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">
                        ⬅️ กลับ Dashboard
                    </Link>
                </header>

                <div className="grid lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                            <h2 className="font-bold mb-2">1. วางข้อมูล (CSV/TSV)</h2>
                            <textarea
                                value={inputData}
                                onChange={(e) => setInputData(e.target.value)}
                                placeholder="ชื่อ, นามสกุล, อายุ, เพศ, ..."
                                className="flex-1 w-full p-3 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none min-h-[300px]"
                            />
                            <button
                                onClick={handlePreview}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                            >
                                ตรวจสอบข้อมูล
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold">2. ตัวอย่างข้อมูล ({previewData.length} รายการ)</h2>
                                {previewData.length > 0 && (
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm">
                                        บันทึกข้อมูล
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-auto border rounded-lg bg-slate-50">
                                {previewData.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-400">
                                        ยังไม่มีข้อมูล
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-slate-700 font-medium">
                                            <tr>
                                                {Object.keys(previewData[0]).map((key) => (
                                                    <th key={key} className="p-3 border-b">{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, i) => (
                                                <tr key={i} className="border-b hover:bg-slate-50">
                                                    {Object.values(row).map((val: any, j) => (
                                                        <td key={j} className="p-3">{val}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
