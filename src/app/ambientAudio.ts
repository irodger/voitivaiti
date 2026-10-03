export function createAmbientAudio(factory:()=>AudioContext){
 let context:AudioContext|undefined,master:GainNode|undefined,timer:ReturnType<typeof setInterval>|undefined,fade:ReturnType<typeof setTimeout>|undefined;
 let enabled=true,visible=true,disposed=false,unlocked=false,chord=0,scene:'office'|'calm'='calm';
 let office:GainNode|undefined,noise:AudioBufferSourceNode|undefined,filter:BiquadFilterNode|undefined;
 const mix=()=>{if(!context)return;master?.gain.setTargetAtTime(scene==='calm'?.16:0,context.currentTime,.8);office?.gain.setTargetAtTime(scene==='office'?.18:0,context.currentTime,.8);};
 const voices:OscillatorNode[]=[],gains:GainNode[]=[];
 const chords=[[261.63,329.63,392],[293.66,349.23,440],[261.63,349.23,523.25],[293.66,392,493.88]];
 const quiet=()=>{if(!context||!master)return;master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(0,context.currentTime,.08);office?.gain.cancelScheduledValues(context.currentTime);office?.gain.setTargetAtTime(0,context.currentTime,.08);};
 const stop=()=>{if(timer)clearInterval(timer);timer=undefined;if(fade)clearTimeout(fade);quiet();if(context)fade=setTimeout(()=>{void context?.suspend().catch(()=>{});},350);};
 const play=()=>{
  if(disposed||!enabled||!visible||!unlocked)return;
  try{
   if(!context){context=factory();master=context.createGain();master.gain.value=0;master.connect(context.destination);
    office=context.createGain();office.gain.value=0;office.connect(context.destination);
    const buffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate),data=buffer.getChannelData(0);let tap=0;for(let i=0;i<data.length;i++){if(Math.random()<7/context.sampleRate)tap=.65;tap*=Math.exp(-1/(context.sampleRate*.018));data[i]=(Math.random()*2-1)*(.025+tap);}
    noise=context.createBufferSource();noise.buffer=buffer;noise.loop=true;filter=context.createBiquadFilter();filter.type='highpass';filter.frequency.value=450;noise.connect(filter);filter.connect(office);noise.start();
    chords[0].forEach((frequency,i)=>{const voice=context!.createOscillator(),gain=context!.createGain();voice.type='sine';voice.frequency.value=frequency;voice.detune.value=i===1?3:-2;gain.gain.value=i===0?.25:0;voice.connect(gain);gain.connect(master!);voice.start();voices.push(voice);gains.push(gain);});
   }
   if(fade)clearTimeout(fade);
   void context.resume().then(()=>{if(disposed||!enabled||!visible){stop();return;}mix();}).catch(()=>{});
   if(!timer)timer=setInterval(()=>{if(!context||!enabled||!visible)return;chord++;voices.forEach((voice,i)=>{voice.frequency.setTargetAtTime(chords[Math.floor(chord/3)%chords.length][i],context!.currentTime,.05);gains[i].gain.setTargetAtTime(i===chord%3?.25:0,context!.currentTime,i===chord%3?.12:1.4);});},2400);
  }catch{stop();}
 };
 return {
  gesture(){unlocked=true;play();},
  configure(sound:boolean,shown:boolean,place:'office'|'calm'='calm'){if(enabled===sound&&visible===shown&&scene===place)return;enabled=sound;visible=shown;scene=place;if(!enabled||!visible)stop();else play();},
  dispose(){disposed=true;stop();if(fade)clearTimeout(fade);voices.forEach(v=>{v.stop();v.disconnect();});gains.forEach(g=>g.disconnect());noise?.stop();noise?.disconnect();filter?.disconnect();office?.disconnect();master?.disconnect();void context?.close().catch(()=>{});},
 };
}
