import { StreamChat } from 'stream-chat';

export const createStreamClient = () => {
  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);
  return client;
};

export const connectUser = async (client, user, token) => {
  try {
    await client.connectUser(user, token);
    return true;
  } catch (error) {
    console.error('Stream connection error:', error);
    return false;
  }
};

export const disconnectUser = async (client) => {
  try {
    await client.disconnectUser();
    return true;
  } catch (error) {
    console.error('Stream disconnect error:', error);
    return false;
  }
};

export const createChannel = async (client, channelType, channelId, channelData) => {
  try {
    const channel = client.channel(channelType, channelId, channelData);
    await channel.create();
    return channel;
  } catch (error) {
    console.error('Channel creation error:', error);
    return null;
  }
};