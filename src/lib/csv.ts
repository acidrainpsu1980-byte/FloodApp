import { RequestData } from "./storage";

export function convertToCSV(data: RequestData[]): string {
    // CSV Header
    const headers = [
        "ID",
        "วันที่แจ้ง",
        "เวลา",
        "ชื่อผู้แจ้ง",
        "เบอร์โทรศัพท์",
        "ที่อยู่",
        "พิกัด (Lat)",
        "พิกัด (Lng)",
        "จำนวนคน",
        "สิ่งที่ต้องการ",
        "สถานะ",
        "ทีมที่รับผิดชอบ",
        "ความสำคัญ"
    ];

    // CSV Rows
    const rows = data.map(item => {
        const date = new Date(item.timestamp);
        return [
            item.id,
            date.toLocaleDateString('th-TH'),
            date.toLocaleTimeString('th-TH'),
            `"${item.name.replace(/"/g, '""')}"`, // Escape quotes
            `"${item.phone}"`, // Force string for phone numbers
            `"${item.location.address.replace(/"/g, '""')}"`,
            item.location.lat || "",
            item.location.lng || "",
            item.peopleCount,
            `"${item.needs.join(", ")}"`,
            item.status === 'pending' ? 'รอช่วยเหลือ' : item.status === 'in-progress' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น',
            item.assignedUnit === 'Medical' ? 'ทีมแพทย์' :
                item.assignedUnit === 'Water Rescue' ? 'กู้ชีพทางน้ำ' :
                    item.assignedUnit === 'Supply' ? 'ทีมเสบียง' : 'ทีมทั่วไป',
            item.priority === 'High' ? 'สูง' : 'ปกติ'
        ].join(",");
    });

    // Combine with BOM for Excel UTF-8 support
    return "\uFEFF" + [headers.join(","), ...rows].join("\n");
}
