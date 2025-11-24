import fs from 'fs';
import path from 'path';

export interface RequestData {
    id: string;
    name: string;
    phone: string;
    location: {
        address: string;
        lat?: number;
        lng?: number;
    };
    peopleCount: number;
    needs: string[];
    status: 'pending' | 'in-progress' | 'completed';
    assignedUnit: 'Medical' | 'Water Rescue' | 'Supply' | 'General';
    priority: 'High' | 'Normal';
    timestamp: string;
    note?: string; // optional note field added by user
}

const DATA_FILE = path.join(process.cwd(), 'data.json');

export function getRequests(): RequestData[] {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export function convertToCSV(data: RequestData[]): string {
    const headers = [
        "ID",
        "ชื่อผู้แจ้ง",
        "เบอร์โทรศัพท์",
        "ที่อยู่",
        "ละติจูด",
        "ลองจิจูด",
        "จำนวนคน",
        "ความต้องการ",
        "สถานะ",
        "หน่วยงานที่รับผิดชอบ",
        "ความสำคัญ",
        "เวลาที่แจ้ง",
        "หมายเหตุ"
    ];

    const csvRows = data.map(item => {
        const lat = item.location.lat !== undefined ? item.location.lat.toString() : '';
        const lng = item.location.lng !== undefined ? item.location.lng.toString() : '';
        return [
            `"${item.id}"`,
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.phone}"`,
            `"${item.location.address.replace(/"/g, '""')}"`,
            `"${lat}"`,
            `"${lng}"`,
            item.peopleCount.toString(),
            `"${item.needs.join(", ")}"`,
            item.status === 'pending' ? 'รอช่วยเหลือ' : item.status === 'in-progress' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น',
            item.assignedUnit === 'Medical' ? 'ทีมแพทย์' :
                item.assignedUnit === 'Water Rescue' ? 'กู้ชีพทางน้ำ' :
                    item.assignedUnit === 'Supply' ? 'ทีมเสบียง' : 'ทีมทั่วไป',
            item.priority === 'High' ? 'สูง' : 'ปกติ',
            `"${item.timestamp}"`,
            item.note ? `"${item.note.replace(/"/g, '""')}"` : ""
        ].join(",");
    });

    return [headers.join(","), ...csvRows].join("\n");
}

export function saveRequest(request: Omit<RequestData, 'id' | 'timestamp' | 'status'>): RequestData {
    const requests = getRequests();
    const newRequest: RequestData = {
        ...request,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        status: 'pending',
    };

    requests.push(newRequest);
    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
    return newRequest;
}

export function updateRequestStatus(id: string, status: RequestData['status']): RequestData | null {
    const requests = getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return null;

    requests[index].status = status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
    return requests[index];
}
