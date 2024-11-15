import { redirect } from 'next/navigation';

interface Params {
  userId: string;
}

interface PinStatusResponse {
  isPinSet: boolean;
}

export default async function UserPage({ params }: { params: Promise<Params> }) {
  const { userId } = await params;  // Awaiting params if it's a Promise

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/check-pin-status/${userId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/error');
      return;
    }

    const data: PinStatusResponse = await res.json();
    const { isPinSet } = data;

    if (isPinSet) {
      redirect(`/enter-pin/${userId}`);
    } else {
      redirect(`/set-pin/${userId}`);
    }
  } catch (error) {
    console.error('Error fetching PIN status:', error);
    redirect('/error');
  }
}
