import React from 'react';
import Link from 'next/link';

export default function EvacueesPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">ตรวจสอบรายชื่อผู้อพยพ</h1>
                    <p className="text-slate-600">ศูนย์พักพิงผู้ประสบภัย มหาวิทยาลัยสงขลานครินทร์ (ม.อ.)</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="ค้นหาด้วยชื่อ หรือ นามสกุล..."
                            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                            ค้นหา
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 text-center text-slate-500">
                        <p className="text-lg">กรุณากรอกชื่อเพื่อค้นหา</p>
                        <p className="text-sm mt-2">ข้อมูลมีการอัปเดตอย่างต่อเนื่อง</p>
                    </div>
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
