export default function handler(req,res){res.setHeader("Cache-Control","no-store");
 return res.status(503).json({status:"PAYMENTS_DISABLED",paid:false,orderCreated:false,receipt:null,
 reason:"Facilitador x402 e carteira de recebimento não homologados."});}
