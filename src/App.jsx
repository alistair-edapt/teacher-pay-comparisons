import { useState, useMemo, useEffect } from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ComposedChart, ReferenceLine } from "recharts";

/* ═══ PAY DATA — [M1,M2,M3,M4,M5,M6,U1,U2,U3] — 2026 & 2027 = STPCD 2026 advisory points (dormant: tool displays to 2025) ═══ */
const _R={
"RoE":{10:[21588,23295,25168,27104,29240,31552,34181,35447,36756],11:[21588,23295,25168,27104,29240,31552,34181,35447,36756],12:[21588,23295,25168,27104,29240,31552,34181,35447,36756],13:[21804,23528,25420,27375,29532,31868,34523,35801,37124],14:[22023,23763,25674,27649,29828,32187,34868,36159,37495],15:[22244,24001,25931,27925,30126,32509,35217,36521,37870],16:[22467,24241,26190,28204,30427,32834,35569,36886,38249],17:[22917,24484,26452,28487,30732,33162,35925,37255,38631],18:[23720,25594,27188,29114,31234,33825,36644,38000,39404],19:[24373,26298,27936,29915,32093,34756,37652,39045,40488],20:[25714,27600,29664,31604,33160,35711,38690,40124,41604],21:[25714,27600,29664,31604,33160,35711,38690,40124,41604],22:[28000,29800,31750,33850,35990,38810,40625,42131,43685],23:[30000,31737,33814,36050,38329,41333,43266,44870,46525],24:[31650,33483,35674,38034,40439,43607,45646,47338,49084],25:[32916,34823,37101,39556,42057,45352,47472,49232,51048],26:[34069,36042,38400,40941,43529,46940,49134,50956,52835],27:[35092,37124,39552,42170,44835,48349,50609,52485,54421]},
"Fringe":{10:[22626,24331,26203,28146,30278,32588,35116,36397,37725],11:[22626,24331,26203,28146,30278,32588,35116,36397,37725],12:[22626,24331,26203,28146,30278,32588,35116,36397,37725],13:[22852,24574,26465,28427,30581,32914,35467,36761,38102],14:[23081,24820,26730,28712,30887,33243,35822,37129,38483],15:[23312,25068,26997,28999,31196,33575,36180,37500,38868],16:[23545,25319,27267,29289,31508,33911,36542,37875,39257],17:[24016,25572,27540,29582,31823,34250,36907,38254,39650],18:[24857,26359,28062,30174,32300,34935,37645,39019,40443],19:[25541,27084,28834,31003,33189,35896,38681,40092,41555],20:[26948,28467,30630,32773,34367,36883,39745,41195,42698],21:[26948,28467,30630,32773,34367,36883,39745,41195,42698],22:[29344,31126,33055,35151,37264,40083,41858,43360,44919],23:[31252,33149,35204,37436,39686,42688,44579,46178,47839],24:[33075,34974,37141,39495,41870,45037,47031,48719,50471],25:[34398,36373,38627,41075,43545,46839,48913,50668,52490],26:[35602,37647,39979,42513,45070,48479,50625,52442,54328],27:[36671,38777,41179,43789,46423,49934,52144,54016,55958]},
"OLon":{10:[25117,26674,28325,30080,31868,34181,37461,38857,40285],11:[25117,26674,28325,30080,31868,34181,37461,38857,40285],12:[25117,26674,28325,30080,31868,34181,37461,38857,40285],13:[25368,26941,28608,30381,32187,34523,37836,39246,40688],14:[25622,27210,28894,30685,32509,34868,38214,39638,41095],15:[25878,27482,29183,30992,32834,35217,38596,40034,41506],16:[26137,27757,29475,31302,33162,35569,38982,40435,41921],17:[26660,28035,29770,31615,33494,35925,39372,40839,42340],18:[27593,28916,30366,32247,34024,36644,40159,41656,43187],19:[28352,29711,31201,33134,34960,37652,41264,42802,44375],20:[29911,31196,33168,34848,36173,38688,42399,43979,45596],21:[29911,31196,33168,34848,36173,38688,42399,43979,45596],22:[32407,34103,35886,37763,40050,43193,44687,46340,48055],23:[34513,36320,38219,40218,42653,46001,47592,49352,51179],24:[36413,38318,40322,42430,45000,48532,50210,52068,53994],25:[37870,39851,41935,44128,46800,50474,52219,54151,56154],26:[39196,41246,43403,45673,48438,52241,54047,56047,58120],27:[40372,42484,44706,47044,49892,53809,55669,57729,59864]},
"ILon":{10:[27000,28226,29535,31446,33865,36387,41497,42898,44360],11:[27000,28226,29535,31446,33865,36387,41497,42898,44360],12:[27000,28226,29535,31446,33865,36387,41497,42898,44360],13:[27270,28508,29830,31760,34204,36751,41912,43327,44804],14:[27543,28793,30129,32078,34546,37119,42331,43760,45252],15:[27818,29081,30430,32399,34891,37490,42754,44198,45705],16:[28096,29372,30734,32723,35240,37865,43182,44640,46162],17:[28658,29666,31041,33050,35592,38244,43614,45086,46624],18:[29664,30586,31702,33712,36146,39009,44486,45988,47557],19:[30480,31427,32573,34639,37140,40082,45710,47253,48865],20:[32157,33238,34564,36457,38363,41184,46967,48552,50211],21:[32157,33238,34564,36457,38363,41184,46967,48552,50211],22:[34502,36141,37857,39655,41892,44756,49320,51743,53482],23:[36745,38490,40318,42233,44615,47665,52526,55106,56958],24:[38766,40609,42536,44556,47069,50288,55415,58138,60092],25:[40317,42234,44238,46339,48952,52300,57632,60464,62496],26:[41729,43713,45787,47961,50666,54131,59650,62581,64684],27:[42981,45025,47161,49400,52186,55755,61440,64459,66625]}};
const PROJ_START=2026;
const RKEYS=["RoE","Fringe","OLon","ILon"];
const RNAMES={"RoE":"Rest of England","Fringe":"London Fringe","OLon":"Outer London","ILon":"Inner London"};
const PPS=["M1","M2","M3","M4","M5","M6","U1","U2","U3"];
const PP_C={M1:"#b91c1c",M2:"#ea580c",M3:"#ca8a04",M4:"#4d7c0f",M5:"#65a30d",M6:"#7c3aed",U1:"#0369a1",U2:"#c026d3",U3:"#0d9488"};
function gp(rk,yr,pi){return _R[rk][yr][pi];}
const YRS=Array.from({length:18},(_,i)=>2010+i);
const YK=y=>y-2000;
const INF_C={10:1.0,11:1.052,12:1.075,13:1.104,14:1.117,15:1.116,16:1.127,17:1.161,18:1.189,19:1.209,20:1.215,21:1.253,22:1.38,23:1.472,24:1.497,25:1.554,26:1.6084,27:1.6615};
const NMW_H={10:5.93,11:6.08,12:6.19,13:6.31,14:6.50,15:6.70,16:7.20,17:7.50,18:7.83,19:8.21,20:8.72,21:8.91,22:9.50,23:10.42,24:11.44,25:12.21,26:12.82,27:13.40};
const nmwA=yk=>NMW_H[yk]*37.5*52;
/* Average earnings: ONS AWE whole economy regular pay (KAI7, SA, £/week), September each year, deflated by ONS September CPI */
const AVG_E={10:0.0,11:-3.4,12:-4.1,13:-6.0,14:-5.6,15:-3.6,16:-2.1,17:-2.9,18:-2.2,19:-0.3,20:2.2,21:3.3,22:-0.6,23:0.3,24:3.7,25:4.5};
const GOV=[{s:2010,e:2015,l:"Coalition",c:"#2E8B57"},{s:2015,e:2024,l:"Conservative",c:"#0087DC"},{s:2024,e:2029,l:"Labour",c:"#DC241F"}];

