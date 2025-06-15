
import React, { useEffect, useState } from "react";
import { useBusinessTeam, Business, BusinessMember } from "@/hooks/useBusinessTeam";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BusinessTeamTab() {
  const {
    businesses,
    members,
    loading,
    fetchBusinesses,
    fetchTeam,
    createBusiness,
    inviteMember,
    updateMember,
    removeMember,
  } = useBusinessTeam();
  const { toast } = useToast();

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [newBizName, setNewBizName] = useState("");
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "staff">("staff");

  // On mount, fetch businesses
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // When selecting a business, fetch its members
  useEffect(() => {
    if (selectedBusiness) fetchTeam(selectedBusiness.id);
  }, [selectedBusiness, fetchTeam]);

  const handleCreateBusiness = async () => {
    if (!newBizName.trim()) return;
    const { error, data } = await createBusiness(newBizName.trim());
    if (error) {
      toast({ title: "Gagal membuat bisnis", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bisnis dibuat!", description: data?.name });
      setNewBizName("");
      fetchBusinesses();
    }
  };

  const handleInvite = async () => {
    if (!selectedBusiness || !inviteUserId) return;
    const { error } = await inviteMember(selectedBusiness.id, inviteUserId, inviteRole);
    if (error) {
      toast({ title: "Gagal mengundang anggota", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Undangan dikirim!", description: "Anggota diundang." });
      setInviteUserId("");
      fetchTeam(selectedBusiness.id);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bisnis Anda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama bisnis baru"
                value={newBizName}
                onChange={e => setNewBizName(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <Button onClick={handleCreateBusiness} disabled={loading || !newBizName.trim()}>
                Buat Bisnis
              </Button>
            </div>
            <div>
              {businesses.map(biz => (
                <Button
                  key={biz.id}
                  variant={selectedBusiness?.id === biz.id ? "default" : "outline"}
                  onClick={() => setSelectedBusiness(biz)}
                  className="my-1"
                >
                  {biz.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedBusiness && (
        <Card>
          <CardHeader>
            <CardTitle>Tim "{selectedBusiness.name}"</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder="Masukkan User ID"
                value={inviteUserId}
                onChange={e => setInviteUserId(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as "admin" | "staff")}
                className="border rounded px-2 py-1"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <Button onClick={handleInvite} disabled={loading || !inviteUserId}>
                Undang
              </Button>
            </div>
            <ul className="divide-y">
              {members.map((m: BusinessMember) => (
                <li key={m.id} className="py-2 flex items-center justify-between">
                  <span>
                    {m.user_profile?.full_name || m.user_id} ({m.role})
                    {m.status === "invited" && <span className="ml-2 text-xs text-yellow-600">(undangan)</span>}
                  </span>
                  {m.role !== "owner" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMember(selectedBusiness.id, m.id)}
                    >
                      Hapus
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
