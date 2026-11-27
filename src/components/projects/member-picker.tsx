"use client";

import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/types";
import { getInitials } from "@/lib/utils";

export function MemberPicker({
  users,
  selectedIds,
  creatorId,
  onChange,
}: {
  users: User[];
  selectedIds: string[];
  creatorId: string;
  onChange: (memberIds: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const results = users.filter(
    (user) =>
      !selectedIds.includes(user.id) &&
      (!term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)),
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Members</span>
        <span className="text-[11px] text-muted-foreground">
          {selectedIds.length} selected
        </span>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          placeholder="Search people by name or email"
          className="h-8 pl-8 text-xs"
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-border p-1">
        {selectedIds.length === 0 ? (
          <p className="px-2 py-3 text-center text-xs text-muted-foreground">
            No members yet.
          </p>
        ) : (
          selectedIds.map((id) => {
            const user = users.find((item) => item.id === id);
            if (!user) return null;
            return (
              <div
                key={id}
                className="flex items-center gap-2 rounded-md px-1.5 py-1"
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-secondary text-[9px] font-medium text-secondary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{user.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                {id === creatorId ? (
                  <Badge variant="secondary">Creator</Badge>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${user.name}`}
                    onClick={() =>
                      onChange(
                        selectedIds.filter((memberId) => memberId !== id),
                      )
                    }
                  >
                    <X />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="space-y-1">
        {term && results.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            No people found.
          </p>
        )}
        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 rounded-md px-1.5 py-1"
          >
            <Avatar size="sm">
              <AvatarFallback className="bg-muted text-[9px] font-medium text-muted-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user.email}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Add ${user.name}`}
              onClick={() => onChange([...selectedIds, user.id])}
            >
              <Plus />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
