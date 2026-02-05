import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Salon, Service } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useGetSalons() {
  const { actor, isFetching } = useActor();

  return useQuery<Salon[]>({
    queryKey: ['salons'],
    queryFn: async () => {
      if (!actor) return [];
      // Ensure salons are seeded before fetching
      await actor.ensureSalonsSeeded();
      return actor.getSalons();
    },
    enabled: !!actor && !isFetching
  });
}

export function useCreateSalon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      neighborhood,
      description,
      photoUrls,
      services,
      isPremium
    }: {
      name: string;
      neighborhood: string;
      description: string;
      photoUrls: string[];
      services: Service[];
      isPremium: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSalon(name, neighborhood, description, photoUrls, services, isPremium);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salons'] });
    }
  });
}

export function useBookSalon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      salonName,
      time,
      date,
      serviceName
    }: {
      salonName: string;
      time: number;
      date: string;
      serviceName: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookSalon(salonName, BigInt(time), date, serviceName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salons'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}
