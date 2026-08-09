import { NextRequest, NextResponse } from 'next/server';
import { getPatients } from '@/lib/data';

type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

interface Appointment {
  id: string;
  patientId: string;
  date: string;
  type: string;
  status: AppointmentStatus;
  notes?: string | null;
}

const demoAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    patientId: 'patient-1',
    date: '2024-05-20T14:00:00.000Z',
    type: 'Consulta general',
    status: 'CONFIRMED',
    notes: 'Control mensual de hipertensión'
  },
  {
    id: 'appointment-2',
    patientId: 'patient-2',
    date: '2024-05-21T09:30:00.000Z',
    type: 'Neumología',
    status: 'PENDING',
    notes: 'Evaluar manejo de asma estacional'
  }
];

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function GET() {
  const patients = await getPatients();

  const data = demoAppointments.map(appointment => ({
    ...appointment,
    patient: patients.find(patient => patient.id === appointment.patientId) ?? null
  }));

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientId, date, time, type, notes, status } = body as {
      patientId?: string;
      date?: string;
      time?: string;
      type?: string;
      notes?: string;
      status?: AppointmentStatus;
    };

    if (!patientId || !date || !type) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos para registrar la cita' },
        { status: 400 }
      );
    }

    const isoDate = time ? `${date}T${time}:00` : `${date}T09:00:00`;

    const newAppointment: Appointment = {
      id: generateId('appointment'),
      patientId,
      date: new Date(isoDate).toISOString(),
      type,
      status: status ?? 'PENDING',
      notes: notes ?? null
    };

    demoAppointments.unshift(newAppointment);

    return NextResponse.json({ success: true, data: newAppointment }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'No fue posible registrar la cita';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
