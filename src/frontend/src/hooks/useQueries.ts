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

export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
}

export function useUploadSalonImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      salonName,
      imageId,
      imageBytes,
      contentType
    }: {
      salonName: string;
      imageId: string;
      imageBytes: Uint8Array;
      contentType: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadSalonImage(salonName, imageId, imageBytes, contentType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salons'] });
      queryClient.invalidateQueries({ queryKey: ['salonImage', variables.imageId] });
    }
  });
}

export function useGetSalonImage(imageId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<[Uint8Array, string] | null>({
    queryKey: ['salonImage', imageId],
    queryFn: async () => {
      if (!actor || !imageId) return null;
      return actor.getSalonImage(imageId);
    },
    enabled: !!actor && !isFetching && !!imageId,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
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
