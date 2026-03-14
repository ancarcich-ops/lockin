import fs from 'fs';
import zlib from 'zlib';
const S=512;
const px=new Uint8Array(S*S*4);
const cx=S/2,cy=S/2;
// Helper: set pixel
const set=(x,y,r,g,b)=>{if(x<0||x>=S||y<0||y>=S)return;const i=(y*S+x)*4;px[i]=r;px[i+1]=g;px[i+2]=b;px[i+3]=255;};
// Fill navy background #0f1526
for(let i=0;i<S*S;i++){px[i*4]=15;px[i*4+1]=21;px[i*4+2]=38;px[i*4+3]=255;}
// Rounded rect mask (radius 100) - dark corners
const R=100;
for(let y=0;y<S;y++)for(let x=0;x<S;x++){
  const inCorner=(x<R&&y<R&&(x-R)**2+(y-R)**2>R*R)||(x>S-R&&y<R&&(x-(S-R))**2+(y-R)**2>R*R)||(x<R&&y>S-R&&(x-R)**2+(y-(S-R))**2>R*R)||(x>S-R&&y>S-R&&(x-(S-R))**2+(y-(S-R))**2>R*R);
    if(inCorner){const i=(y*S+x)*4;px[i]=0;px[i+1]=0;px[i+2]=0;px[i+3]=0;}
    }
    // Draw thick circle - stroke width w, radius r, color
    const drawCircle=(cr,w,r,g,b)=>{
      for(let y=0;y<S;y++)for(let x=0;x<S;x++){
          const d=Math.sqrt((x-cx)**2+(y-cy)**2);
              if(Math.abs(d-cr)<=w/2)set(x,y,r,g,b);
                }
                };
                // Outer circle: bright blue #4d9ef7, radius 195, width 10
                drawCircle(195,10,77,158,247);
                // Inner circle: lighter blue #7ab8f5, radius 120, width 8
                drawCircle(120,8,110,180,245);
                // Crosshair color: #4d9ef7
                const chR=77,chG=158,chB=247;
                const thick=10; // crosshair line thickness
                const gap=30;   // gap around center
                const seg=60;   // tick segment length
                // Horizontal crosshair: left side full, right side full, with center gap
                for(let x=0;x<S;x++){
                  const dx=Math.abs(x-cx);
                    if(dx<gap||dx>195+15)continue;
                      for(let t=-thick/2;t<=thick/2;t++)set(x,Math.round(cy+t),chR,chG,chB);
                      }
                      // Vertical crosshair
                      for(let y=0;y<S;y++){
                        const dy=Math.abs(y-cy);
                          if(dy<gap||dy>195+15)continue;
                            for(let t=-thick/2;t<=thick/2;t++)set(Math.round(cx+t),y,chR,chG,chB);
                            }
                            // Tick marks at cardinal points (just outside outer circle)
                            const tickStart=195+8,tickEnd=195+seg;
                            for(let d=tickStart;d<=tickEnd;d++){
                              for(let t=-thick/2;t<=thick/2;t++){
                                  set(Math.round(cx+t),Math.round(cy-d),chR,chG,chB);
                                      set(Math.round(cx+t),Math.round(cy+d),chR,chG,chB);
                                          set(Math.round(cx-d),Math.round(cy+t),chR,chG,chB);
                                              set(Math.round(cx+d),Math.round(cy+t),chR,chG,chB);
                                                }
                                                }
                                                // Yellow center dot radius 22
                                                for(let y=0;y<S;y++)for(let x=0;x<S;x++){
                                                  if((x-cx)**2+(y-cy)**2<=22**2)set(x,y,255,210,0);
                                                  }
                                                  // Build PNG
                                                  function crc32(b){let c=0xFFFFFFFF;for(const v of b){c^=v;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);}return(c^0xFFFFFFFF)>>>0;}
                                                  function chunk(t,d){const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const tb=Buffer.from(t);const c=Buffer.alloc(4);c.writeUInt32BE(crc32(Buffer.concat([tb,d])));return Buffer.concat([l,tb,d,c]);}
                                                  const sig=Buffer.from([137,80,78,71,13,10,26,10]);
                                                  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(S,0);ihdr.writeUInt32BE(S,4);ihdr[8]=8;ihdr[9]=6;
                                                  const raw=[];
                                                  for(let y=0;y<S;y++){raw.push(0);for(let x=0;x<S;x++){const i=(y*S+x)*4;raw.push(px[i],px[i+1],px[i+2],px[i+3]);}}
                                                  const idat=zlib.deflateSync(Buffer.from(raw));
                                                  const png=Buffer.concat([sig,chunk('IHDR',ihdr),chunk('IDAT',idat),chunk('IEND',Buffer.alloc(0))]);
                                                  fs.writeFileSync('public/apple-touch-icon.png',png);
                                                  console.log('Done! size:'+png.length);