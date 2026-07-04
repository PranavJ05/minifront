import { BACKEND_URL } from "@/lib/config";
import {
  AlumniPromotionCandidate,
  BatchAdminCreateRequest,
  BatchAdminSummary,
  BatchAdminUpdateRequest,
} from "@/lib/types/mainAdmin";

export async function getUsers(token: string, role?: string) {
  const url = role
    ? `${BACKEND_URL}/api/main-admin/users?role=${role}`
    : `${BACKEND_URL}/api/main-admin/users`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load users");
  }

  return res.json();
}
export async function getUserClubs(userId: number, token: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/main-admin/users/${userId}/clubs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
}
export async function assignClub(
  userId: number,

  clubId: number,

  token: string,
) {
  const res = await fetch(
    `${BACKEND_URL}/api/main-admin/users/${userId}/clubs`,

    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        clubId,
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Assignment failed");
  }
}
export async function removeClub(
  userClubId: number,

  token: string,
) {
  const res = await fetch(
    `${BACKEND_URL}/api/main-admin/users/clubs/${userClubId}`,

    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Remove failed");
  }
}
export async function getClubs(token: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/clubs`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed");
  }
  console.log(res);
  return res.json();
}
export async function getDashboardStats(token: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/main-admin/dashboard`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error();
  }

  return res.json();
}

function extractErrorMessage(defaultMessage: string, payload: unknown): string {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }

  return defaultMessage;
}

export async function listBatchAdmins(
  token: string,
): Promise<BatchAdminSummary[]> {
  const res = await fetch(`${BACKEND_URL}/api/admin/batch-admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(
      extractErrorMessage("Failed to load batch admins", payload),
    );
  }

  return res.json();
}

export async function getBatchAdminById(
  id: number,
  token: string,
): Promise<BatchAdminSummary> {
  const res = await fetch(`${BACKEND_URL}/api/admin/batch-admins/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(extractErrorMessage("Failed to load batch admin", payload));
  }

  return res.json();
}

export async function createBatchAdmin(
  request: BatchAdminCreateRequest,
  token: string,
): Promise<BatchAdminSummary> {
  const res = await fetch(`${BACKEND_URL}/api/admin/batch-admins`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(
      extractErrorMessage("Failed to create batch admin", payload),
    );
  }

  return res.json();
}

export async function updateBatchAdmin(
  id: number,
  request: BatchAdminUpdateRequest,
  token: string,
): Promise<BatchAdminSummary> {
  const res = await fetch(`${BACKEND_URL}/api/admin/batch-admins/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(
      extractErrorMessage("Failed to update batch admin", payload),
    );
  }

  return res.json();
}

export async function deleteBatchAdmin(
  id: number,
  token: string,
): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/admin/batch-admins/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(
      extractErrorMessage("Failed to delete batch admin", payload),
    );
  }

  const payload = await res.json().catch(() => null);
  return typeof payload === "string"
    ? payload
    : "Batch admin removed successfully";
}

export async function listAlumniForBatchAdminPicker(
  token: string,
): Promise<AlumniPromotionCandidate[]> {
  const res = await fetch(`${BACKEND_URL}/api/alumni/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(extractErrorMessage("Failed to load alumni list", payload));
  }

  const data = (await res.json()) as Array<Record<string, unknown>>;

  return data.map((item) => ({
    alumniId: Number(item.id),
    name: typeof item.name === "string" ? item.name : "Unknown",
    email: typeof item.email === "string" ? item.email : "",
    batchYear:
      typeof item.batchYear === "number"
        ? item.batchYear
        : typeof item.batchYear === "string"
          ? Number(item.batchYear)
          : null,
    department:
      typeof item.department === "string"
        ? item.department
        : typeof item.departmentName === "string"
          ? item.departmentName
          : null,
    profession:
      typeof item.profession === "string"
        ? item.profession
        : typeof item.currentRole === "string"
          ? item.currentRole
          : null,
  }));
}
