import {test} from "node:test";import assert from "node:assert/strict";import {SOURCES,search,health} from "../lib/core.js";
test("sources are official HTTPS links",()=>{assert.equal(SOURCES.length,4);for(const s of SOURCES)assert.ok(s.url.startsWith("https://"));});
test("reference retrieval never claims live RAG",()=>{const r=search("consultas da COSIT");assert.ok(r.citations.length>0);assert.equal(r.ragActive,false);assert.equal(r.indexedCositActs,0);});
test("unknown question refuses unsupported conclusion",()=>{let r=search("xylophones nanorobos singulares");assert.equal(r.citations.length,0);});
test("bounded input and accurate status",()=>{assert.throws(()=>search("a"));assert.throws(()=>search("a".repeat(501)));assert.equal(health().productionReady,false);});