// Test adapter only: executes the unchanged production handlers, never a mock API.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import agent from '../../api/agent-api.js';
import enterprise from '../../api/mcp/enterprise.js';
import gxMcp from '../../api/mcp/gx.js';
import gx from '../../api/gx.js';
import ecosystem from '../../api/ecosystem.js';
import omnixRequest from '../../api/omnix-request.js';

process.env.GX_AI_ENABLED='false';
const handlers=new Map([['/api/agent-api',agent],['/api/mcp/enterprise',enterprise],['/api/mcp/gx',gxMcp],['/api/gx',gx],['/api/ecosystem',ecosystem],['/api/omnix-request',omnixRequest]]);
const dist=path.resolve('dist');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
  res.status=code=>{res.statusCode=code;return res;};
  res.json=body=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body));return res;};
  try{
    const url=new URL(req.url,'http://127.0.0.1:4782');
    req.query=Object.fromEntries(url.searchParams);
    if(url.pathname.startsWith('/api/')){
      const handler=handlers.get(url.pathname);
      if(!handler)return res.status(404).json({error:'NOT_FOUND'});
      let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>32768)return res.status(413).json({error:'BODY_TOO_LARGE'});}
      try{req.body=body?JSON.parse(body):{};}catch{return res.status(400).json({error:'INVALID_JSON'});}
      return await handler(req,res);
    }
    if(req.method!=='GET')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
    const file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(dist+path.sep)&&file!==dist)return res.status(404).json({error:'NOT_FOUND'});
    const target=url.pathname==='/'?path.join(dist,'index.html'):file;
    try{const bytes=await fs.readFile(target);res.setHeader('Content-Type',mime[path.extname(target)]??'application/octet-stream');res.end(bytes);}catch{res.status(404).json({error:'NOT_FOUND'});}
  }catch{if(!res.headersSent)res.status(500).json({error:'TEST_ADAPTER_FAILURE'});else res.end();}
});
server.listen(4782,'127.0.0.1',()=>console.log('Preservation test adapter: loopback only, AI disabled'));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
