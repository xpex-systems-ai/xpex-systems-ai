import test from 'node:test';
import assert from 'node:assert/strict';
import {emitOmnixPublicEvent} from '../src/omnix-events.js';

test('public OMNIX event contract cannot forward draft fields or claim receipt/payment',()=>{
  const target = new EventTarget(), events=[];
  target.addEventListener('omnix:public-event',event=>events.push(event.detail));
  assert.equal(emitOmnixPublicEvent(target,'product_visit'),true);
  assert.equal(emitOmnixPublicEvent(target,'commercial_click'),true);
  assert.equal(emitOmnixPublicEvent(target,'request_started'),true);
  for(const value of ['payment_confirmed','report_exported','customer-name=PRIVATE', {name:'request_started',scope:'PRIVATE'}])
    assert.equal(emitOmnixPublicEvent(target,value),false);
  assert.equal(events.length,3);
  assert.deepEqual(events[2],{name:'request_started',product:'omnix',stage:'preview',outcome:'local_draft'});
  for(const event of events){assert.equal(Object.isFrozen(event),true);assert.deepEqual(Object.keys(event).sort(),['name','outcome','product','stage']);}
});
