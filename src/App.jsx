import { useState, useMemo } from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Legend, ComposedChart, ReferenceLine } from "recharts";

/* ═══ PAY DATA — [M1,M2,M3,M4,M5,M6,U1,U2,U3] — yr 26 = 3.5% award; yr 27 = 2.5% placeholder ═══ */
const _R={
"RoE":{10:[21588,23295,25168,27104,29240,31552,34181,35447,36756],11:[21588,23295,25168,27104,29240,31552,34181,35447,36756],12:[21588,23295,25168,27104,29240,31552,34181,35447,36756],13:[21804,23528,25420,27375,29532,31868,34523,35801,37124],14:[22023,23763,25674,27649,29828,32187,34868,36159,37495],15:[22244,24001,25931,27925,30126,32509,35217,36521,37870],16:[22467,24241,26190,28204,30427,32834,35569,36886,38249],17:[22917,24484,26452,28487,30732,33162,35925,37255,38631],18:[23720,25594,27188,29114,31234,33825,36644,38000,39404],19:[24373,26298,27936,29915,32093,34756,37652,39045,40488],20:[25714,27600,29664,31604,33160,35711,38690,40124,41604],21:[25714,27600,29664,31604,33160,35711,38690,40124,41604],22:[28000,29800,31750,33850,35990,38810,40625,42131,43685],23:[30000,31737,33814,36050,38329,41333,43266,44870,46525],24:[31650,33483,35674,38034,40439,43607,45646,47338,49084],25:[32916,34823,37101,39556,42057,45352,47472,49232,51048],26:[34068,36042,38400,40940,43529,46939,49134,50955,52835],27:[34920,36943,39360,41964,44617,48113,50362,52229,54156]},
"Fringe":{10:[22626,24331,26203,28146,30278,32588,35116,36397,37725],11:[22626,24331,26203,28146,30278,32588,35116,36397,37725],12:[22626,24331,26203,28146,30278,32588,35116,36397,37725],13:[22852,24574,26465,28427,30581,32914,35467,36761,38102],14:[23081,24820,26730,28712,30887,33243,35822,37129,38483],15:[23312,25068,26997,28999,31196,33575,36180,37500,38868],16:[23545,25319,27267,29289,31508,33911,36542,37875,39257],17:[24016,25572,27540,29582,31823,34250,36907,38254,39650],18:[24857,26359,28062,30174,32300,34935,37645,39019,40443],19:[25541,27084,28834,31003,33189,35896,38681,40092,41555],20:[26948,28467,30630,32773,34367,36883,39745,41195,42698],21:[26948,28467,30630,32773,34367,36883,39745,41195,42698],22:[29344,31126,33055,35151,37264,40083,41858,43360,44919],23:[31252,33149,35204,37436,39686,42688,44579,46178,47839],24:[33075,34974,37141,39495,41870,45037,47031,48719,50471],25:[34398,36373,38627,41075,43545,46839,48913,50668,52490],26:[35602,37646,39979,42513,45069,48478,50625,52441,54327],27:[36492,38587,40978,43576,46196,49690,51891,53752,55685]},
"OLon":{10:[25117,26674,28325,30080,31868,34181,37461,38857,40285],11:[25117,26674,28325,30080,31868,34181,37461,38857,40285],12:[25117,26674,28325,30080,31868,34181,37461,38857,40285],13:[25368,26941,28608,30381,32187,34523,37836,39246,40688],14:[25622,27210,28894,30685,32509,34868,38214,39638,41095],15:[25878,27482,29183,30992,32834,35217,38596,40034,41506],16:[26137,27757,29475,31302,33162,35569,38982,40435,41921],17:[26660,28035,29770,31615,33494,35925,39372,40839,42340],18:[27593,28916,30366,32247,34024,36644,40159,41656,43187],19:[28352,29711,31201,33134,34960,37652,41264,42802,44375],20:[29911,31196,33168,34848,36173,38688,42399,43979,45596],21:[29911,31196,33168,34848,36173,38688,42399,43979,45596],22:[32407,34103,35886,37763,40050,43193,44687,46340,48055],23:[34513,36320,38219,40218,42653,46001,47592,49352,51179],24:[36413,38318,40322,42430,45000,48532,50210,52068,53994],25:[37870,39851,41935,44128,46800,50474,52219,54151,56154],26:[39195,41246,43403,45672,48438,52241,54047,56046,58119],27:[40175,42277,44488,46814,49649,53547,55398,57447,59572]},
"ILon":{10:[27000,28226,29535,31446,33865,36387,41497,42898,44360],11:[27000,28226,29535,31446,33865,36387,41497,42898,44360],12:[27000,28226,29535,31446,33865,36387,41497,42898,44360],13:[27270,28508,29830,31760,34204,36751,41912,43327,44804],14:[27543,28793,30129,32078,34546,37119,42331,43760,45252],15:[27818,29081,30430,32399,34891,37490,42754,44198,45705],16:[28096,29372,30734,32723,35240,37865,43182,44640,46162],17:[28658,29666,31041,33050,35592,38244,43614,45086,46624],18:[29664,30586,31702,33712,36146,39009,44486,45988,47557],19:[30480,31427,32573,34639,37140,40082,45710,47253,48865],20:[32157,33238,34564,36457,38363,41184,46967,48552,50211],21:[32157,33238,34564,36457,38363,41184,46967,48552,50211],22:[34502,36141,37857,39655,41892,44756,49320,51743,53482],23:[36745,38490,40318,42233,44615,47665,52526,55106,56958],24:[38766,40609,42536,44556,47069,50288,55415,58138,60092],25:[40317,42234,44238,46339,48952,52300,57632,60464,62496],26:[41728,43712,45786,47961,50665,54130,59649,62580,64683],27:[42771,44805,46931,49160,51932,55483,61140,64145,66300]}};
const PROJ_START=2026;
const RKEYS=["RoE","Fringe","OLon","ILon"];
const RNAMES={"RoE":"Rest of England","Fringe":"London Fringe","OLon":"Outer London","ILon":"Inner London"};
const PPS=["M1","M2","M3","M4","M5","M6","U1","U2","U3"];
const PP_C={M1:"#b91c1c",M2:"#ea580c",M3:"#ca8a04",M4:"#4d7c0f",M5:"#0d9488",M6:"#7c3aed",U1:"#0369a1",U2:"#c026d3",U3:"#151F3B"};
function gp(rk,yr,pi){return _R[rk][yr][pi];}
const YRS=Array.from({length:18},(_,i)=>2010+i);
const YK=y=>y-2000;
const INF_C={10:1,11:1.052,12:1.075,13:1.104,14:1.117,15:1.116,16:1.127,17:1.161,18:1.189,19:1.209,20:1.215,21:1.253,22:1.379,23:1.472,24:1.497,25:1.548,26:1.596,27:1.636};
const NMW_H={10:5.93,11:6.08,12:6.19,13:6.31,14:6.50,15:6.70,16:7.20,17:7.50,18:7.83,19:8.21,20:8.72,21:8.91,22:9.50,23:10.42,24:11.44,25:12.21,26:12.82,27:13.40};
const nmwA=yk=>NMW_H[yk]*37.5*52;
const AVG_E={10:0,11:-0.5,12:-0.2,13:-0.3,14:0,15:0.8,16:1.2,17:1.3,18:1.5,19:1.9,20:2.5,21:1.9,22:2.2,23:3.5,24:4.5,25:6.0,26:6.9,27:7.4};
const GOV=[{s:2010,e:2015,l:"Coalition",c:"#2E8B57"},{s:2015,e:2024,l:"Conservative",c:"#0087DC"},{s:2024,e:2029,l:"Labour",c:"#DC241F"}];