/* ═══ STYLE — bold explainer look (shared across the three tools) ═══ */
const INK="#0E1A3D",BLUE="#2563B0",RED="#E0302B",GREEN="#047857",MUTE="#5B6478";
const HEAD="'Anton','Impact','Arial Narrow Bold',sans-serif";
const S="'Source Sans 3',system-ui,-apple-system,sans-serif";
const FONTS="@import url('https://fonts.googleapis.com/css2?family=Anton&family=Source+Sans+3:wght@400;600;700&display=swap');";
const fmt=v=>"£"+Math.round(v).toLocaleString("en-GB");
const pc=v=>(v>=0?"+":"−")+Math.abs(v).toFixed(1)+"%";
function realG(b,n,c){return((n/(b*c))-1)*100;}

const Pill=({a,onClick,children,c})=><button onClick={onClick} style={{padding:"7px 14px",borderRadius:999,fontSize:14,fontWeight:a?700:600,fontFamily:S,border:`2px solid ${a?(c||INK):"#d5dbe6"}`,background:a?(c||INK):"#fff",color:a?"#fff":INK,cursor:"pointer",whiteSpace:"nowrap"}}>{children}</button>;
const Lab=({children})=><div style={{fontSize:14,fontWeight:700,color:MUTE,marginBottom:6}}>{children}</div>;
const Card=({children,style})=><div style={{background:"#fff",borderRadius:6,padding:"14px 18px",...style}}>{children}</div>;
const Tip=({active,payload,label,f})=>{if(!active||!payload?.length)return null;return(<div style={{background:"#fff",border:`2px solid ${INK}`,borderRadius:4,padding:"10px 14px",fontSize:13,lineHeight:1.6,fontFamily:S,color:INK}}><div style={{fontFamily:HEAD,fontSize:20}}>September {label}</div>{payload.filter(p=>p.value!=null).map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:16}}><span style={{color:p.stroke}}>{p.name}</span><b>{f(p.value)}</b></div>)}</div>);};
/* end-of-line label; dy nudges labels apart when lines finish close together */
const EndLabel=(text,color,last,dy,f)=>props=>{const{x,y,index,value}=props;if(index!==last)return null;return <text x={x+8} y={y+dy} fill={color} fontSize={13} fontWeight={700} fontFamily={S} dominantBaseline="middle">{text} {f(value)}</text>;};
function spread(items,range,px,gap){ // items:[{k,v}] -> {k:dyPx}
  const s=[...items].sort((a,b)=>b.v-a.v),out={};let prev=null;
  s.forEach(it=>{let y=(1-(it.v-range[0])/(range[1]-range[0]))*px;if(prev!==null&&y-prev<gap)y=prev+gap;out[it.k]=y-(1-(it.v-range[0])/(range[1]-range[0]))*px;prev=y;});return out;}

