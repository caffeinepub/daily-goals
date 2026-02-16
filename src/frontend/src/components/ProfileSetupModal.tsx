import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await saveProfile.mutateAsync({ name: name.trim() });
    }
  };

  return (
    <Dialog open={showProfileSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Welcome to Daily Goals!</DialogTitle>
          <DialogDescription>
            Let's get started by setting up your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

