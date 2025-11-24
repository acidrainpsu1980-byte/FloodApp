"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";

export default function RequestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        peopleCount: 1,
        needs: [] as string[],
        lat: undefined as number | undefined,
        lng: undefined as number | undefined,
    });

    const MapPicker = useMemo(() => dynamic(
        () => import('@/components/MapPicker'),
        {
            loading: () => <div style={{ height: "300px", width: "100%", backgroundColor: "#f1f5f9", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>กำลังโหลดแผนที่...</div>,
            ssr: false
        }
    ), []);

    const needsOptions = ["อาหารและน้ำดื่ม", "ยารักษาโรค", "อพยพ", "เสื้อผ้า", "อื่นๆ"];

    const handleNeedToggle = (need: string) => {
        setFormData(prev => ({
            ...prev,
            needs: prev.needs.includes(need)
                ? prev.needs.filter(n => n !== need)
                : [...prev.needs, need]
        }));
    };

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData(prev => ({
                    ...prev,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: prev.address || `พิกัด: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                }));
            }, (error) => {
                alert("ไม่สามารถระบุตำแหน่งได้ กรุณากรอกที่อยู่ด้วยตนเอง หรือเลือกจากแผนที่");
            });
        } else {
            alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            lat,
            lng,
            address: prev.address || `พิกัด: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    location: {
                        address: formData.address,
                        lat: formData.lat,
                        lng: formData.lng,
                    },
                    peopleCount: Number(formData.peopleCount),
                    needs: formData.needs,
                }),
            });

            if (res.ok) {
                alert("ส่งคำร้องขอความช่วยเหลือเรียบร้อยแล้ว! เจ้าหน้าที่กำลังดำเนินการ");
                router.push("/");
            } else {
                alert("ไม่สามารถส่งคำร้องได้ กรุณาลองใหม่อีกครั้ง");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-4 bg-[var(--background)] flex items-center justify-center">
            <div className="container max-w-lg animate-fade-in py-8">
                <Card title="แจ้งขอความช่วยเหลือ">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="ชื่อ-นามสกุล"
                            placeholder="ชื่อของคุณ"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="เบอร์โทรศัพท์"
                            placeholder="08x-xxx-xxxx"
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">สถานที่ / ที่อยู่</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="บ้านเลขที่, ซอย, หรือจุดสังเกต"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    className="flex-1"
                                />
                                <Button type="button" variant="outline" onClick={getLocation} title="ระบุตำแหน่งปัจจุบัน">
                                    📍
                                </Button>
                            </div>

                            <div className="mt-2">
                                <label className="text-xs text-[var(--text-secondary)] mb-1 block">หรือเลือกตำแหน่งจากแผนที่ (คลิกเพื่อปักหมุด)</label>
                                <MapPicker
                                    lat={formData.lat}
                                    lng={formData.lng}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>

                            {formData.lat && <span className="text-xs text-green-600">บันทึกพิกัดเรียบร้อยแล้ว: {formData.lat.toFixed(6)}, {formData.lng?.toFixed(6)}</span>}
                        </div>

                        <Input
                            label="จำนวนคน"
                            type="number"
                            min="1"
                            value={formData.peopleCount}
                            onChange={e => setFormData({ ...formData, peopleCount: Number(e.target.value) })}
                            required
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">สิ่งที่ต้องการความช่วยเหลือ</label>
                            <div className="flex flex-wrap gap-2">
                                {needsOptions.map(need => (
                                    <button
                                        key={need}
                                        type="button"
                                        onClick={() => handleNeedToggle(need)}
                                        className={`
                      px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                      ${formData.needs.includes(need)
                                                ? 'bg-[var(--secondary)] text-white border-[var(--secondary)]'
                                                : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--secondary)]'}
                    `}
                                    >
                                        {need}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" variant="secondary" fullWidth size="lg" disabled={loading} className="mt-4">
                            {loading ? "กำลังส่งข้อมูล..." : "ส่งคำร้องขอความช่วยเหลือ"}
                        </Button>

                        <Button type="button" variant="ghost" fullWidth onClick={() => router.back()}>
                            ยกเลิก
                        </Button>
                    </form>
                </Card>
            </div>
        </main>
    );
}
