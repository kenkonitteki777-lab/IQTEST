import {useMemo,useState} from "react";
type Q={id:number;domain:string;level:string;text:string;choices:string[];answer:number;time?:number};
const qs:Q[]=[
[1,"言語推理","易","「医師」と「教師」に共通する最も適切な説明は？",["専門的な知識・技能を他者に提供する職業","国家資格が必要な職業","人と話す職業","学校で働く職業"],0],
[2,"言語推理","やや易","「原因：結果」と最も近い関係は？",["部品：機械","問題：解答","木：森","本：図書館"],1],
[3,"言語推理","標準","「地図」が「場所」を表す関係に最も近いものは？",["時計：電池","写真：カメラ","辞書：単語","鍵：扉"],2],
[4,"言語推理","標準","AはBより年上。CはAより年下。BはCより年上。年齢順は？",["A→C→B","B→A→C","B→C→A","A→B→C"],3],
[5,"言語推理","難","「法律・規則・約束・予測」のうち他と性質が異なるものは？",["予測","法律","規則","約束"],0],
[6,"言語推理","かなり難","すべてのPはQ。Qの一部はR。必ず正しいものは？",["すべてのPはR","PはQに含まれる","Pの一部はR","RはすべてP"],1],
[7,"数量推理","易","4, 8, 12, 16, ?",["18","22","20","24"],2],
[8,"数量推理","やや易","2, 6, 18, 54, ?",["108","126","216","162"],3],
[9,"数量推理","標準","3, 7, 15, 31, 63, ?",["95","127","111","129"],1],
[10,"数量推理","標準","xに5を足してから3倍すると42。xは？",["7","11","13","9"],3],
[11,"数量推理","難","2, 5, 12, 27, 58, ?",["115","119","121","123"],2],
[12,"数量推理","かなり難","2, 5, 4, 10, 8, 20, 16, ?",["24","36","40","32"],2],
[13,"流動性推理","易","○, ●, ○, ●, ○, ?",["●","○","△","■"],0],
[14,"流動性推理","やや易","▲, ▲▲, ▲▲▲, ▲▲▲▲, ?",["▲▲▲","▲▲▲▲▲","▲▲▲▲","▲▲▲▲▲▲"],1],
[15,"流動性推理","標準","○1, △2, □3, ○4, △5, ?",["○6","△6","□6","□5"],2],
[16,"流動性推理","標準","○▲, ●△, ○▲, ●△, ?",["●△","○△","●▲","○▲"],3],
[17,"流動性推理","難","○1, △3, □5, ○7, △9, ?",["○10","□10","□11","○11"],2],
[18,"流動性推理","かなり難","○○→2, ○△→3, △△→4, ○□→4, △□→5, □□→?",["5","7","6","8"],2],
[19,"ワーキングメモリ","易","4→8→2 を逆順にすると？",["4→2→8","8→4→2","2→4→8","2→8→4"],3],
[20,"ワーキングメモリ","やや易","K→7→M→3。数字だけを元の順序で答えると？",["3→7","K→M","M→K","7→3"],3],
[21,"ワーキングメモリ","標準","7→2→9→4→6 を小さい順に並べると？",["2→4→6→7→9","2→6→4→7→9","9→7→6→4→2","4→2→6→7→9"],0],
[22,"ワーキングメモリ","標準","5→8→3→1→6→4。奇数を元の順、その後に偶数を元の順で並べると？",["8→6→4→5→3→1","5→3→1→8→6→4","5→1→3→8→4→6","3→5→1→8→6→4"],1],
[23,"ワーキングメモリ","難","7・赤・犬・3・青・猫・8。数字を昇順にしたとき対応する色は？",["赤→青→なし","なし→赤→青","青→赤→なし","赤→なし→青"],2],
[24,"ワーキングメモリ","かなり難","8→3→6→1→9→4→7。逆順にしてから偶数だけ取ると？",["8→6→4","4→8→6","6→4→8","4→6→8"],3],
[25,"処理速度","易","基準は ◆●▲■。次の ○▲□ と同じ記号はいくつ？",["1個","0個","2個","3個"],0,8000],
[26,"処理速度","やや易","○=1、△=2、□=3。△は？",["1","2","4","3"],1,8000],
[27,"処理速度","標準","○=4、△=7、□=2、◇=9。□ ○ △ は？",["274","427","247","724"],2,9000],
[28,"処理速度","標準","左 A7K3、右 A7K8。位置が一致する文字はいくつ？",["2個","4個","1個","3個"],3,7000],
[29,"処理速度","難","7, 8, 12, 14 のうち奇数は？",["7","8","12","14"],0,5000],
[30,"処理速度","かなり難","A=▲ B=● C=■ D=◆。■を表す文字は？",["A","C","B","D"],1,5000]
].map((x:any)=>({id:x[0],domain:x[1],level:x[2],text:x[3],choices:x[4],answer:x[5],time:x[6]}));
export default function App(){
 const [mode,setMode]=useState<"intro"|"test"|"result">("intro"),[i,setI]=useState(0),[ans,setAns]=useState<number[]>([]),[started,setStarted]=useState(""),[times,setTimes]=useState<number[]>([]);
 const q=qs[i];
 const start=()=>{setStarted(new Date().toISOString());setI(0);setAns([]);setTimes([]);setMode("test")};
 const choose=(n:number)=>{const next=[...ans,n],t=[...times,0];if(i<qs.length-1){setAns(next);setTimes(t);setI(i+1)}else{setAns(next);setTimes(t);setMode("result");const score=next.reduce((s,a,k)=>s+(a===qs[k].answer?1:0),0);const byDomain=qs.reduce((o,x,k)=>{o[x.domain]??={score:0,total:0};o[x.domain].total++;if(next[k]===x.answer)o[x.domain].score++;return o},{} as any);fetch("/api/attempts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({version:"v0.3",startedAt:started,finishedAt:new Date().toISOString(),answers:next,score,byDomain})}).catch(()=>{})}};
 const score=useMemo(()=>ans.reduce((s,a,k)=>s+(a===qs[k].answer?1:0),0),[ans]);
 if(mode==="intro")return <main className="shell"><section className="card hero"><span className="eyebrow">IQTEST / PILOT v0.3</span><h1>認知能力<br/><b>パイロット</b></h1><p>5領域・30問で、言語・数量・推理・記憶・処理速度を横断的に測定します。</p><div className="stats"><div><strong>30</strong><span>QUESTIONS</span></div><div><strong>5</strong><span>DOMAINS</span></div><div><strong>∞</strong><span>RESEARCH</span></div></div><button onClick={start}>テストを開始する <span>→</span></button><small>※標準化前の研究用プロトタイプです。公式IQ検査ではありません。</small></section></main>;
 if(mode==="result")return <main className="shell"><section className="card result"><span className="eyebrow">RESULT / v0.3</span><h2>あなたの結果</h2><div className="score"><strong>{score}</strong><span>/ 30</span></div><p>正答数による暫定スコアです。現段階ではIQ値ではありません。</p><div className="domains">{Object.entries(qs.reduce((o,x,k)=>{o[x.domain]??={s:0,t:0};o[x.domain].t++;if(ans[k]===x.answer)o[x.domain].s++;return o},{} as any)).map(([d,v]:any)=><div className="domain" key={d}><span>{d}</span><b>{v.s}/{v.t}</b><i><em style={{width:`${v.s/v.t*100}%`}}/></i></div>)}</div><button onClick={()=>setMode("intro")}>もう一度受ける <span>↻</span></button></section></main>;
 return <main className="shell"><section className="card test"><header><div><span className="eyebrow">{q.domain}</span><h2>Question {String(q.id).padStart(2,"0")}</h2></div><div className="counter">{q.id}<small>/30</small></div></header><div className="bar"><i style={{width:`${q.id/30*100}%`}}/></div><p className="level">{q.level}</p><h3>{q.text}</h3><div className="choices">{q.choices.map((c,n)=><button key={c} onClick={()=>choose(n)}><span>{String.fromCharCode(65+n)}</span>{c}</button>)}</div><footer>回答すると次の問題へ進みます</footer></section></main>
}