'use client';
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface PinStatusResponse {
  isPinSet: boolean;
}

export default function UserPage() {
  const router = useRouter();
  const params = useParams<{ urlId: string }>();
  const urlId = params.urlId;

  useEffect(() => {
    if (!urlId) {
      console.error("urlId is undefined. Redirecting to error page.");
      router.push("/error");
      return;
    }

    const fetchPinStatus = async () => {
      try {
        const response = await fetch(
          `http://dev.waply.co/api/v1/auth/check-pin-status/${urlId}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch PIN status. Redirecting to error page.");
          router.push("/error");
          return;
        }

        const data: PinStatusResponse = await response.json();
        console.log("Fetched PIN status:", data);

        if (data.isPinSet) {
          router.push(`/enter-pin/${urlId}`);
        } else {
          router.push(`/set-pin/${urlId}`);
        }
      } catch (error) {
        console.error("Error fetching PIN status:", error);
        router.push("/error");
      }
    };

    fetchPinStatus();
  }, [urlId, router]);

  return null; // Render nothing, as this component only redirects
}
