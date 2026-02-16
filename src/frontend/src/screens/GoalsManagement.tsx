import { useState } from 'react';
import { useActiveGoals, useArchivedGoals, useCreateGoal, useArchiveGoal } from '../hooks/useGoalQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus, Archive, Target } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function GoalsManagement() {
  const { data: activeGoals, isLoading: activeLoading, error: activeError } = useActiveGoals();
  const { data: archivedGoals, isLoading: archivedLoading } = useArchivedGoals();
  const createGoal = useCreateGoal();
  const archiveGoal = useArchiveGoal();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim()) {
      await createGoal.mutateAsync({
        title: newGoalTitle.trim(),
        description: newGoalDescription.trim(),
      });
      setNewGoalTitle('');
      setNewGoalDescription('');
      setIsCreateOpen(false);
    }
  };

  const handleArchiveGoal = async (goalId: bigint) => {
    await archiveGoal.mutateAsync(goalId);
  };

  if (activeLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (activeError) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load goals. Please try again.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Active Goals</CardTitle>
              <CardDescription>
                Manage your daily goals and track your progress
              </CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateGoal}>
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                    <DialogDescription>
                      Add a new goal to track daily.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Exercise for 30 minutes"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Add more details about your goal..."
                        value={newGoalDescription}
                        onChange={(e) => setNewGoalDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!newGoalTitle.trim() || createGoal.isPending}>
                      {createGoal.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Goal'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!activeGoals || activeGoals.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Target className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div>
                <p className="text-muted-foreground mb-4">
                  You don't have any active goals yet.
                </p>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Goal
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id.toString()}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchiveGoal(goal.id)}
                    disabled={archiveGoal.isPending}
                    className="gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {archivedGoals && archivedGoals.length > 0 && (
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-xl">Archived Goals</CardTitle>
            <CardDescription>
              Goals you've completed or no longer tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {archivedGoals.map((goal) => (
                <div
                  key={goal.id.toString()}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex-1 opacity-60">
                    <h3 className="font-medium text-foreground">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

