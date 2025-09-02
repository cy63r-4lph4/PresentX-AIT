import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import qs from 'qs';
import type { Event, UseEventsProps } from '@/components/Interfaces';
import { useAuth } from '@/auth/AuthContex';

export const useEvents = ({ Streams }: UseEventsProps) => {
  return useQuery<Event[]>({
    queryKey: ['events', Streams],
    queryFn: async () => {
      const { data } = await axios.get('/events', {
        params: { streams: JSON.stringify(Streams) },
      });
      return data;
    },
  });
};

export const useHall = ({ campuses }: { campuses: number[] }) => {
  return useQuery({
    queryKey: ['halls', campuses],
    queryFn: async () => {
      const { data } = await axios.get('/halls', {
        params: { campus_ids: campuses },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    },
    enabled: campuses.length > 0,
  });
};

export const useCampuses = () => {
  return useQuery({
    queryKey: ['campuses'],
    queryFn: async () => {
      const { data } = await axios.get('/campuses');
      return data;
    },
  });
};

export const useMyEvents = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['myEvents', user?.id],
    queryFn: async () => {
      const { data } = await axios.get('/myevents', {
        params: { lecturer_id: user?.lecturer_id },
      });
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await axios.get('/courses');
      return data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: Event) => {
      const { data } = await axios.post('/events', newEvent);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      const { id, ...rest } = event;
      const { data } = await axios.put(`/events/${id}`, rest);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: number) => {
      const { data } = await axios.delete(`/events/${eventId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useGetEventToken = (eventId: number) => {
  return useQuery({
    queryKey: ['event-token', eventId],
    queryFn: async () => {
      const { data } = await axios.get(`/token`, {
        params: { event_id: eventId },
      });
      return data;
    },
    enabled: !!eventId,
  });
};

export const useGenerateEventToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      expiresIn,
      auto_expiry = false,
    }: {
      eventId: number;
      expiresIn: number;
      auto_expiry?: boolean;
    }) => {
      const { data } = await axios.post(`/token/${eventId}`, {
        expires_in: expiresIn,
        auto_expiry,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-token', variables.eventId] });
    },
  });
};

export const useExtendEventToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      additionalMinutes,
    }: {
      eventId: number;
      additionalMinutes: number;
    }) => {
      const { data } = await axios.post('/token/extend', {
        event_id: eventId,
        additional_minutes: additionalMinutes,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-token', variables.eventId] });
    },
  });
};

export const useCurtailEventToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      reduceByMinutes,
    }: {
      eventId: number;
      reduceByMinutes: number;
    }) => {
      const { data } = await axios.post('/token/curtail', {
        event_id: eventId,
        reduce_by_minutes: reduceByMinutes,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-token', variables.eventId] });
    },
  });
};

export const useInvalidateEventToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId }: { eventId: number }) => {
      const { data } = await axios.post('/token/invalidate', {
        event_id: eventId,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-token', variables.eventId] });
    },
  });
};
