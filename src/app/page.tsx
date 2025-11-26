import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[var(--background)] to-blue-50">
      <div className="container max-w-2xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
            ระบบช่วยเหลือผู้ประสบภัยน้ำท่วมหาดใหญ่
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            เชื่อมต่อผู้ประสบภัยกับทีมกู้ภัยอย่างรวดเร็วและมีประสิทธิภาพ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-[var(--secondary)]">
            <div className="flex flex-col items-center text-center h-full justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--secondary)] mb-2">ฉันต้องการความช่วยเหลือ</h2>
                <p className="text-[var(--text-secondary)]">
                  หากคุณติดอยู่ในพื้นที่น้ำท่วมหรือต้องการเสบียง แจ้งขอความช่วยเหลือที่นี่
                </p>
              </div>
              <Link href="/request" className="w-full">
                <Button variant="secondary" fullWidth size="lg">
                  แจ้งขอความช่วยเหลือ
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-[var(--primary)]">
            <div className="flex flex-col items-center text-center h-full justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">สำหรับเจ้าหน้าที่กู้ภัย</h2>
                <p className="text-[var(--text-secondary)]">
                  ดูรายการคำร้องขอและจัดการภารกิจช่วยเหลือ
                </p>
              </div>
              <Link href="/dashboard" className="w-full">
                <Button variant="primary" fullWidth size="lg">
                  เข้าสู่แดชบอร์ด
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Link href="/evacuees" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold bg-white px-8 py-4 rounded-full shadow-md border border-blue-100 hover:shadow-lg transition-all transform hover:-translate-y-1">
            <span className="text-2xl">🏠</span> ตรวจสอบรายชื่อผู้อพยพ (ศูนย์พักพิง ม.อ.)
          </Link>
        </div>

        <footer className="mt-16 text-center text-[var(--text-secondary)] text-sm">
          <p>© 2025 ระบบช่วยเหลือผู้ประสบภัยน้ำท่วมหาดใหญ่. ด้วยความห่วงใย.</p>
        </footer>
      </div>
    </main>
  );
}
