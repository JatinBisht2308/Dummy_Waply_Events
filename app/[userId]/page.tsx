import { redirect } from 'next/navigation';


interface Params {
  userId: string;
}

interface PinStatusResponse {
  isPinSet: boolean;
}

export default async function UserPage({ params }: { params: Params }) {
  const { userId } = params;

  try {
    // Fetch the PIN status from the backend API
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/check-pin-status/${userId}`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!res.ok) {
      // Handle error, e.g., user not found
      redirect('/error');
      return;
    }

    const data: PinStatusResponse = await res.json();
    const { isPinSet } = data;

    if (isPinSet) {
      // Redirect to the PIN entry page
      redirect(`/enter-pin/${userId}`);
    } else {
      // Redirect to the PIN setup page
      redirect(`/set-pin/${userId}`);
    }
  } catch (error) {
    console.error('Error fetching PIN status:', error);
    redirect('/error');
  }
}
