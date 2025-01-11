import { TwitterClient } from '../twitterClient.js';
import { 
    HandlerResponse, 
    TwitterHandler,
    ListHandlerArgs,
    ListCreateArgs,
    ListMemberArgs,
    GetListMembersArgs 
} from '../types/handlers.js';
import { createResponse } from '../utils/response.js';

export const handleCreateList: TwitterHandler<ListCreateArgs> = async (
    client: TwitterClient,
    { name, description, isPrivate }: ListCreateArgs
): Promise<HandlerResponse> => {
    try {
        const list = await client.v2.createList({
            name,
            description,
            private: isPrivate
        });

        if (!list.data) {
            throw new Error('Failed to create list');
        }

        return createResponse(`Successfully created list: ${list.data.id}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create list: ${error.message}`);
        }
        throw error;
    }
};

export const handleAddUserToList: TwitterHandler<ListMemberArgs> = async (
    client: TwitterClient,
    { listId, username }: ListMemberArgs
): Promise<HandlerResponse> => {
    try {
        const user = await client.v2.userByUsername(username);
        if (!user.data) {
            throw new Error(`User not found: ${username}`);
        }

        await client.v2.addListMember(listId, user.data.id);
        return createResponse(`Successfully added user ${username} to list ${listId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to add user to list: ${error.message}`);
        }
        throw error;
    }
};

export const handleRemoveUserFromList: TwitterHandler<ListMemberArgs> = async (
    client: TwitterClient,
    { listId, username }: ListMemberArgs
): Promise<HandlerResponse> => {
    try {
        const user = await client.v2.userByUsername(username);
        if (!user.data) {
            throw new Error(`User not found: ${username}`);
        }

        await client.v2.removeListMember(listId, user.data.id);
        return createResponse(`Successfully removed user ${username} from list ${listId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to remove user from list: ${error.message}`);
        }
        throw error;
    }
};

export const handleGetListMembers: TwitterHandler<GetListMembersArgs> = async (
    client: TwitterClient,
    { listId, maxResults, userFields }: GetListMembersArgs
): Promise<HandlerResponse> => {
    try {
        const members = await client.v2.listMembers(listId, {
            max_results: maxResults,
            'user.fields': userFields?.join(',')
        });

        if (!members.data) {
            return createResponse(`No members found for list ${listId}`);
        }

        return createResponse(`List members: ${JSON.stringify(members.data, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get list members: ${error.message}`);
        }
        throw error;
    }
}; 