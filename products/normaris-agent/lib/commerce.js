export const OFFERS=Object.freeze([
 {id:"reference_lookup",name:"Official Reference Lookup",description:"Links fundamentados em fontes oficiais catalogadas.",unit:"consulta",proposedUsdc:"0.05",status:"DEMO_ONLY",channels:["Dashboard","REST","MCP"]},
 {id:"evidence_pack",name:"Evidence Trust Pack",description:"Relatório verificável de referências, lacunas e critérios de revisão.",unit:"relatório",proposedUsdc:"0.10",status:"DEMO_ONLY",channels:["Dashboard","REST","MCP"]},
 {id:"enterprise_pilot",name:"Enterprise Integration Pilot",description:"Implantação com integrações e revisão profissional, mediante contrato.",unit:"projeto",proposedUsdc:null,status:"PROPOSAL_ONLY",channels:["B2B"]}
]);
export function commerce(){return {product:"COSIVANT Agent Intelligence",gateway:"GXEON Commerce",version:"0.2.0",protocolPlanned:"x402",networkPlanned:"Base",assetPlanned:"USDC",
 enabled:false,checkoutEnabled:false,receivingWalletVerified:false,settlementsVerified:0,verifiedClients:0,
 priceDisclaimer:"PREÇOS HIPOTÉTICOS, NÃO OFERTAS ATIVAS",offers:OFFERS,
 message:"Pagamento desabilitado. Nenhuma carteira, facilitador, contrato ou liquidação foi homologado."};}
