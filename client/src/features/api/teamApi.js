import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;
const TEAM_API = `${BASE_URL}/api/v1/team/`;

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: TEAM_API,
    credentials: "include",
  }),
  tagTypes: ["team"],
  endpoints: (builder) => ({
    createTeam: builder.mutation({
      query: (teamData) => ({
        url: "create",
        method: "POST",
        body: teamData,
      }),
      invalidatesTags: ["team"],
    }),
    getMyTeams: builder.query({
      query: () => "my-teams",
      providesTags: ["team"],
    }),
    getPendingInvites: builder.query({
      query: () => "pending-invites",
      providesTags: ["team"],
    }),
    deleteTeam: builder.mutation({
      query: (teamId) => ({
        url: `delete/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["team"],
    }),
    updateTeamLogo: builder.mutation({
      query: ({ teamId, formData }) => ({
        url: `logo/${teamId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["team"],
    }),
    joinTeam: builder.mutation({
      query: ({ inviteCode }) => ({
        url: "join",
        method: "POST",
        body: { inviteCode },
      }),
      invalidatesTags: ["team"],
    }),
    updateTeam: builder.mutation({
      query: ({ teamId, teamName }) => ({
        url: `update/${teamId}`,
        method: "PUT",
        body: { teamName },
      }),
      invalidatesTags: ["team"],
    }),
    acceptJoinRequest: builder.mutation({
      query: ({ teamId, userId }) => ({
        url: "accept-request",
        method: "POST",
        body: { teamId, userId },
      }),
      invalidatesTags: ["team"],
    }),
    rejectJoinRequest: builder.mutation({
      query: ({ teamId, userId }) => ({
        url: "reject-request",
        method: "POST",
        body: { teamId, userId },
      }),
      invalidatesTags: ["team"],
    }),
    userAcceptInvite: builder.mutation({
      query: ({ teamId }) => ({
        url: "user-accept-invite",
        method: "POST",
        body: { teamId },
      }),
      invalidatesTags: ["team"],
    }),
    userRejectInvite: builder.mutation({
      query: ({ teamId }) => ({
        url: "user-reject-invite",
        method: "POST",
        body: { teamId },
      }),
      invalidatesTags: ["team"],
    }),
    removeTeamMember: builder.mutation({
      query: ({ teamId, userId }) => ({
        url: "remove-member",
        method: "POST",
        body: { teamId, userId },
      }),
      invalidatesTags: ["team"],
    }),
    inviteByGameId: builder.mutation({
      query: ({ teamId, gameId }) => ({
        url: "invite-by-gameid",
        method: "POST",
        body: { teamId, gameId },
      }),
      invalidatesTags: ["team"],
    }),
    leaveTeam: builder.mutation({
      query: ({ teamId }) => ({
        url: "leave",
        method: "POST",
        body: { teamId },
      }),
      invalidatesTags: ["team"],
    }),
    getTeamDetails: builder.query({
      query: (teamId) => `details/${teamId}`,
      providesTags: ["team"],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useGetMyTeamsQuery,
  useGetPendingInvitesQuery,
  useDeleteTeamMutation,
  useUpdateTeamLogoMutation,
  useJoinTeamMutation,
  useUpdateTeamMutation,
  useAcceptJoinRequestMutation,
  useRejectJoinRequestMutation,
  useUserAcceptInviteMutation,
  useUserRejectInviteMutation,
  useRemoveTeamMemberMutation,
  useInviteByGameIdMutation,
  useLeaveTeamMutation,
  useGetTeamDetailsQuery,
} = teamApi;
