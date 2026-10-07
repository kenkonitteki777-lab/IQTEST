import {test} from 'node:test';
import assert from 'node:assert/strict';
import handler from '../.test-build/attempts.mjs';
const valid=()=>({id:'00000000-0000-4000-8000-000000000001',version:'v0.3.1',age:30,consentResearch:true,answers:Array(30).fill(0),responseTimesMs:Array(30).fill(1000),durationMs:30000,startedAt:'2026-10-07T00:00:00Z',finishedAt:'2026-10-07T00:00:30Z'});
async function call(body,method='POST'){let code,data;const res={setHeader(){},status(c){code=c;return this},json(d){data=d;return this}};await handler({method,body},res);return {code,data}}
test('rejects incomplete answers, invalid timing, age and version',async()=>{for(const patch of [{answers:[0]},{age:17},{version:'v0.3'},{responseTimesMs:Array(30).fill(-1)},{durationMs:1}])assert.equal((await call({...valid(),...patch})).code,400)});
test('non-consenting attempts never call storage',async()=>{global.fetch=()=>{throw Error('must not store')};assert.deepEqual((await call({...valid(),consentResearch:false})).data,{saved:false,research:false})});
test('server computes score and uses idempotent storage',async()=>{process.env.SUPABASE_URL='https://example.invalid';process.env.SUPABASE_SERVICE_ROLE_KEY='test';let stored;global.fetch=async(url,init)=>{assert.match(url,/on_conflict=id/);assert.match(init.headers.Prefer,/ignore-duplicates/);stored=JSON.parse(init.body);return {ok:true}};assert.equal((await call({...valid(),score:999,byDomain:{fake:999}})).code,200);assert.notEqual(stored.score,999);assert.equal(Object.keys(stored.by_domain).length,5)});
test('storage errors are visible and unsupported methods rejected',async()=>{global.fetch=async()=>({ok:false});assert.equal((await call(valid())).code,502);assert.equal((await call(valid(),'GET')).code,405)});
