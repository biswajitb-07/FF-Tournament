import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const BASE_URL = import.meta.env.VITE_API_URL;
const USER_API = `${BASE_URL}/api/v1/user/`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    verifyOtp: builder.mutation({
      query: (inputData) => ({
        url: "verify-otp",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    resendOtp: builder.mutation({
      query: (inputData) => ({
        url: "resend-otp",
        method: "POST",
        body: inputData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.error(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
      providesTags: ["auth"],
    }),
    updateProfile: builder.mutation({
      query: (inputData) => ({
        url: "profile/update",
        method: "PUT",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: ["auth"],
    }),
    sendPasswordOtp: builder.mutation({
      query: () => ({
        url: "send-password-otp",
        method: "POST",
      }),
    }),
    setPassword: builder.mutation({
      query: (inputData) => ({
        url: "set-password",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["auth"],
    }),
    saveWithdrawalMethod: builder.mutation({
      query: (inputData) => ({
        url: "wallet/withdrawal-method",
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateProfileMutation,
  useSendPasswordOtpMutation,
  useSetPasswordMutation,
  useSaveWithdrawalMethodMutation
} = authApi;
