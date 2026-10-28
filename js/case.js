(function(){
var slug=new URLSearchParams(location.search).get('p')||'',st=document.getElementById('stack'),main=document.getElementById('cs'),e=CMS.esc;
function fail(){if(slug==='beachhub'||slug==='yandex-pet-day'){location.replace('cases/'+slug+'.html');return}st.innerHTML='<p class="lead" style="padding:64px var(--pad)">Не удалось загрузить кейс.</p>'}
var G='{"p":*[_type=="project"&&slug.current==$s][0]{title,bg,behanceUrl,"blocks":caseBlocks[]{_type,"img":image.asset->{url,"w":metadata.dimensions.width,"h":metadata.dimensions.height},"vid":file.asset->url,narrow,url}},"s":*[_id=="settings"][0]{telegram}}';
CMS.q(G,{s:slug}).then(function(d){var p=d.p;if(!p||!p.blocks||!p.blocks.length)return fail();
document.title=p.title+': кейс | VIDIPROK';if(p.bg){main.style.background=p.bg;var m=/^#([0-9a-f]{6})$/i.exec(p.bg);if(m){var n=parseInt(m[1],16),lum=((n>>16)*299+((n>>8)&255)*587+(n&255)*114)/1000;main.classList.toggle('light',lum>150)}}
function im(b,i){return'<img src="'+e(b.img.url)+'?auto=format" width="'+b.img.w+'" height="'+b.img.h+'" alt="'+e(p.title)+'"'+(i?' loading="lazy"':'')+'>'}
st.innerHTML=p.blocks.map(function(b,i){
if(b._type==='caseImage'&&b.img)return im(b,i);
if(b._type==='caseVideo'&&b.vid)return'<video'+(b.narrow?' class="vid"':'')+' src="'+e(b.vid)+'" autoplay muted loop playsinline preload="auto"></video>';
if(b._type==='caseEmbed'&&/^https:\/\//.test(b.url||''))return'<div class="emb"><iframe src="'+e(b.url)+'" allow="'+'autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;'+'" frameborder="0" allowfullscreen loading="lazy"></iframe></div>';
if(b._type==='caseBanner'&&b.img)return b.url?'<a class="fg" href="'+e(b.url)+'" target="_blank" rel="noopener">'+im(b,i)+'</a>':im(b,i);
return''}).join('');
var tg=(d.s&&d.s.telegram)||'https://t.me/vikaprokkk';
document.getElementById('btns').innerHTML='<a class="btn p" href="'+e(tg)+'" target="_blank" rel="noopener">Обсудить проект</a>'+(p.behanceUrl?'<a class="btn" href="'+e(p.behanceUrl)+'" target="_blank" rel="noopener">Кейс на Behance</a>':'')+'<a class="btn" href="index.html#projects">Все проекты</a>';
st.querySelectorAll('video').forEach(function(v){if(!('IntersectionObserver' in window))return;new IntersectionObserver(function(x){x[0].isIntersecting?v.play().catch(function(){}):v.pause()},{threshold:.1}).observe(v)})
}).catch(fail)})();
