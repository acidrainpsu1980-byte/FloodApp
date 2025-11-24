"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-4 bg-[var(--background)] flex items-center justify-center">
            <div className="w-full max-w-md animate-fade-in">
                <Card title="เข้าสู่ระบบสำหรับเจ้าหน้าที่">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="ชื่อผู้ใช้"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                        <Input
                            label="รหัสผ่าน"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
                            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
                        </Button>

                        <Button type="button" variant="ghost" fullWidth onClick={() => router.push("/")}>
                            กลับหน้าหลัก
                        </Button>
                    </form>
                </Card>
            </div>
        </main>
    );
}
