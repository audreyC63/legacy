import { FunctionsHttpError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

export type FamilyRole =
  | "owner"
  | "parent"
  | "contributor"
  | "viewer";

export type CloudFamilyMember = {
  member_id: string;
  user_id: string;
  display_name: string;
  email: string;
  member_role: FamilyRole;
  joined_at: string;
};

export type SentFamilyInvitation = {
  invitation_id: string;
  invited_email: string;
  invited_role: FamilyRole;
  expires_at: string;
  created_at: string;
};

export type ReceivedFamilyInvitation = {
  invitation_id: string;
  family_id: string;
  family_name: string;
  invited_email: string;
  invited_role: FamilyRole;
  expires_at: string;
  created_at: string;
};

function throwIfError(error: unknown) {
  if (!error) return;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    throw new Error(String(error.message));
  }

  throw new Error(
    "Une erreur Supabase est survenue."
  );
}

async function getFunctionErrorMessage(
  error: unknown
) {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();

      if (
        body &&
        typeof body === "object" &&
        "error" in body
      ) {
        return String(body.error);
      }
    } catch {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "L’e-mail n’a pas pu être envoyé.";
}

export async function getFamilyMembers(
  familyId: string
): Promise<CloudFamilyMember[]> {
  const { data, error } = await supabase.rpc(
    "get_family_members",
    {
      target_family_id: familyId,
    }
  );

  throwIfError(error);

  return (data ?? []) as CloudFamilyMember[];
}

export async function getSentFamilyInvitations(
  familyId: string
): Promise<SentFamilyInvitation[]> {
  const { data, error } = await supabase.rpc(
    "get_sent_family_invitations",
    {
      target_family_id: familyId,
    }
  );

  throwIfError(error);

  return (data ?? []) as SentFamilyInvitation[];
}

export async function getReceivedFamilyInvitations(): Promise<
  ReceivedFamilyInvitation[]
> {
  const { data, error } = await supabase.rpc(
    "get_my_family_invitations"
  );

  throwIfError(error);

  return (data ??
    []) as ReceivedFamilyInvitation[];
}

export async function createFamilyInvitation(input: {
  familyId: string;
  email: string;
  role: Exclude<FamilyRole, "owner">;
}): Promise<string> {
  const cleanEmail = input.email
    .trim()
    .toLowerCase();

  const { data, error } = await supabase.rpc(
    "create_family_invitation",
    {
      target_family_id: input.familyId,
      target_email: cleanEmail,
      target_role: input.role,
    }
  );

  throwIfError(error);

  if (!data) {
    throw new Error(
      "L’invitation n’a pas pu être créée."
    );
  }

  const invitationId = String(data);

  const {
    data: emailResult,
    error: emailError,
  } = await supabase.functions.invoke(
    "send-family-invitation",
    {
      body: {
        invitationId,
      },
    }
  );

  if (emailError) {
    const detail =
      await getFunctionErrorMessage(emailError);

    throw new Error(
      `Invitation créée, mais e-mail non envoyé : ${detail}`
    );
  }

  if (emailResult?.error) {
    throw new Error(
      `Invitation créée, mais e-mail non envoyé : ${String(
        emailResult.error
      )}`
    );
  }

  return invitationId;
}

export async function acceptFamilyInvitation(
  invitationId: string
): Promise<string> {
  const { data, error } = await supabase.rpc(
    "accept_family_invitation",
    {
      target_invitation_id: invitationId,
    }
  );

  throwIfError(error);

  if (!data) {
    throw new Error(
      "L’invitation n’a pas pu être acceptée."
    );
  }

  return String(data);
}

export async function declineFamilyInvitation(
  invitationId: string
): Promise<void> {
  const { error } = await supabase.rpc(
    "decline_family_invitation",
    {
      target_invitation_id: invitationId,
    }
  );

  throwIfError(error);
}

export async function cancelFamilyInvitation(
  invitationId: string
): Promise<void> {
  const { error } = await supabase.rpc(
    "cancel_family_invitation",
    {
      target_invitation_id: invitationId,
    }
  );

  throwIfError(error);
}