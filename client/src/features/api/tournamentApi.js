import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;
const TOURNAMENT_API = `${BASE_URL}/api/v1/admin-tournament/`;

export const tournamentApi = createApi({
  reducerPath: "tournamentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: TOURNAMENT_API,
    credentials: "include",
  }),
  tagTypes: ["tournament"],
  endpoints: (builder) => ({
    createTournament: builder.mutation({
      query: (data) => ({
        url: "create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tournament"],
    }),
    getTournaments: builder.query({
      query: () => "",
      providesTags: ["tournament"],
    }),
    getTournamentById: builder.query({
      query: (id) => id,
      providesTags: ["tournament"],
    }),
    editTournament: builder.mutation({
      query: ({ id, data }) => ({
        url: id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tournament"],
    }),
    deleteTournament: builder.mutation({
      query: (id) => ({
        url: id,
        method: "DELETE",
      }),
      invalidatesTags: ["tournament"],
    }),
    joinTournament: builder.mutation({
      query: ({ id, teamId }) => ({
        url: `join/${id}`,
        method: "POST",
        body: { teamId },
      }),
      invalidatesTags: ["tournament"],
    }),
  }),
});

export const {
  useCreateTournamentMutation,
  useGetTournamentsQuery,
  useGetTournamentByIdQuery,
  useEditTournamentMutation,
  useDeleteTournamentMutation,
  useJoinTournamentMutation,
} = tournamentApi;
