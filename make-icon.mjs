import fs from 'fs';
import zlib from 'zlib';
const W=512,H=512;
const px=new Uint8Array(W*H*4);
for(let i=0;i<W*H;i++){px[i*4]=10;px[i*4+1]=10;px[i*4+2]=10;px[i*4+3]=255;}
const cx=W/2,cy=H/2;
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const dx=x-cx,dy=y-cy,r=Math.sqrt(dx*dx+dy*dy);
    if([80,160,240].some(R=>Math.abs(r-R)<3)){const i=(y*W+x)*4;px[i]=30;px[i+1]=144;px[i+2]=255;px[i+3]=255;}
    }
    for(let x=0;x<W;x++){const i=(Math.round(cy)*W+x)*4;px[i]=30;px[i+1]=144;px[i+2]=255;px[i+3]=255;}
    for(let y=0;y<H;y++){const i=(y*W+Math.round(cx))*4;px[i]=30;px[i+1]=144;px[i+2]=255;px[i+3]=255;}
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const dx=x-cx,dy=y-cy;if(dx*dx+dy*dy<144){const i=(y*W+x)*4;px[i]=255;px[i+1]=215;px[i+2]=0;px[i+3]=255;}}
    function crc32(b){let c=0xFFFFFFFF;for(const v of b){c^=v;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);}return(c^0xFFFFFFFF)>>>0;}
    function chunk(t,d){const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const tb=Buffer.from(t);const c=Buffer.alloc(4);c.writeUInt32BE(crc32(Buffer.concat([tb,d])));return Buffer.concat([l,tb,d,c]);}
    const sig=Buffer.from([137,80,78,71,13,10,26,10]);
    const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);ihdr[8]=8;ihdr[9]=2;
    const raw=[];
    for(let y=0;y<H;y++){raw.push(0);for(let x=0;x<W;x++){const i=(y*W+x)*4;raw.push(px[i],px[i+1],px[i+2]);}}
    const idat=zlib.deflateSync(Buffer.from(raw));
    const png=Buffer.concat([sig,chunk('IHDR',ihdr),chunk('IDAT',idat),chunk('IEND',Buffer.alloc(0))]);
    fs.writeFileSync('public/apple-touch-icon.png',png);
    console.log('Done! apple-touch-icon.png size: '+png.length+' bytes');