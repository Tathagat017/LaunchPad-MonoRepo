export type FundingRound = {
  _id: string;
  roundName: string;
  amount: number;
  equity: number;
  createdAt: string;
  offers: InvestorOffer[];
  status: "active" | "finalized";
};

export type InvestorOffer = {
  _id: string;
  investorName: string;
  offerAmount: number;
  requestedEquity: number;
  message?: string;
  status: "pending" | "accepted" | "rejected";
};

export type SimulatedCapTableData = {
  founderEquityBefore: number;
  founderEquityAfter: number;
  investors: {
    name: string;
    equity: number;
    amount: number;
  }[];
};
