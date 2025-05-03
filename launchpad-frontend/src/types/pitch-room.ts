export type PitchRoom = {
  _id: string;
  roomName: string;
  founderId: string;
  investorIds: string[];
  startTime: string;
  endTime: string;
  pitchDeckUrl: string;
  chatMessages: ChatMessage[];
};

export type ChatMessage = {
  senderId: string;
  content: string;
  timestamp: string;
};
