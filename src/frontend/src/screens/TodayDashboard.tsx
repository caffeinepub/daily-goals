import { useState } from 'react';
import { useGoalsForDay, useToggleGoalCompletion } from '../hooks/useGoalQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

function getDayTimestamp(date: Date): bigint {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayStart = new Date(year, month, day, 0, 0, 0, 0);
  return BigInt(dayStart.getTime()) * BigInt(1_000_000);
}

export function TodayDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dayTimestamp = getDayTimestamp(selectedDate);
  
  const { data: goalsForDay, isLoading, error } = useGoalsForDay(dayTimestamp);
  const toggleCompletion = useToggleGoalCompletion();

  const handleToggle = async (goalId: bigint) => {
    await toggleCompletion.mutateAsync({ goalId, dayTimestamp });
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load goals. Please try again.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const activeGoals = goalsForDay?.filter(([goal]) => !goal.isArchived) || [];
  const completedCount = activeGoals.filter(([, completed]) => completed).length;

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {isToday ? 'Today' : format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                {activeGoals.length > 0
                  ? `${completedCount} of ${activeGoals.length} goals completed`
                  : 'No goals for this day'}
              </CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <img
                src="/assets/generated/empty-goals-illustration.dim_1200x800.png"
                alt="No goals"
                className="max-w-xs mx-auto opacity-80"
              />
              <div>
                <p className="text-muted-foreground mb-4">
                  You don't have any active goals yet.
                </p>
                <Button variant="default" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Goal
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map(([goal, completed]) => (
                <div
                  key={goal.id.toString()}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={`goal-${goal.id}`}
                    checked={completed}
                    onCheckedChange={() => handleToggle(goal.id)}
                    disabled={toggleCompletion.isPending}
                    className="mt-1"
                  />
                  <label
                    htmlFor={`goal-${goal.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className={completed ? 'line-through text-muted-foreground' : ''}>
                      <p className="font-medium">{goal.title}</p>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

