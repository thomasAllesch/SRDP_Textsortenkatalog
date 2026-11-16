'use strict';
const $=s=>document.querySelector(s);
const topNames={sach:'Sachtexte',literatur:'Literarische Texte'};
const items=window.ITEMS||[], categories=window.CATEGORIES||{};
let filter='all',search='';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=id=>'t-'+String(id).replace(/[^a-z0-9-]/gi,'');
const searchBlob=x=>[x.name,x.category,x.definition,x.purpose,x.structure,x.language,x.analysis,x.length,x.intro,x.body,x.end].join(' ').toLocaleLowerCase('de');
function matches(x){return (filter==='all'||(filter==='srdp'&&x.srdp)||(filter==='writing'&&x.writing)||(filter===x.top))&&searchBlob(x).includes(search);}
function row(title,value){return value?`<div class="detail-row"><b>${esc(title)}</b><p>${esc(value)}</p></div>`:'';}
function render(){
 const matching=items.filter(matches);
 $('#count-pill').textContent=items.length+' Textsorten';
 $('#empty').hidden=matching.length>0;
 let overview='',details='';
 for(const top of ['sach','literatur']){
  const relevant=matching.filter(x=>x.top===top);if(!relevant.length)continue;
  overview+=`<div class="superhead"><h3>${topNames[top]}</h3><span>${relevant.length} Textsorten</span></div>`;
  for(const category of categories[top]||[]){
   const group=relevant.filter(x=>x.category===category);if(!group.length)continue;
   overview+=`<section class="category"><div class="category-header"><h4>${esc(category)}</h4><small>${group.length} Einträge</small></div><div class="chips">${group.map(x=>`<a class="chip ${x.srdp?'chip-srdp':''}" href="#${slug(x.id)}"><span>${esc(x.name)}${x.srdp?'<small class="sr-tag">SRDP · Schreiben</small>':x.writing?'<small class="sr-tag extra">Schulische Schreibform</small>':''}</span><i>↗</i></a>`).join('')}</div></section>`;
  }
 }
 for(const x of matching){
  const writing=x.writing;
  let rows=writing?
   row('Definition',x.definition)+row('Ziel',x.purpose)+row('Textlänge',x.length)+row('Sprache',x.language)+row('Einleitung',x.intro)+row('Hauptteil',x.body)+row('Schluss',x.end)+row('Bei einer Analyse / Interpretation erkennen',x.analysis):
   row('Definition',x.definition)+row('Ziel / Funktion',x.purpose)+row('Typischer Aufbau',x.structure)+row('Sprache & Erkennungsmerkmale',x.language)+row('Bei der Analyse beachten',x.analysis);
  details+=`<article id="${slug(x.id)}" class="detail-card ${writing?'writing-card':''}"><div class="meta">${esc(topNames[x.top])} / ${esc(x.category)}</div><h3>${esc(x.name)}</h3>${writing?`<div class="writing-label ${x.srdp?'official':'school'}">${esc(x.writing_note)}</div>`:''}${rows}${writing?`<p class="source-note">${esc(x.rules_source)}</p>`:''}<a class="backlink" href="#uebersicht">↑ Zur Übersicht</a></article>`;
 }
 $('#overview').innerHTML=overview;$('#details').innerHTML=details;$('#details-title').hidden=!matching.length;
 $('#result-count').textContent=matching.length+' Ergebnisse';
}
$('#search').addEventListener('input',e=>{search=e.target.value.toLocaleLowerCase('de').trim();render();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
 filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b));});render();
}));
render();
if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)target.scrollIntoView();}