export default function App(){
  const[tab,setTab]=useState("earnings");
  const[eRk,setERk]=useState("RoE");
  const[ePP,setEPP]=useState(new Set(["M1","M6","U3"]));
  const[sAE,setSAE]=useState(true);
  const tEP=k=>{const s=new Set(ePP);s.has(k)?s.delete(k):s.add(k);setEPP(s);};
  const[nRk,setNRk]=useState("RoE");
  const[w,setW]=useState(typeof window!=="undefined"?window.innerWidth:900);
  useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);
  useEffect(()=>{const send=()=>{if(window.parent!==window)window.parent.postMessage({edaptToolHeight:document.documentElement.scrollHeight},"*");};const ro=new ResizeObserver(send);ro.observe(document.body);send();return()=>ro.disconnect();},[]); // tells the blog page how tall the tool is
  const nar=w<600;
  const maxY=2025,yk=YK(maxY),YS=YRS.filter(y=>y<=maxY),LI=YS.length-1;
  const ticks=nar?YS.filter(y=>(y-2010)%5===0):YS;

  const eD=useMemo(()=>YS.map(y=>{const k=YK(y);const r={year:y};PPS.forEach((p,i)=>{r[p]=realG(gp(eRk,10,i),gp(eRk,k,i),INF_C[k]);});r.avgE=AVG_E[k];return r;}),[eRk]);
  const nD=useMemo(()=>YS.map(y=>{const k=YK(y);return{year:y,m1:gp(nRk,k,0)/nmwA(k),m6:gp(nRk,k,5)/nmwA(k)};}),[nRk]);
  const nS=useMemo(()=>{const r10=gp(nRk,10,0)/nmwA(10),rN=gp(nRk,yk,0)/nmwA(yk),r10m6=gp(nRk,10,5)/nmwA(10),rNm6=gp(nRk,yk,5)/nmwA(yk);const hM1=r10*nmwA(yk),hM6=r10m6*nmwA(yk);return{r10,rN,r10m6,rNm6,hM1,hM6,aM1:gp(nRk,yk,0),aM6:gp(nRk,yk,5),nN:nmwA(yk),n10:nmwA(10),gM1:hM1-gp(nRk,yk,0),gM6:hM6-gp(nRk,yk,5),m1R:(gp(nRk,yk,0)/gp(nRk,10,0)-1)*100,m6R:(gp(nRk,yk,5)/gp(nRk,10,5)-1)*100};},[nRk]);
  const sel=PPS.filter(p=>ePP.has(p));
  const H=nar?340:420,PLOT=H-60;
  const eDy=useMemo(()=>spread([...sel.map(p=>({k:p,v:eD[LI][p]})),...(sAE?[{k:"avgE",v:eD[LI].avgE}]:[])],[-15,10],PLOT,17),[eD,ePP,sAE,H]);
  const ae=AVG_E[yk];

  const head=(q,sub)=><><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap",marginBottom:6}}>
      <h1 style={{fontFamily:HEAD,fontWeight:400,fontSize:"clamp(30px,6.5vw,52px)",lineHeight:1.05,margin:0,flex:"1 1 480px"}}>{q}</h1>
      <div style={{fontSize:14,paddingTop:8}}>{tab==="earnings"?"Source: DfE / ONS":"Source: DfE / HM Government"}</div>
    </div><div style={{fontSize:"clamp(16px,2.6vw,20px)",marginBottom:16}}>{sub}</div></>;

  return(<div style={{fontFamily:S,maxWidth:900,margin:"0 auto",padding:"24px 18px 28px",color:INK,background:"linear-gradient(160deg,#ffffff 0%,#eef2f8 55%,#e3e9f3 100%)"}}>
    <style>{FONTS}</style>
    <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{[["earnings","Average earnings"],["nmw","Minimum wage"]].map(([k,l])=><Pill key={k} a={tab===k} onClick={()=>setTab(k)}>Compared with {l.toLowerCase()}</Pill>)}</div>

    {tab==="earnings"&&<>
      {head("Has teacher pay kept up with average earnings?",`Change in pay since 2010 after CPI inflation: teacher pay points and average UK earnings, ${RNAMES[eRk]}`)}
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:14,alignItems:"flex-end"}}>
        <div><Lab>Pay points</Lab><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{PPS.map(p=><Pill key={p} a={ePP.has(p)} c={PP_C[p]} onClick={()=>tEP(p)}>{p}</Pill>)}<Pill a={sAE} onClick={()=>setSAE(v=>!v)}>Average earnings</Pill></div></div>
        <div><Lab>Region</Lab><select value={eRk} onChange={e=>setERk(e.target.value)} style={{padding:"8px 12px",borderRadius:6,border:"2px solid #d5dbe6",fontSize:15,fontFamily:S,fontWeight:600,color:INK,background:"#fff"}}>{RKEYS.map(r=><option key={r} value={r}>{RNAMES[r]}</option>)}</select></div>
      </div>
      <div style={{background:"rgba(255,255,255,.75)",borderRadius:6,padding:"10px 4px 4px 0"}}>
        <ResponsiveContainer width="100%" height={H}>
          <ComposedChart data={eD} margin={{top:14,right:nar?104:128,bottom:6,left:0}}>
            <CartesianGrid stroke="#d9dfea" vertical={false}/>
            {!nar&&GOV.map((p,i)=><ReferenceArea key={i} x1={p.s} x2={Math.min(p.e,maxY)} fill={i%2?"#c9d3e3":"#e4e9f2"} fillOpacity={.4}/>)}
            <ReferenceLine y={0} stroke={INK} strokeWidth={2} label={nar?undefined:{value:"2010 level",position:"insideBottomLeft",fill:INK,fontSize:13,fontWeight:700}}/>
            <XAxis dataKey="year" type="number" domain={[2010,maxY]} ticks={ticks} interval={0} tick={{fontSize:13,fill:INK}} tickFormatter={v=>"'"+String(v).slice(-2)} stroke={INK} tickLine={false}/>
            <YAxis tick={{fontSize:13,fill:INK}} tickFormatter={v=>(v>0?"+":"")+v+"%"} axisLine={false} tickLine={false} width={46} domain={[-15,10]} ticks={[-15,-10,-5,0,5,10]}/>
            <Tooltip content={<Tip f={pc}/>} cursor={{stroke:INK,strokeWidth:1.5,strokeDasharray:"4 3"}}/>
            {sel.map(p=><Line key={p} type="linear" dataKey={p} name={p} stroke={PP_C[p]} strokeWidth={3.5} dot={false} activeDot={{r:5,fill:PP_C[p],stroke:"#fff",strokeWidth:2}} isAnimationActive={false} label={EndLabel(p,PP_C[p],LI,eDy[p]||0,pc)}/>)}
            {sAE&&<Line type="linear" dataKey="avgE" name="Average earnings" stroke={INK} strokeWidth={4} strokeDasharray="10 5" dot={false} activeDot={{r:5,fill:INK,stroke:"#fff",strokeWidth:2}} isAnimationActive={false} label={EndLabel(nar?"Avg":"Average",INK,LI,eDy.avgE||0,pc)}/>}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {sAE&&sel.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginTop:14}}>
        {sel.map(p=>{const v=eD[LI][p],d=v-ae;return <Card key={p} style={{borderTop:`5px solid ${PP_C[p]}`}}>
          <Lab>{p} since 2010, after CPI</Lab>
          <div style={{fontFamily:HEAD,fontSize:"clamp(30px,6vw,40px)",lineHeight:1,color:v>=0?GREEN:RED}}>{pc(v)}</div>
          <div style={{fontSize:13.5,color:MUTE,marginTop:6}}>Average earnings {pc(ae)}: a difference of <b style={{color:INK}}>{Math.abs(d).toFixed(1)} percentage points</b> {d>=0?"above":"below"} average earnings growth</div>
        </Card>;})}
      </div>}
      <p style={{fontSize:13,color:MUTE,lineHeight:1.55,margin:"14px 0 0"}}>The Government notes that average earnings growth has been lifted by large minimum wage rises at the lower end, and that pay in professional occupations has grown more slowly than the average. Average earnings in 2020–21 were also raised temporarily by job losses being concentrated among lower-paid workers.</p>
    </>}

    {tab==="nmw"&&<>
      {head("How does teacher pay compare with the minimum wage?",`Teacher salary as a multiple of full-time minimum wage earnings, ${RNAMES[nRk]}`)}
      <div style={{marginBottom:14}}><Lab>Region</Lab><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{RKEYS.map(r=><Pill key={r} a={nRk===r} onClick={()=>setNRk(r)}>{RNAMES[r]}</Pill>)}</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginBottom:14}}>
        {[["New teacher (M1)",nS.r10,nS.rN,BLUE],["Experienced teacher (M6)",nS.r10m6,nS.rNm6,INK]].map(([l,a,b,c])=><Card key={l} style={{borderTop:`5px solid ${c}`}}><Lab>{l}</Lab><div style={{fontFamily:HEAD,fontSize:"clamp(30px,6vw,40px)",lineHeight:1,color:c}}>{a.toFixed(2)}× → {b.toFixed(2)}×</div><div style={{fontSize:13.5,color:MUTE,marginTop:6}}>Multiple of minimum wage earnings, 2010 → {maxY}</div></Card>)}
      </div>
      <div style={{background:"rgba(255,255,255,.75)",borderRadius:6,padding:"10px 4px 4px 0"}}>
        <ResponsiveContainer width="100%" height={nar?320:380}>
          <ComposedChart data={nD} margin={{top:14,right:nar?118:150,bottom:6,left:0}}>
            <CartesianGrid stroke="#d9dfea" vertical={false}/>
            {!nar&&GOV.map((p,i)=><ReferenceArea key={i} x1={p.s} x2={Math.min(p.e,maxY)} fill={i%2?"#c9d3e3":"#e4e9f2"} fillOpacity={.4}/>)}
            <XAxis dataKey="year" type="number" domain={[2010,maxY]} ticks={ticks} interval={0} tick={{fontSize:13,fill:INK}} tickFormatter={v=>"'"+String(v).slice(-2)} stroke={INK} tickLine={false}/>
            <YAxis tick={{fontSize:13,fill:INK}} tickFormatter={v=>v.toFixed(1)+"×"} axisLine={false} tickLine={false} width={42} domain={[1,3.5]} ticks={[1,1.5,2,2.5,3,3.5]}/>
            <Tooltip content={<Tip f={v=>v.toFixed(2)+"×"}/>} cursor={{stroke:INK,strokeWidth:1.5,strokeDasharray:"4 3"}}/>
            <Line type="linear" dataKey="m6" name="Experienced (M6)" stroke={INK} strokeWidth={4} dot={false} activeDot={{r:5,fill:INK,stroke:"#fff",strokeWidth:2}} isAnimationActive={false} label={EndLabel(nar?"M6":"Experienced (M6)",INK,LI,-4,v=>v.toFixed(2)+"×")}/>
            <Line type="linear" dataKey="m1" name="New teacher (M1)" stroke={BLUE} strokeWidth={4} dot={false} activeDot={{r:5,fill:BLUE,stroke:"#fff",strokeWidth:2}} isAnimationActive={false} label={EndLabel(nar?"M1":"New teacher (M1)",BLUE,LI,4,v=>v.toFixed(2)+"×")}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10,marginTop:14}}>
        {[["New teacher (M1)",nS.hM1,nS.gM1,nS.aM1],["Experienced teacher (M6)",nS.hM6,nS.gM6,nS.aM6]].map(([l,hyp,g,act])=><Card key={l} style={{borderLeft:`5px solid ${g>0?RED:GREEN}`}}>
          <Lab>{l}: if pay had risen with the minimum wage</Lab>
          <div style={{fontFamily:HEAD,fontSize:"clamp(28px,5vw,38px)",lineHeight:1,color:g>0?RED:GREEN}}>{fmt(Math.abs(g))}<span style={{fontFamily:S,fontSize:15,fontWeight:600,color:MUTE}}> a year {g>0?"less":"more"}</span></div>
          <div style={{fontSize:13.5,color:MUTE,marginTop:6}}>Pay would be {fmt(hyp)} in {maxY}, compared with {fmt(act)}.</div>
        </Card>)}
      </div>
      <p style={{fontSize:13,color:MUTE,lineHeight:1.55,margin:"14px 0 0"}}>Since 2010 the minimum wage for adults has risen by {(((nS.nN/nS.n10)-1)*100).toFixed(0)}%. Over the same period M1 pay has risen by {nS.m1R.toFixed(0)}% and M6 pay by {nS.m6R.toFixed(0)}% ({RNAMES[nRk]}). Minimum wage earnings assume 37.5 hours a week, 52 weeks a year.</p>
    </>}

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,borderTop:"1px solid #cfd6e3",marginTop:16,paddingTop:10}}>
      <div style={{fontSize:11.5,color:MUTE,flex:1}}>{tab==="earnings"?"DfE School Teachers’ Pay and Conditions Document (STPCD) advisory pay points, deflated by ONS September CPI; ONS Average Weekly Earnings, whole economy regular pay (series KAI7), September each year. Edapt analysis.":"DfE School Teachers’ Pay and Conditions Document (STPCD) advisory pay points; HM Government National Minimum/Living Wage rates. Edapt analysis."}</div>
      <a href="https://www.edapt.org.uk" target="_blank" rel="noopener noreferrer" style={{flexShrink:0,lineHeight:0}}><img src="/edapt-logo.png" alt="Edapt" style={{height:nar?26:32,width:"auto",display:"block"}}/></a>
    </div>
  </div>);
}
