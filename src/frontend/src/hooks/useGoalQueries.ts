import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Goal, GoalId, Time } from '../backend';

export function useActiveGoals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Goal[]>({
    queryKey: ['goals', 'active'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveGoals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useArchivedGoals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Goal[]>({
    queryKey: ['goals', 'archived'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArchivedGoals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGoalsForDay(dayTimestamp: Time) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[Goal, boolean][]>({
    queryKey: ['goals', 'day', dayTimestamp.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGoalsForDay(dayTimestamp);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createGoal(title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useArchiveGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: GoalId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.archiveGoal(goalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useToggleGoalCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, dayTimestamp }: { goalId: GoalId; dayTimestamp: Time }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.toggleGoalCompletion(goalId, dayTimestamp);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals', 'day', variables.dayTimestamp.toString()] });
    },
  });
}