const INK="#151F3B",GOLD="#FED02F",BLUE="#5783C0",GREEN="#047857",RED="#b91c1c";
const fmt=v=>"£"+Math.round(v).toLocaleString("en-GB");
const pc=v=>(v>=0?"+":"")+v.toFixed(1)+"%";
const SER="Georgia, 'Times New Roman', serif";
const S="system-ui,-apple-system,sans-serif";
function realG(b,n,c){return((n/(b*c))-1)*100;}

const Btn=({a,onClick,children})=><button onClick={onClick} style={{padding:"7px 13px",borderRadius:4,fontSize:13,fontWeight:a?600:400,border:a?`1.5px solid ${INK}`:"1px solid #d1d5db",background:a?INK:"#fff",color:a?"#fff":"#4b5563",cursor:"pointer",whiteSpace:"nowrap"}}>{children}</button>;
const Lab=({children})=><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"#9ca3af",marginBottom:5}}>{children}</div>;
const Src=({children})=><div style={{fontSize:9,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",padding:"8px 14px 6px",borderTop:"1px solid #f3f4f6"}}>{children}</div>;
const GovLeg=()=><div style={{display:"flex",justifyContent:"center",gap:16,padding:"4px 0 8px",flexWrap:"wrap"}}>{GOV.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:9,height:9,borderRadius:2,background:p.c,opacity:.3}}/><span style={{color:"#6b7280"}}>{p.l}</span></div>)}</div>;

