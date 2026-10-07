import type { VercelRequest, VercelResponse } from "@vercel/node";
import {qs,VERSION,grade} from "../src/items.js";
export default async function handler(req:VercelRequest,res:VercelResponse){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
 const b=req.body;
 if(!b||typeof b!=="object"||b.version!==VERSION||typeof b.id!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(b.id)||!Number.isInteger(b.age)||b.age<18||b.age>80||typeof b.consentResearch!=="boolean"||!Array.isArray(b.answers)||b.answers.length!==qs.length||!b.answers.every((a:unknown,k:number)=>Number.isInteger(a)&&Number(a)>=0&&Number(a)<qs[k].choices.length)||!Array.isArray(b.responseTimesMs)||b.responseTimesMs.length!==qs.length||!b.responseTimesMs.every((t:unknown)=>Number.isInteger(t)&&Number(t)>=0&&Number(t)<=86400000)||!Number.isInteger(b.durationMs)||b.durationMs<0||b.durationMs>86400000)return res.status(400).json({error:"Invalid attempt"});
 const start=Date.parse(b.startedAt),finish=Date.parse(b.finishedAt);
 const summed=b.responseTimesMs.reduce((a:number,t:number)=>a+t,0);
 if(!Number.isFinite(start)||!Number.isFinite(finish)||finish<start||Math.abs(finish-start-b.durationMs)>2000||Math.abs(summed-b.durationMs)>5000)return res.status(400).json({error:"Invalid timing"});
 if(!b.consentResearch)return res.status(200).json({saved:false,research:false});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return res.status(503).json({error:"Persistence is not configured"});
 const g=grade(b.answers);
 const row={id:b.id,version:VERSION,started_at:new Date(start).toISOString(),finished_at:new Date(finish).toISOString(),answers:b.answers,score:g.score,by_domain:g.byDomain,age:b.age,consent_research:true,duration_ms:b.durationMs,response_times_ms:b.responseTimesMs};
 try{
 const r=await fetch(url+"/rest/v1/iqtest_attempts?on_conflict=id",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"resolution=ignore-duplicates,return=minimal"},body:JSON.stringify(row),signal:AbortSignal.timeout(10000)});
 if(!r.ok)return res.status(502).json({error:"Failed to save attempt"});
 return res.status(200).json({saved:true});
 }catch{return res.status(502).json({error:"Failed to save attempt"});}
}
