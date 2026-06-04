'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Download, Check, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, Badge, Input } from '@/components/ui';
import { api } from '@/lib/api';
import type { GoLoginProfileInfo } from '@/lib/types';

interface ImportProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface ImportForm {
  profileId: string;
  profileName: string;
  username: string;
  password: string;
}

export function ImportProfilesModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportProfilesModalProps) {
  if (!isOpen) return null;

  return (
    <ImportProfilesModalContent
      onClose={onClose}
      onImportSuccess={onImportSuccess}
    />
  );
}

interface ImportProfilesModalContentProps {
  onClose: () => void;
  onImportSuccess: () => void;
}

function ImportProfilesModalContent({
  onClose,
  onImportSuccess,
}: ImportProfilesModalContentProps) {
  const [profiles, setProfiles] = useState<GoLoginProfileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importForm, setImportForm] = useState<ImportForm | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.accounts.listGoLoginProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    void fetchProfiles();
  }, [fetchProfiles]);

  const handleSelectProfile = (profile: GoLoginProfileInfo) => {
    setImportForm({
      profileId: profile.id,
      profileName: profile.name,
      username: '',
      password: '',
    });
    setImportError(null);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importForm) return;

    setImporting(true);
    setImportError(null);

    try {
      await api.accounts.create({
        username: importForm.username,
        password: importForm.password,
        gologinProfileId: importForm.profileId,
      });
      onImportSuccess();
      onClose();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setImporting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const availableProfiles = profiles.filter((p) => !p.isLinked);
  const linkedProfiles = profiles.filter((p) => p.isLinked);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Import from GoLogin
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select a GoLogin profile to link with a new account
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && importForm && (
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleImport} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {importForm.profileName}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {importForm.profileId}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setImportForm(null)}
                    >
                      Change
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Reddit Username
                    </label>
                    <Input
                      type="text"
                      value={importForm.username}
                      onChange={(e) =>
                        setImportForm({ ...importForm, username: e.target.value })
                      }
                      placeholder="Enter Reddit username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Reddit Password
                    </label>
                    <Input
                      type="password"
                      value={importForm.password}
                      onChange={(e) =>
                        setImportForm({ ...importForm, password: e.target.value })
                      }
                      placeholder="Enter Reddit password"
                      required
                    />
                  </div>

                  {importError && (
                    <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm">
                      {importError}
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setImportForm(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={importing}>
                      <Download className="mr-2 h-4 w-4" />
                      Import Account
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {!loading && !error && !importForm && (
            <div className="space-y-6">
              {availableProfiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Available Profiles ({availableProfiles.length})
                  </h3>
                  <div className="space-y-2">
                    {availableProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground truncate">
                              {profile.name}
                            </span>
                          </div>
                          {profile.notes && (
                            <p className="text-sm text-muted-foreground truncate mt-0.5">
                              {profile.notes}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Created {new Date(profile.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSelectProfile(profile)}
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {linkedProfiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Already Linked ({linkedProfiles.length})
                  </h3>
                  <div className="space-y-2 opacity-60">
                    {linkedProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground truncate">
                              {profile.name}
                            </span>
                            <Badge variant="success">
                              <Check className="h-3 w-3 mr-1" />
                              Linked
                            </Badge>
                          </div>
                          {profile.notes && (
                            <p className="text-sm text-muted-foreground truncate mt-0.5">
                              {profile.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profiles.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Download className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No GoLogin profiles found</p>
                  <p className="text-sm mt-1">
                    Create profiles in GoLogin first, then import them here
                  </p>
                </div>
              )}

              {profiles.length > 0 && availableProfiles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Check className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p>All profiles are already linked to accounts</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-between items-center">
          <Button variant="ghost" onClick={fetchProfiles} disabled={loading}>
            Refresh
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