const PctTip=({active,payload,label})=>{if(!active||!payload?.length)return null;return(<div style={{background:"#fff",border:`1.5px solid ${INK}`,borderRadius:6,padding:"10px 14px",fontSize:12,boxShadow:"0 4px 12px rgba(21,31,59,.15)",fontFamily:S}}><div style={{fontWeight:700,fontFamily:SER,marginBottom:4,color:INK}}>{label}{label>=PROJ_START?" (projected)":""}</div>{payload.filter(p=>p.value!=null).map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:14,lineHeight:1.7}}><span style={{color:p.color||p.stroke}}>{p.name}</span><span style={{fontWeight:700,color:p.value>=0?GREEN:RED}}>{pc(p.value)}</span></div>)}</div>);};
const RatTip=({active,payload,label})=>{if(!active||!payload?.length)return null;return(<div style={{background:"#fff",border:`1.5px solid ${INK}`,borderRadius:6,padding:"10px 14px",fontSize:12,boxShadow:"0 4px 12px rgba(21,31,59,.15)",fontFamily:S}}><div style={{fontWeight:700,fontFamily:SER,marginBottom:4,color:INK}}>{label}{label>=PROJ_START?" (projected)":""}</div>{payload.filter(p=>p.value!=null).map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:14,lineHeight:1.7}}><span style={{color:p.color||p.stroke}}>{p.name}</span><span style={{fontWeight:700}}>{p.value.toFixed(2)}×</span></div>)}</div>);};

