export interface Quote {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  message: string;
  requesterEmail: string;
  requesterName: string;
  requesterAccountId: string;
  timestamp: string;
  status: 'pendente' | 'proposta enviada' | 'aprovado' | 'recusado' | 'negociando' | 'cancelado';
  proposedPrice?: number;
  deliveryDays?: number;
  proposalValidityDays?: number;
  vendorMessage?: string;


  history?: {
    senderId: string;
    senderRole: 'comprador' | 'vendedor';
    message: string;
    timestamp: string;
  }[];
}
