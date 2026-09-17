import z from 'zod'
import { safeUserSchema } from './auth.types.js'
import { ChatSchema, type Chat, FriendRequestSchema, type FriendRequest, MessageSchema } from './chat.types.js';


export const PostLoginResponseSchema = z.object({
    user: safeUserSchema
})

export type PostLoginResponse = z.infer<typeof PostLoginResponseSchema>

export const PostSignupResponseSchema = z.object({
    user: safeUserSchema
})

export type PostSignupResponse = z.infer<typeof PostSignupResponseSchema>

export const PostGuestLoginResponseSchema = z.object({
    user: safeUserSchema
})

export type PostGuestLoginResponse = z.infer<typeof PostGuestLoginResponseSchema>

export const GetCheckResponseSchema = z.object({
    user: safeUserSchema.nullable()
})

export type GetCheckResponse = z.infer<typeof GetCheckResponseSchema>

export const PutUpdateProfileResponseSchema = z.object({
    user: safeUserSchema.nullable()
})

export type PutUpdateProfileResponse = z.infer<typeof PutUpdateProfileResponseSchema>

export const getSignUploadSignutureResponseSchema = z.object({
    signature: z.string(),
    timestamp: z.number(),
    cloudname: z.string(),
    apikey: z.string()
})
export type GetSignUploadSignutureResponse = z.infer<typeof getSignUploadSignutureResponseSchema>


export const GetUserFriendsResponseSchema = z.object({
    friends: z.array(safeUserSchema)
})

export type GetUserFriendsResponse = z.infer<typeof GetUserFriendsResponseSchema>


export const GetUserChatsResponseSchema = z.object({
    chats: z.array(ChatSchema)
})

export type GetUserChatsResponse = z.infer<typeof GetUserChatsResponseSchema>

export const GetUserFriendsRequestsToResponseSchema = z.object({
    requestsTo: z.array(FriendRequestSchema)
})

export type GetUserFriendsRequestsToResponse = z.infer<typeof GetUserFriendsRequestsToResponseSchema>

export const GetUserFriendsRequestsByResponseSchema = z.object({
    requestsBy: z.array(FriendRequestSchema)
})

export type GetUserFriendsRequestsByResponse = z.infer<typeof GetUserFriendsRequestsByResponseSchema>


export const CreateFriendRequestResponseSchema = z.object({
    request: FriendRequestSchema
})

export type CreateFriendRequestResponse = z.infer<typeof CreateFriendRequestResponseSchema>

export const AcceptFriendRequestResponseSchema = z.object({
    sender: safeUserSchema,
    chat: ChatSchema
})

export type AcceptFriendRequestResponse = z.infer<typeof AcceptFriendRequestResponseSchema>

export const CreateNewMessageResponseSchema = z.object({
    message: MessageSchema,
    chat: ChatSchema
})

export type CreateNewMessageResponse = z.infer<typeof CreateNewMessageResponseSchema>

export const GetAllUsersResponseSchema = z.object({
    users: z.array(safeUserSchema)
})

export type GetAllUsersResponse = z.infer<typeof GetAllUsersResponseSchema>

export const GetChatMessagesResponseSchema = z.object({
    messages: z.array(MessageSchema),
    nextCursor: z.string().nullable()
})

export type GetChatMessagesResponse = z.infer<typeof GetChatMessagesResponseSchema>

export const MarkMessageAsReadResponseSchema = z.object({
    message: MessageSchema
})

export type MarkMessageAsReadResponse = z.infer<typeof MarkMessageAsReadResponseSchema>