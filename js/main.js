
var nv=document.querySelector('.nav'),bg=nv.querySelector('.burger');
bg.addEventListener('click',function(){var o=nv.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
nv.querySelectorAll('ul a').forEach(function(a){a.addEventListener('click',function(){nv.classList.remove('open');bg.setAttribute('aria-expanded',false)})});
document.querySelectorAll('.sv').forEach(function(c){var b=c.querySelector('.hd'),d=c.querySelector('.bd');d.inert=true;b.addEventListener('click',function(){var o=!c.classList.contains('open');document.querySelectorAll('.sv.open').forEach(function(x){x.classList.remove('open');x.querySelector('.hd').setAttribute('aria-expanded',false);x.querySelector('.bd').inert=true});if(o){c.classList.add('open');b.setAttribute('aria-expanded',true);d.inert=false}})});
(function(){if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add('in');io.unobserve(el);if(!el.matches('.quote'))setTimeout(function(){el.classList.remove('rv','in');el.style.transitionDelay=''},1300)})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('h2,.proj,.stats>div,.about>div>p,.about .btn,.duo,.sv,.strip,.quote,.note,.row,.st,details,.links,.cont p,.frm,.sol>div,.meta,.lead,.txt').forEach(function(el){el.classList.add('rv');el.style.transitionDelay=Math.min([].indexOf.call(el.parentNode.children,el),5)*90+'ms';io.observe(el)})})();
document.addEventListener('click',function(e){if(nv.classList.contains('open')&&!e.target.closest('#menu')&&!e.target.closest('.burger')){nv.classList.remove('open');bg.setAttribute('aria-expanded',false)}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){nv.classList.remove('open');bg.setAttribute('aria-expanded',false)}});
var mb=document.getElementById('more'),cards=Array.prototype.slice.call(document.querySelectorAll('#projects .grid2>.proj')),projectMedia=matchMedia('(max-width:1024px)');
function resetProjects(){var compact=projectMedia.matches;cards.forEach(function(el,i){if(compact){el.hidden=false;el.classList.toggle('compact-visible',i<4)}else{el.classList.remove('compact-visible');el.hidden=i>=6}});mb.setAttribute('aria-expanded','false');mb.textContent='Посмотреть все'}
mb&&mb.addEventListener('click',function(){var o=mb.getAttribute('aria-expanded')!=='true',compact=projectMedia.matches;cards.forEach(function(el,i){if(compact){el.hidden=false;el.classList.toggle('compact-visible',o||i<4)}else{el.classList.remove('compact-visible');el.hidden=!o&&i>=6}});mb.setAttribute('aria-expanded',o);mb.textContent=o?'Скрыть':'Посмотреть все';if(!o)mb.scrollIntoView({block:'center',behavior:'smooth'})});
if(projectMedia.addEventListener)projectMedia.addEventListener('change',resetProjects);else projectMedia.addListener(resetProjects);
resetProjects();
var ps=document.querySelectorAll('[data-p]');
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){addEventListener('scroll',function(){ps.forEach(function(el){var r=el.getBoundingClientRect(),d=(r.top-innerHeight/2)*.06*el.dataset.p;el.style.transform='translateY('+d+'px)'})},{passive:true})}
