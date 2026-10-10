import fs from 'node:fs';
import { BRANDS, BRAND_VERSION, symbolSVG, lockupSVG } from '../site/src/brand.js';
const root=new URL('../site/public/brand/v2/',import.meta.url);
const xml=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
fs.mkdirSync(root,{recursive:true});
for(const brand of BRANDS) {
  for(const [suffix,color] of [['','#E2B248'],['-white','#FFFFFF'],['-ink','#101216']]) {
    fs.writeFileSync(new URL(brand.id+'-symbol'+suffix+'.svg',root),symbolSVG(brand,color)+'\n');
  }
  fs.writeFileSync(new URL(brand.id+'-lockup.svg',root),lockupSVG(brand)+'\n');
}
fs.writeFileSync(new URL('favicon.svg',root),symbolSVG(BRANDS[0]).replace(BRANDS[0].shape,`<rect width="64" height="64" rx="14" fill="#07090D"/>${BRANDS[0].shape}`)+'\n');
const manifest={version:BRAND_VERSION,company:'XPeX Systems AI',palette:{ink:'#07090D',gold:'#E2B248',white:'#FFFFFF'},brands:BRANDS.map(({shape,...brand})=>({...brand,symbol:`${brand.id}-symbol.svg`,lockup:`${brand.id}-lockup.svg`}))};
fs.writeFileSync(new URL('manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
const cards=BRANDS.map((b,i)=>{
  const x=80+(i%3)*600,y=400+Math.floor(i/3)*310;
  return `<g transform="translate(${x} ${y})"><rect width="568" height="276" rx="20" fill="#10141A" stroke="#2A2E35"/><g transform="translate(34 34) scale(1.15)" style="color:#E2B248">${b.shape}</g><text x="34" y="154" fill="#FFFFFF" font-size="27" font-weight="600">${xml(b.short)}</text><text x="34" y="191" fill="#A9B0BA" font-size="17">${xml(b.descriptor)}</text><text x="34" y="237" fill="#E2B248" font-size="11" letter-spacing="2">${b.layer}</text></g>`;
}).join('');
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1410" viewBox="0 0 1920 1410" font-family="Inter,Arial,sans-serif"><rect width="1920" height="1410" fill="#07090D"/><g transform="translate(80 68) scale(1.5)" style="color:#E2B248">${BRANDS[0].shape}</g><text x="200" y="120" fill="#FFF" font-size="51" font-weight="600">XPeX Systems AI</text><text x="201" y="157" fill="#E2B248" font-size="14" letter-spacing="4">VISUAL IDENTITY / V2</text><text x="80" y="281" fill="#FFF" font-size="61" font-weight="500">One company. One connected ecosystem.</text><text x="80" y="332" fill="#A9B0BA" font-size="23">Original symbols. Shared geometry. Evidence-led systems.</text>${cards}<text x="80" y="1360" fill="#858D99" font-size="17">BUILD. CONNECT. OPERATE. PROVE.</text><text x="1535" y="1360" fill="#E2B248" font-size="14">XPeX Systems AI · 2026</text></svg>`;
fs.writeFileSync(new URL('identity-sheet.svg',root),sheet+'\n');
const social=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Inter,Arial,sans-serif"><rect width="1200" height="630" fill="#07090D"/><g transform="translate(70 66) scale(1.2)" style="color:#E2B248">${BRANDS[0].shape}</g><text x="170" y="115" fill="#FFFFFF" font-size="43" font-weight="600">XPeX Systems AI</text><text x="70" y="269" fill="#FFFFFF" font-size="67" font-weight="600">Applied AI.</text><text x="70" y="349" fill="#E2B248" font-size="58">One connected ecosystem.</text><text x="70" y="408" fill="#A9B0BA" font-size="23">Systems · Agents · Company Intelligence</text>${BRANDS.slice(1).map((b,i)=>`<g transform="translate(${70+i*136} 482) scale(.72)" style="color:#E2B248">${b.shape}</g>`).join('')}<text x="70" y="584" fill="#A9B0BA" font-size="15" letter-spacing="3">BUILD. CONNECT. OPERATE. PROVE.</text></svg>`;
fs.writeFileSync(new URL('social-preview.svg',root),social+'\n');
fs.copyFileSync(new URL('../docs/company/brand-system.md',import.meta.url),new URL('brand-guide.md',root));
console.log(`Brand assets built: ${BRANDS.length} identities / gold, white and ink SVG symbols / horizontal lockups.`);
