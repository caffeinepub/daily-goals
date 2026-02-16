import { useState } from 'react';
import { useGoalsForDay } from '../hooks/useGoalQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

function getDayTimestamp(date: Date): bigint {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayStart = new Date(year, month, day, 0, 0, 0, 0);
  return BigInt(dayStart.getTime()) * BigInt(1_000_000);
}

export function HistoryView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dayTimestamp = getDayTimestamp(selectedDate);
  
  const { data: goalsForDay, isLoading, error } = useGoalsForDay(dayTimestamp);

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
          <CardDescription>Failed to load history. Please try again.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const allGoals = goalsForDay || [];
  const completedCount = allGoals.filter(([, completed]) => completed).length;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>
            Choose a date to view your goal completion history
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle>{format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
          <CardDescription>
            {allGoals.length > 0
              ? `${completedCount} of ${allGoals.length} goals completed`
              : 'No goals recorded for this day'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allGoals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No goals were tracked on this date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allGoals.map(([goal, completed]) => (
                <div
                  key={goal.id.toString()}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                    {goal.isArchived && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        (Archived)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

