"use client";

import { useCallback, useEffect, useState } from "react";

import BottomNavigation from "@/components/navigation/BottomNavigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";

import { useFamily } from "@/providers/FamilyProvider";

import {
  acceptFamilyInvitation,
  cancelFamilyInvitation,
  CloudFamilyMember,
  createFamilyInvitation,
  declineFamilyInvitation,
  FamilyRole,
  getFamilyMembers,
  getReceivedFamilyInvitations,
  getSentFamilyInvitations,
  ReceivedFamilyInvitation,
  SentFamilyInvitation,
} from "@/services/cloud/family";

const roleLabels: Record<FamilyRole, string> = {
  owner: "Propriétaire",
  parent: "Parent",
  contributor: "Contributeur",
  viewer: "Lecture seule",
};

export default function FamilyPage() {
  const {
    cloudFamilyId,
    cloudLoading,
  } = useFamily();

  const [members, setMembers] = useState<
    CloudFamilyMember[]
  >([]);

  const [sentInvitations, setSentInvitations] =
    useState<SentFamilyInvitation[]>([]);

  const [
    receivedInvitations,
    setReceivedInvitations,
  ] = useState<ReceivedFamilyInvitation[]>([]);

  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<Exclude<FamilyRole, "owner">>("parent");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [busyInvitationId, setBusyInvitationId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const received =
        await getReceivedFamilyInvitations();

      setReceivedInvitations(received);

      if (!cloudFamilyId) {
        setMembers([]);
        setSentInvitations([]);
        return;
      }

      const [familyMembers, pendingInvitations] =
        await Promise.all([
          getFamilyMembers(cloudFamilyId),
          getSentFamilyInvitations(cloudFamilyId),
        ]);

      setMembers(familyMembers);
      setSentInvitations(pendingInvitations);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de charger la famille."
      );
    } finally {
      setLoading(false);
    }
  }, [cloudFamilyId]);

  useEffect(() => {
    if (cloudLoading) return;

    void loadData();
  }, [cloudLoading, loadData]);

  async function sendInvitation() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cloudFamilyId) {
      setErrorMessage(
        "Aucune famille cloud active."
      );
      return;
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage(
        "Veuillez saisir une adresse e-mail valide."
      );
      return;
    }

    setSending(true);
    setMessage("");
    setErrorMessage("");

    try {
      await createFamilyInvitation({
        familyId: cloudFamilyId,
        email: cleanEmail,
        role,
      });

      setEmail("");
      setRole("parent");

      setMessage(
        `Invitation créée pour ${cleanEmail}.`
      );

      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de créer l’invitation."
      );
    } finally {
      setSending(false);
    }
  }

  async function acceptInvitation(
    invitation: ReceivedFamilyInvitation
  ) {
    setBusyInvitationId(invitation.invitation_id);
    setMessage("");
    setErrorMessage("");

    try {
      const familyId =
        await acceptFamilyInvitation(
          invitation.invitation_id
        );

      /*
       * Cette famille devient la famille active.
       * Elle sera utilisée lors du prochain chargement.
       */
      window.localStorage.setItem(
        "legacy-active-family-id",
        familyId
      );

      window.location.href = "/dashboard";
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’accepter l’invitation."
      );

      setBusyInvitationId(null);
    }
  }

  async function declineInvitation(
    invitationId: string
  ) {
    const confirmed = window.confirm(
      "Refuser cette invitation familiale ?"
    );

    if (!confirmed) return;

    setBusyInvitationId(invitationId);
    setMessage("");
    setErrorMessage("");

    try {
      await declineFamilyInvitation(invitationId);

      setMessage("Invitation refusée.");
      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de refuser l’invitation."
      );
    } finally {
      setBusyInvitationId(null);
    }
  }

  async function cancelInvitation(
    invitationId: string
  ) {
    const confirmed = window.confirm(
      "Annuler cette invitation ?"
    );

    if (!confirmed) return;

    setBusyInvitationId(invitationId);
    setMessage("");
    setErrorMessage("");

    try {
      await cancelFamilyInvitation(invitationId);

      setMessage("Invitation annulée.");
      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’annuler l’invitation."
      );
    } finally {
      setBusyInvitationId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-56">
        <PageHeader
          title="Famille"
          subtitle="Partagez le livre de vie avec vos proches."
        />

        {errorMessage && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            {errorMessage}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-900"
          >
            {message}
          </div>
        )}

        {receivedInvitations.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold text-black">
              💌 Invitations reçues
            </h2>

            <div className="mt-5 space-y-5">
              {receivedInvitations.map(
                (invitation) => {
                  const busy =
                    busyInvitationId ===
                    invitation.invitation_id;

                  return (
                    <div
                      key={invitation.invitation_id}
                      className="rounded-2xl border border-gray-200 p-4"
                    >
                      <p className="font-semibold text-black">
                        {invitation.family_name}
                      </p>

                      <p className="mt-1 text-sm text-black">
                        Rôle proposé :{" "}
                        {
                          roleLabels[
                            invitation.invited_role
                          ]
                        }
                      </p>

                      <p className="mt-1 text-xs text-black">
                        Expire le{" "}
                        {new Date(
                          invitation.expires_at
                        ).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>

                      <div className="mt-4 space-y-2">
                        <Button
                          onClick={() =>
                            void acceptInvitation(
                              invitation
                            )
                          }
                          disabled={busy}
                        >
                          {busy
                            ? "Veuillez patienter..."
                            : "Accepter"}
                        </Button>

                        <Button
                          onClick={() =>
                            void declineInvitation(
                              invitation.invitation_id
                            )
                          }
                          disabled={busy}
                        >
                          Refuser
                        </Button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-bold text-black">
            👨‍👩‍👧 Membres
          </h2>

          {loading ? (
            <p className="mt-4 text-black">
              Chargement des membres…
            </p>
          ) : !cloudFamilyId ? (
            <p className="mt-4 text-black">
              Créez ou rejoignez une famille cloud pour
              afficher ses membres.
            </p>
          ) : members.length === 0 ? (
            <p className="mt-4 text-black">
              Aucun membre trouvé.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {members.map((member) => (
                <div
                  key={member.member_id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EDF5EC] text-2xl">
                    👤
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-black">
                      {member.display_name}
                    </p>

                    <p className="break-all text-sm text-black">
                      {member.email}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#5E7A5B]">
                      {roleLabels[member.member_role]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {cloudFamilyId && (
          <Card>
            <h2 className="text-xl font-bold text-black">
              ➕ Inviter un proche
            </h2>

            <p className="mt-2 text-black">
              La personne doit utiliser exactement cette
              adresse e-mail pour son compte Legacy.
            </p>

            <div className="mt-5 space-y-4">
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="adresse@email.com"
              />

              <div>
                <label
                  htmlFor="family-role"
                  className="mb-2 block font-semibold text-black"
                >
                  Rôle
                </label>

                <select
                  id="family-role"
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as Exclude<
                        FamilyRole,
                        "owner"
                      >
                    )
                  }
                  className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-black outline-none focus:border-[#7C9A7A]"
                >
                  <option value="parent">
                    Parent
                  </option>

                  <option value="contributor">
                    Contributeur
                  </option>

                  <option value="viewer">
                    Lecture seule
                  </option>
                </select>
              </div>

              <Button
                onClick={sendInvitation}
                disabled={sending}
              >
                {sending
                  ? "Envoi en cours..."
                  : "Créer l’invitation"}
              </Button>
            </div>
          </Card>
        )}

        {sentInvitations.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold text-black">
              ⏳ Invitations en attente
            </h2>

            <div className="mt-5 space-y-4">
              {sentInvitations.map((invitation) => {
                const busy =
                  busyInvitationId ===
                  invitation.invitation_id;

                return (
                  <div
                    key={invitation.invitation_id}
                    className="rounded-2xl border border-gray-200 p-4"
                  >
                    <p className="break-all font-semibold text-black">
                      {invitation.invited_email}
                    </p>

                    <p className="mt-1 text-sm text-black">
                      {
                        roleLabels[
                          invitation.invited_role
                        ]
                      }
                    </p>

                    <p className="mt-1 text-xs text-black">
                      Expire le{" "}
                      {new Date(
                        invitation.expires_at
                      ).toLocaleDateString("fr-FR")}
                    </p>

                    <div className="mt-4">
                      <Button
                        onClick={() =>
                          void cancelInvitation(
                            invitation.invitation_id
                          )
                        }
                        disabled={busy}
                      >
                        {busy
                          ? "Veuillez patienter..."
                          : "Annuler l’invitation"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}