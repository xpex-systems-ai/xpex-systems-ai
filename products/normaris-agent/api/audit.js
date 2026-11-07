import {evidencePack,inspectSource} from "../lib/evidence.js";
export default function handler(req,res){res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST")return res.status(405).json({error:"Use POST."});
 try{return res.status(200).json(req.body?.sourceId!==undefined?{source:inspectSource(req.body.sourceId)}:evidencePack(req.body?.query));}
 catch(e){return res.status(e.status||500).json({error:e.status?e.message:"Erro no relatório."});}
}