export default function App(){
  const[tab,setTab]=useState("earnings");
  const[eRk,setERk]=useState("RoE");
  const[ePP,setEPP]=useState(new Set(["M1","M6","U3"]));
  const[sAE,setSAE]=useState(true);
  const tEP=k=>{const s=new Set(ePP);s.has(k)?s.delete(k):s.add(k);setEPP(s);};
  const[nRk,setNRk]=useState("RoE");
  const maxY=2025;

  const eD=useMemo(()=>YRS.filter(y=>y<=maxY).map(y=>{const yk=YK(y);const r={year:y};PPS.forEach((p,i)=>{r[p]=realG(gp(eRk,10,i),gp(eRk,yk,i),INF_C[yk]);});r.avgE=AVG_E[yk];return r;}),[eRk]);
  const nD=useMemo(()=>YRS.filter(y=>y<=maxY).map(y=>{const yk=YK(y);return{year:y,m1:gp(nRk,yk,0)/nmwA(yk),m6:gp(nRk,yk,5)/nmwA(yk)};}),[nRk]);
  const nS=useMemo(()=>{const yk=YK(maxY);const r10=gp(nRk,10,0)/nmwA(10),rN=gp(nRk,yk,0)/nmwA(yk),r10m6=gp(nRk,10,5)/nmwA(10),rNm6=gp(nRk,yk,5)/nmwA(yk);const hM1=r10*nmwA(yk),hM6=r10m6*nmwA(yk);return{r10,rN,r10m6,rNm6,hM1,hM6,aM1:gp(nRk,yk,0),aM6:gp(nRk,yk,5),nN:nmwA(yk),n10:nmwA(10),gM1:hM1-gp(nRk,yk,0),gM6:hM6-gp(nRk,yk,5)};},[nRk]);

  return(<div style={{fontFamily:S,maxWidth:880,margin:"0 auto",padding:"20px 16px 36px",color:INK,background:"#fff"}}>
    <div style={{borderBottom:`1px solid ${INK}`,paddingBottom:10,marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}>
        <div style={{fontFamily:SER,fontSize:19,fontWeight:700}}>Teacher Pay in England</div>
        <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em"}}>Edapt analysis</div>
      </div>
    </div>

    <div style={{display:"flex",gap:0,borderBottom:"1px solid #e5e7eb",marginBottom:20,overflowX:"auto"}}>
      {[["earnings","vs Average earnings"],["nmw","vs Minimum wage"]].map(([k,l])=>
        <button key={k} onClick={()=>setTab(k)} style={{padding:"10px 14px",fontSize:12.5,fontWeight:tab===k?700:400,borderBottom:tab===k?`3px solid ${GOLD}`:"3px solid transparent",background:"transparent",border:"none",borderBottomStyle:"solid",color:tab===k?INK:"#9ca3af",cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>
      )}
    </div>

    {tab==="earnings"&&<>
      <div style={{marginBottom:18,paddingBottom:14,borderBottom:`3px solid ${INK}`}}>
        <div style={{fontFamily:SER,fontSize:"clamp(22px, 5vw, 30px)",fontWeight:700,lineHeight:1.15}}>Teacher pay vs everyone else's</div>
        <div style={{fontSize:14,color:"#4b5563",marginTop:8,lineHeight:1.55,maxWidth:620}}>How pay has changed since 2010 after adjusting for inflation (CPI). The zero line is the 2010 starting point — below it means pay buys less than in 2010. The dashed blue line shows average UK earnings for comparison.</div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
        <div><Lab>Region</Lab><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{RKEYS.map(r=><Btn key={r} a={eRk===r} onClick={()=>setERk(r)}>{RNAMES[r]}</Btn>)}</div></div>
      </div>
      <div style={{marginBottom:14}}><Lab>Pay points</Lab><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
        {PPS.map(p=><button key={p} onClick={()=>tEP(p)} style={{padding:"5px 10px",borderRadius:4,fontSize:12,fontWeight:ePP.has(p)?700:400,border:`1.5px solid ${ePP.has(p)?PP_C[p]:"#e5e7eb"}`,background:ePP.has(p)?PP_C[p]+"12":"#fff",color:ePP.has(p)?PP_C[p]:"#9ca3af",cursor:"pointer"}}>{p}</button>)}
        <div style={{width:1,height:22,background:"#e5e7eb",alignSelf:"center"}}/>
        <button onClick={()=>setSAE(v=>!v)} style={{padding:"5px 10px",borderRadius:4,fontSize:12,fontWeight:sAE?700:400,border:`1.5px solid ${sAE?BLUE:"#e5e7eb"}`,background:sAE?BLUE+"15":"#fff",color:sAE?BLUE:"#9ca3af",cursor:"pointer"}}>Avg UK earnings</button>
      </div></div>
      <div style={{border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden"}}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={eD} margin={{top:12,right:18,bottom:4,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
            {GOV.map((p,i)=><ReferenceArea key={"g"+i} x1={p.s} x2={Math.min(p.e,maxY)} fill={p.c} fillOpacity={.05}/>)}
            <ReferenceLine y={0} stroke={INK} strokeWidth={1.5}/>
            <XAxis dataKey="year" type="number" domain={[2010,maxY]} ticks={YRS.filter(y=>y<=maxY)} tick={{fontSize:10}} tickFormatter={v=>"'"+String(v).slice(-2)} stroke="#d1d5db"/>
            <YAxis tick={{fontSize:10}} tickFormatter={v=>v+"%"} stroke="#d1d5db" width={40} domain={[-18,12]}/>
            <Tooltip content={<PctTip/>}/>
            {PPS.map(p=>ePP.has(p)?<Line key={p} type="monotone" dataKey={p} stroke={PP_C[p]} strokeWidth={2} dot={{r:2,fill:PP_C[p]}} name={p} isAnimationActive={false}/>:null)}
            {sAE&&<Line type="monotone" dataKey="avgE" stroke={BLUE} strokeWidth={3} strokeDasharray="8 4" dot={{r:2.5,fill:BLUE}} name="Avg UK earnings" isAnimationActive={false}/>}
            <Legend verticalAlign="bottom" height={30} wrapperStyle={{fontSize:11}}/>
          </ComposedChart>
        </ResponsiveContainer>
        <GovLeg/>
        <Src>Source: STPCD deflated by ONS Sept CPI; avg earnings NFER/OBR · Edapt analysis</Src>
      </div>
      <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
        {[...Array.from(ePP).sort((a,b)=>PPS.indexOf(a)-PPS.indexOf(b)).map(p=>({l:p,v:realG(gp(eRk,10,PPS.indexOf(p)),gp(eRk,YK(maxY),PPS.indexOf(p)),INF_C[YK(maxY)]),c:PP_C[p]})),...(sAE?[{l:"Avg UK",v:AVG_E[YK(maxY)],c:BLUE}]:[])].map((c,i)=><div key={i} style={{border:"1px solid #e5e7eb",borderLeft:`3px solid ${c.c}`,borderRadius:4,padding:"5px 10px"}}><span style={{fontSize:10,fontWeight:700,color:c.c,marginRight:6}}>{c.l}</span><span style={{fontFamily:SER,fontSize:15,fontWeight:700,color:c.v>=0?GREEN:RED}}>{pc(c.v)}</span></div>)}
      </div>
      {sAE&&ePP.size>0&&<div style={{background:"#f8f9fb",borderLeft:`4px solid ${BLUE}`,borderRadius:"0 6px 6px 0",padding:"12px 16px",marginTop:14}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:6}}>What this means</div>
        {Array.from(ePP).sort((a,b)=>PPS.indexOf(a)-PPS.indexOf(b)).map(p=>{
          const v=realG(gp(eRk,10,PPS.indexOf(p)),gp(eRk,YK(maxY),PPS.indexOf(p)),INF_C[YK(maxY)]);
          const ae=AVG_E[YK(maxY)];const gapPP=ae-v;
          return <p key={p} style={{fontSize:13,color:"#374151",margin:"0 0 6px",lineHeight:1.6}}>
            Average UK earnings have risen <strong style={{color:GREEN}}>{pc(ae)}</strong> in real terms since 2010. Over the same period, teachers on <strong>{p}</strong> have seen their pay {v>=0?<>rise <strong style={{color:GREEN}}>{pc(v)}</strong></>:<>fall <strong style={{color:RED}}>{v.toFixed(1)}%</strong></>} in real terms — {gapPP>0?<>leaving them <strong>{gapPP.toFixed(1)} percentage points behind</strong> the average worker</>:<>ahead of average earnings growth</>}.
          </p>;
        })}
      </div>}
      <p style={{fontSize:12,color:"#6b7280",lineHeight:1.6,margin:"12px 0 0"}}>The headline: starting salaries (M1) have roughly caught back up with 2010; pay for experienced teachers (M6, U3) has not — and everyone has fallen behind average UK earnings. One caveat the Government makes: the average has been pulled up by big minimum wage rises at the bottom; pay in professional jobs has grown more slowly.</p>
    </>}

    {tab==="nmw"&&<>
      <div style={{marginBottom:18,paddingBottom:14,borderBottom:`3px solid ${INK}`}}>
        <div style={{fontFamily:SER,fontSize:"clamp(22px, 5vw, 30px)",fontWeight:700,lineHeight:1.15}}>The shrinking pay gap with minimum-wage work</div>
        <div style={{fontSize:14,color:"#4b5563",marginTop:8,lineHeight:1.55,maxWidth:620}}>In 2010, a new teacher earned {nS.r10.toFixed(2)}× what a full-time minimum-wage worker earned. Today it's {nS.rN.toFixed(2)}×. Here's what that change looks like — and what it means.</div>
      </div>
      <div style={{marginBottom:14}}><Lab>Region</Lab><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{RKEYS.map(r=><Btn key={r} a={nRk===r} onClick={()=>setNRk(r)}>{RNAMES[r]}</Btn>)}</div></div>
      <div style={{border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden"}}>
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={nD} margin={{top:12,right:14,bottom:4,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
            {GOV.map((p,i)=><ReferenceArea key={"g"+i} x1={p.s} x2={Math.min(p.e,maxY)} fill={p.c} fillOpacity={.04}/>)}
            <XAxis dataKey="year" type="number" domain={[2010,maxY]} ticks={YRS.filter(y=>y<=maxY)} tick={{fontSize:10}} tickFormatter={v=>"'"+String(v).slice(-2)} stroke="#d1d5db"/>
            <YAxis tick={{fontSize:10}} tickFormatter={v=>v.toFixed(1)+"×"} stroke="#d1d5db" width={38}/>
            <Tooltip content={<RatTip/>}/>
            <Line type="monotone" dataKey="m1" stroke={INK} strokeWidth={2.5} dot={{r:2.5,fill:INK}} name="New teacher (M1)" isAnimationActive={false}/>
            <Line type="monotone" dataKey="m6" stroke={BLUE} strokeWidth={2} dot={{r:2,fill:BLUE}} name="Experienced (M6)" isAnimationActive={false}/>
            <Legend verticalAlign="bottom" height={30} wrapperStyle={{fontSize:11}}/>
          </ComposedChart>
        </ResponsiveContainer>
        <GovLeg/>
        <Src>Source: STPCD; UK Govt minimum wage rates (37.5 hrs/wk equivalent) · Edapt analysis</Src>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:12,marginTop:14}}>
        {[["New teacher (M1)",nS.r10,nS.hM1,nS.gM1,nS.aM1],["Experienced teacher (M6)",nS.r10m6,nS.hM6,nS.gM6,nS.aM6]].map(([label,ratio,hyp,gap,actual],i)=>
          <div key={i} style={{border:"1px solid #e5e7eb",borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontWeight:700,fontFamily:SER,fontSize:14,marginBottom:4}}>{label}</div>
            <div style={{fontSize:12,color:"#374151",lineHeight:1.5}}>If teacher pay had risen as fast as the minimum wage since 2010, it would now be <strong>{fmt(hyp)}</strong> rather than {fmt(actual)}.</div>
            <div style={{marginTop:6,fontFamily:SER,fontSize:20,fontWeight:700,color:RED}}>{fmt(gap)}/year less</div>
            <div style={{fontSize:10,color:"#9ca3af"}}>than if it had kept pace with the minimum wage</div>
          </div>
        )}
      </div>
      <p style={{fontSize:12,color:"#6b7280",lineHeight:1.6,margin:"12px 0 0"}}>The minimum wage has risen +{(((nS.nN/nS.n10)-1)*100).toFixed(0)}% since 2010 — far faster than teacher pay. The squeeze affects most graduate careers, but it matters for recruitment: the financial reward for training as a teacher has narrowed substantially. (Minimum wage figure assumes 37.5 hrs/week year-round.)</p>
    </>}
  </div>);
}
