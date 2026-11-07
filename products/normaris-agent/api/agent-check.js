import {auditAgentContract} from "../lib/agent-contract.js";
export default function handler(req,res){res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST")return res.status(405).json({error:"Use POST JSON"});
 try{return res.status(200).json(auditAgentContract(req.body?.manifest));}
 catch(e){return res.status(e.status||500).json({error:e.status?e.message:"Falha de auditoria."});}
}
