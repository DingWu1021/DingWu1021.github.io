const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = value => Number(value).toFixed(2);
const taskCache = new Map();
let state, featuredIndex = 0, caseId = 'S1', ablationMetric = 'accuracy', expandedResults = false;
let toastTimer, currentTaskRequest = 0;

const featured = [
  {id:168,short:'Repair guides',title:'Find every code-bearing repair guide.',summary:'Identify a device from its internal structure, then inspect every official repair-guide cover for a visible QR code or other 2D machine-readable code.',challenge:'Cover the complete official guide set and keep each visual judgment linked to the guide’s metadata.'},
  {id:15,short:'Storage media',title:'Every object needs the right station.',summary:'Identify the removable storage media in a photo. Determine the reader or interface each one requires, then assign it to the appropriate digitization station.',challenge:'Preserve the link between each object, its reading mechanism, and its final classification.'},
  {id:75,short:'Player & portraits',title:'A player, a candidate set, a visual filter.',summary:'Identify a professional player, collect the champions used in the specified 2024 matches, inspect their portraits, and calculate kills for the qualifying Assassin champions.',challenge:'Connect a broad candidate search to visual filtering and a later, narrower statistics lookup.'},
  {id:20,short:'Museum catalog',title:'Find the figures hidden in a collection.',summary:'Inspect all captioned objects with accession numbers in the first five sections of a museum publication. Determine which instruments visibly depict human or animal figures.',challenge:'Return a complete hit/miss list. The task begins with text; the evidence is in images retrieved during search.'},
  {id:175,short:'Seating chart',title:'Let the image determine the route.',summary:'Follow the outermost ring of a Senate seating chart, beginning at the top right. Check official biographies in order and stop at the first person with House service.',challenge:'Bind each seat to the correct person, follow the specified order, and apply the stopping condition.'},
  {id:46,short:'Mineral specimen',title:'Resolve a visually convincing near-match.',summary:'Identify the main mineral, the original mineral whose crystal shape is preserved, the associated mineral, and the specimen’s locality.',challenge:'Distinguish similar-looking candidates using the specimen’s visual details and source records.'},
  {id:126,short:'Building & entrance',title:'Follow an image all the way to an entrance.',summary:'Identify a historic building and its wing. Trace its original use, find the makerspace inside, and locate the street entrance that provides step-free courtyard access.',challenge:'Keep the same building and wing connected across historical, institutional, and accessibility evidence.'}
];
const familyInfo = [
  {short:'Set-wise',color:'#b499ed',desc:'Inspect a complete set. Link every object to its evidence, then filter, compare, or summarize.',diagram:'M14 25H90 M24 25V10 M52 25V10 M80 25V10',dots:[[24,10],[52,10],[80,10],[52,40]]},
  {short:'Sequential',color:'#8ca9e6',desc:'Carry a finding forward. Each identity, clue, or fact guides a later search.',diagram:'M10 25H94',dots:[[14,25],[40,25],[66,25],[92,25]]},
  {short:'Hybrid wide–deep',color:'#bfa0dc',desc:'Alternate breadth and depth. Earlier findings define a set; filtering it defines the next target.',diagram:'M12 25H35 M35 25L58 8 M35 25L58 25 M35 25L58 42 M58 8L84 25 M58 25H96 M58 42L84 25',dots:[[12,25],[35,25],[58,8],[58,25],[58,42],[96,25]]},
  {short:'Disambiguation',color:'#d1a0b9',desc:'Compare close candidates. Use local visual details and reliable records to verify an identity.',diagram:'M18 10L53 25 M18 40L53 25 M53 25H94',dots:[[18,10],[18,40],[53,25],[94,25]]},
  {short:'Structure-guided',color:'#88c1b5',desc:'Follow an image’s order, positions, or connections to determine where to search next.',diagram:'M15 10H83V40H44V25H15Z',dots:[[15,10],[83,10],[83,40],[44,40],[44,25],[15,25]]}
];
const caseNotes = {
  S1:'The run links individual museum objects to photography requirements and preserves those associations in the equipment assignments.',
  S2:'The search finds relevant exterior-elevation sheets but fails to cover the full required set.',
  S3:'The run connects the building image to the correct wing, makerspace, and step-free entrance.',
  S4:'Visual interface evidence is carried through the search to identify the corresponding covers.',
  S5:'A textual near-match is accepted as the map identity, sending subsequent searches toward the wrong target.',
  S6:'The correct makerspace is encountered, but its connection to the building is lost in the final selection.',
  S7:'The run first builds a set of films, then compares poster imagery to locate the required carnival scene.',
  S8:'An incorrect initial motorcycle category restricts the later broad search to the wrong scope.',
  S9:'An incorrect visual filter lets unsuitable backpack candidates survive into a later ranking.',
  S10:'Comparison of visual details corrects the initial instrument hypothesis and supports the final identification.',
  S11:'The exact camera-accessory candidate is retrieved, then rejected in favor of a misleading similar-model description.',
  S12:'An initial component-based interpretation overrides stronger evidence from an exact image match.',
  S13:'The run uses uploader records and the original image structure to select the next asset at each stage.',
  S14:'The run follows the advisory order and checks wind values until the required threshold is reached.',
  S15:'The wrong next landform breaks the intended route and leads to the wrong stopping crater.',
  S16:'Skipping a stop on the purple shuttle route breaks the correspondence between the image path and the search.',
  S17:'The starting ID is bound to the wrong asset record, so later steps follow the wrong path.'
};

function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2800);
}
async function getJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`);
  return response.json();
}
function titleFor(task) {
  const firstLine=task.question_en.split(/\n/)[0];
  return featured.find(f => f.id === task.id)?.title || state.cases.find(c => c.id === task.id)?.title || (firstLine.length>120?firstLine.slice(0,120).replace(/\s+\S*$/, '')+'…':firstLine);
}
function tag(name) { return `<span class="tag">${esc(name)}</span>`; }
function imageOrText(task, className = '') {
  return task.images.length ? `<img class="${className}" src="${task.images[0].src}" alt="Initial input image for task ${task.id}" loading="lazy" width="${task.images[0].width}" height="${task.images[0].height}">` : '<div class="text-start"><span>Text-initiated search</span><strong>Musical<br>Instruments</strong><small>The Metropolitan Museum of Art<br>Winter 1977–78</small></div>';
}
function renderFeatured() {
  const f = featured[featuredIndex], task = state.tasks.find(t => t.id === f.id);
  $('#featured-count').textContent = `FIGURE 2 · ${String(featuredIndex + 1).padStart(2,'0')} / 07`;
  $('#featured-detail').innerHTML = `<div class="featured-main"><button class="featured-image" data-task="${task.id}" aria-label="Open the full question for task ${task.id}"><span class="image-type">${task.images.length ? 'INITIAL INPUT IMAGE' : 'NO INITIAL IMAGE · TEXT PROMPT'}</span>${imageOrText(task)}</button><div class="featured-copy">${tag(task.category_name)}<h3>${esc(f.title)}</h3><p>${esc(f.summary)}</p><p class="task-challenge"><strong>The visual challenge</strong>${esc(f.challenge)}</p><button class="text-button" data-task="${task.id}">Explore task ${task.id} <span aria-hidden="true">↗</span></button></div></div>`;
  $$('.featured-tab').forEach((b, i) => { b.classList.toggle('active', i === featuredIndex); b.setAttribute('aria-pressed', String(i === featuredIndex)); });
}
function renderFamilies() {
  $('#family-grid').innerHTML = familyInfo.map((f,i) => `<article class="family-card" style="--family-color:${f.color}"><div class="family-count"><span>0${i+1}</span><span>${state.metadata.category_counts[state.categories[i]]} TASKS</span></div><svg viewBox="0 0 108 50" aria-hidden="true"><path d="${f.diagram}" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".6"/>${f.dots.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#191720" stroke="currentColor" stroke-width="1.5"/>`).join('')}</svg><h4>${esc(state.categories[i])}</h4><p>${f.desc}</p></article>`).join('');
  $('#domain-bars').innerHTML = state.domains.map((d,i)=>`<div><div class="domain-bar-head"><span>${esc(d)}</span><b>${state.metadata.domain_counts[d]} tasks</b></div><div class="domain-bar-track"><i style="width:${state.metadata.domain_counts[d]/48*100}%;opacity:${.9-i*.07}"></i></div></div>`).join('');
}
function resultView() {
  const setting = $('#result-setting').value, slice = $('#result-slice').value, sort = $('#result-sort').value;
  let label = 'Overall', count = 204;
  const [type, i] = slice.split(':');
  if(type === 'category') { label = state.categories[Number(i)]; count = state.metadata.category_counts[label]; }
  if(type === 'domain') { label = state.domains[Number(i)]; count = state.metadata.domain_counts[label]; }
  let rows = state.results.filter(r => setting === 'all' || r.setting === setting).map(r => ({model:r.model,setting:r.setting,...(type === 'category' ? r.categories[label] : type === 'domain' ? r.domains[label] : {accuracy:r.accuracy,ps:r.ps})}));
  rows.sort((a,b) => sort === 'model' ? a.model.localeCompare(b.model) || a.setting.localeCompare(b.setting) : b[sort]-a[sort] || b[sort==='accuracy'?'ps':'accuracy']-a[sort==='accuracy'?'ps':'accuracy'] || a.model.localeCompare(b.model));
  return {rows,sort,label,count};
}
function renderResults() {
  const {rows,sort,label,count}=resultView();
  const bestAcc = Math.max(...rows.map(r=>r.accuracy)), bestPS = Math.max(...rows.map(r=>r.ps));
  let rank=1;
  const shown=expandedResults?rows:rows.slice(0,10);
  $('#results-body').innerHTML = shown.map((r,i)=>{
    if(i && r[sort]!==rows[i-1][sort]) rank=i+1;
    return `<tr><td>${sort==='model'?'—':String(rank).padStart(2,'0')}</td><td>${esc(r.model)}</td><td><span class="setting-chip ${r.setting.toLowerCase()}">${esc(r.setting)}</span></td>${['accuracy','ps'].map(k=>`<td class="score-cell ${r[k]===(k==='accuracy'?bestAcc:bestPS)?'best':''}"><strong>${fmt(r[k])}</strong><span class="score-track" aria-hidden="true"><i style="width:${r[k]}%"></i></span></td>`).join('')}</tr>`;
  }).join('');
  $('#results-caption').textContent = `${shown.length} of ${rows.length} configurations · ${label} · ${count} tasks`;
  $('#toggle-results').hidden=rows.length<=10;
  $('#toggle-results').textContent=expandedResults?'Show top 10 ↑':`Show all ${rows.length} configurations ↓`;
  $('#toggle-results').setAttribute('aria-expanded',String(expandedResults));
  $('#accuracy-header').setAttribute('aria-sort',sort==='accuracy'?'descending':'none');
  $('#ps-header').setAttribute('aria-sort',sort==='ps'?'descending':'none');
}
function downloadResults() {
  const {rows,label,count}=resultView();
  const values=[['Model','Setting','Slice','Tasks','Accuracy (%)','Process Score (%)'],...rows.map(r=>[r.model,r.setting,label,count,fmt(r.accuracy),fmt(r.ps)])];
  const csv=values.map(row=>row.map(x=>`"${String(x).replaceAll('"','""')}"`).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  const a=document.createElement('a');a.href=url;a.download='vissearch-bench-paper-results.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('Current results view downloaded.');
}
function renderAblation() {
  const data=state.ablation[Number($('#ablation-model').value)];
  const offset=ablationMetric==='accuracy'?0:1, max=ablationMetric==='accuracy'?25:50;
  const names=['Direct Answer','Text','Caption','Full'], classes=['direct','text','caption','full'];
  $('#ablation-chart').innerHTML = names.map((name,i)=>`<div class="ablation-row"><div><span>${name}</span><b>${fmt(data.values[i*2+offset])}%</b></div><div class="ablation-track"><i class="${classes[i]}" style="width:${data.values[i*2+offset]/max*100}%"></i></div></div>`).join('')+`<div class="chart-scale"><span>0%</span><span>${max/2}%</span><span>${max}%</span></div>`;
  $('#ablation-gain').innerHTML = `<div><strong>+${fmt(data.values[8+offset])} pp</strong><span>Full − Text</span></div><div><strong>+${fmt(data.values[10+offset])} pp</strong><span>Full − Caption</span></div>`;
  $$('[data-ablation-metric]').forEach(b=>{const active=b.dataset.ablationMetric===ablationMetric;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}
function renderCases() {
  const filter=$('#case-filter').value, visible=state.cases.filter(c=>filter==='all'||c.outcome===filter);
  if(!visible.some(c=>c.figure_number===caseId)) caseId=visible[0].figure_number;
  $('#case-list').innerHTML=visible.map(c=>`<button class="case-item ${c.figure_number===caseId?'active':''}" data-case="${c.figure_number}" aria-pressed="${c.figure_number===caseId}"><div><span class="mini-label">${c.figure_number} · TASK ${c.id}</span><span class="outcome ${c.outcome.toLowerCase()}">${c.outcome}</span></div><strong>${esc(c.title)}</strong><small>${esc(c.model)} · ${c.method}</small></button>`).join('');
  const c=state.cases.find(c=>c.figure_number===caseId);
  $('#case-detail').innerHTML=`<span class="outcome ${c.outcome.toLowerCase()}">${c.outcome} · Figure ${c.figure_number}</span><h4>${esc(c.title)}</h4><p>${esc(caseNotes[c.figure_number])}</p><p class="fine-print">${esc(c.model)} · ${c.method} · Task ${c.id}</p><button class="case-image" data-image="${c.image}" data-title="Figure ${c.figure_number} · ${esc(c.title)}" aria-label="Enlarge Figure ${c.figure_number}"><img src="${c.image}" alt="Condensed model trajectory in Figure ${c.figure_number}: ${esc(c.title)}" loading="lazy"></button><div class="case-detail-actions"><button class="text-button" data-image="${c.image}" data-title="Figure ${c.figure_number} · ${esc(c.title)}">Enlarge figure ↗</button><button class="text-button" data-task="${c.id}">Original task ↗</button><a class="text-button" href="${c.pdf}" target="_blank" rel="noopener">Open PDF ↗</a></div><p class="fine-print">Condensed trajectory from the manuscript appendix. This is a recorded case, not a live agent execution.</p>`;
}
function selectCase(id, scroll=true) {
  caseId=id;
  if(scroll) $('#case-filter').value='all';
  const list=$('#case-list'), top=list.scrollTop, left=list.scrollLeft;
  renderCases();
  if(!scroll) {list.scrollTop=top;list.scrollLeft=left;$(`#case-list [data-case="${id}"]`).focus({preventScroll:true});}
  if(scroll) $('.case-browser').scrollIntoView({behavior:'smooth',block:'start'});
}
// Render data as escaped text before adding a small, controlled Markdown subset.
// This preserves tables and evidence links without allowing dataset-provided HTML.
function inline(text) {
  return esc(text).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,(_,label,url)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
}
function markdown(text) {
  const lines=String(text).replace(/\r/g,'').split('\n'), output=[];
  for(let i=0;i<lines.length;i++) {
    const line=lines[i];
    if(!line.trim()) continue;
    if(/^\s*\|/.test(line) && i+1<lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i+1])) {
      const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      const header=cells(line);i+=2;const body=[];
      while(i<lines.length && /^\s*\|/.test(lines[i])) {body.push(cells(lines[i]));i++;}i--;
      output.push(`<div class="md-table"><table><thead><tr>${header.map(c=>`<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(row=>`<tr>${row.map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    } else if(/^#{1,6}\s/.test(line)) output.push(`<h4>${inline(line.replace(/^#{1,6}\s+/,''))}</h4>`);
    else output.push(`<p>${inline(line)}</p>`);
  }
  return output.join('');
}
function openDialog(dialog) {
  if(!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
}
async function openTask(id) {
  const request=++currentTaskRequest, dialog=$('#task-dialog');
  $('#task-dialog-content').innerHTML='<div class="task-dialog-body"><h2 id="dialog-title">Loading task…</h2></div>';
  openDialog(dialog);
  try {
    if(!taskCache.has(id)) taskCache.set(id,await getJSON(`data/tasks/${id}.json`));
    if(request!==currentTaskRequest || !dialog.open) return;
    const t=taskCache.get(id), related=state.cases.filter(c=>c.id===id);
    $('#task-dialog-content').innerHTML=`<div class="task-dialog-body"><h2 id="dialog-title">Task ${t.id} · ${esc(titleFor(t))}</h2><div class="dialog-meta">${tag(t.category_name)}${tag(t.domain)}</div><h3>Initial input</h3><div class="dialog-inputs">${t.images.length?t.images.map((im,i)=>`<button data-image="${im.src}" data-title="Task ${t.id} · Initial image ${i+1}" aria-label="Enlarge initial image ${i+1}"><img src="${im.src}" alt="Initial input image ${i+1} for task ${t.id}" width="${im.width}" height="${im.height}"></button>`).join(''):'<div class="no-image">No initial image. This task starts from a text instruction and requires visual evidence retrieved during search.</div>'}</div><h3>Original English question</h3><div class="markdown">${markdown(t.question_en)}</div><details><summary>Reveal the reference answer</summary><div class="markdown">${markdown(t.answer)}</div></details><details><summary>Read the reference solution</summary><p class="fine-print">Dataset reference solution, separate from the actual model runs illustrated in the paper.</p><div class="markdown">${markdown(t.gold_trajectory)}</div></details><details><summary>Complete-answer grading prompt</summary><p class="fine-print">The English prompt stored in <code>accuracy_prompt</code>.</p><div class="raw-prompt">${esc(t.accuracy_prompt)}</div></details><details><summary>Process Score grading prompt</summary><p class="fine-print">The English prompt stored in <code>Process Score</code>. This field contains scoring instructions, not a numerical result.</p><div class="raw-prompt">${esc(t['Process Score'])}</div></details>${related.length?`<div class="dialog-related"><h3>Model cases in the paper</h3>${related.map(c=>`<button class="text-button" data-related-case="${c.figure_number}">${c.figure_number} · ${esc(c.model)} / ${c.method} · ${c.outcome} ↗</button>`).join('')}</div>`:''}</div>`;
    dialog.scrollTop=0;
  } catch(e) {$('#task-dialog-content').innerHTML='<div class="task-dialog-body"><h2 id="dialog-title">Task could not be loaded.</h2><p>Please retry, or open the dataset on Hugging Face.</p></div>';console.error(e);}
}
function openImage(src,title) {
  $('#zoom-image').src=src;$('#zoom-image').alt=title;$('#image-title').textContent=title;
  openDialog($('#image-dialog'));$('#image-dialog').scrollTop=0;
}

document.addEventListener('click',async e=>{
  const b=e.target.closest('button, a');if(!b)return;
  if(b.dataset.task && state) openTask(Number(b.dataset.task));
  if(b.dataset.featured!==undefined) {featuredIndex=Number(b.dataset.featured);renderFeatured();}
  if(b.dataset.ablationMetric) {ablationMetric=b.dataset.ablationMetric;renderAblation();}
  if(b.dataset.case) {const inside=!!b.closest('#case-list');selectCase(b.dataset.case,!inside);}
  if(b.dataset.relatedCase) {$('#task-dialog').close();selectCase(b.dataset.relatedCase);}
  if(b.dataset.figure) openImage(`assets/figures/${b.dataset.figure}.webp`,b.dataset.title);
  if(b.dataset.image) openImage(b.dataset.image,b.dataset.title);
  if(b.dataset.close) $(`#${b.dataset.close}`).close();
  if(b.dataset.copy) {
    try {await navigator.clipboard.writeText($(`#${b.dataset.copy}`).textContent);toast(b.dataset.copy==='citation'?'BibTeX copied.':'Code copied.');}
    catch {toast('Select the text and copy it with your keyboard.');}
  }
});
$$('dialog').forEach(d=>{
  d.addEventListener('close',()=>{if(!$$('dialog[open]').length)document.body.classList.remove('modal-open');});
  d.addEventListener('click',e=>{if(e.target===d){const rect=d.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)d.close();}});
});
$('#menu-toggle').addEventListener('click',()=>{const open=$('#nav-links').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').setAttribute('aria-label',open?'Close navigation':'Open navigation');});
$$('#nav-links a').forEach(a=>a.addEventListener('click',()=>{$('#nav-links').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','Open navigation');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#nav-links').classList.contains('open')){$('#nav-links').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','Open navigation');$('#menu-toggle').focus();}});

async function init() {
  const [tasks,cases,results,ablation,metadata]=await Promise.all(['tasks','cases','results','ablation','metadata'].map(name=>getJSON(`data/${name}.json`)));
  state={tasks,cases,results,ablation,metadata,categories:Object.keys(metadata.category_counts),domains:Object.keys(metadata.domain_counts)};
  $('#featured-tabs').innerHTML=featured.map((f,i)=>`<button class="featured-tab" data-featured="${i}" aria-pressed="false"><b>0${i+1}</b><span>${f.short}</span></button>`).join('');
  $('#featured-prev').addEventListener('click',()=>{featuredIndex=(featuredIndex+6)%7;renderFeatured();});
  $('#featured-next').addEventListener('click',()=>{featuredIndex=(featuredIndex+1)%7;renderFeatured();});
  $('#result-slice').insertAdjacentHTML('beforeend',`<optgroup label="Search families">${state.categories.map((c,i)=>`<option value="category:${i}">${esc(c)} · ${metadata.category_counts[c]}</option>`).join('')}</optgroup><optgroup label="Content domains">${state.domains.map((d,i)=>`<option value="domain:${i}">${esc(d)} · ${metadata.domain_counts[d]}</option>`).join('')}</optgroup>`);
  $('#ablation-model').innerHTML=ablation.map((a,i)=>`<option value="${i}">${esc(a.model)}</option>`).join('');$('#ablation-model').value='2';
  ['result-setting','result-slice','result-sort'].forEach(id=>$(`#${id}`).addEventListener('change',()=>{expandedResults=false;renderResults();}));
  $('#download-results').addEventListener('click',downloadResults);
  $('#toggle-results').addEventListener('click',()=>{expandedResults=!expandedResults;renderResults();});
  $('#ablation-model').addEventListener('change',renderAblation);
  $('#case-filter').addEventListener('change',renderCases);
  renderFeatured();renderFamilies();renderResults();renderAblation();renderCases();
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting) $$('#nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));});},{rootMargin:'-15% 0px -60% 0px'});
  ['overview','tasks','results','cases','dataset'].forEach(id=>observer.observe($(`#${id}`)));
  document.documentElement.dataset.ready='true';
}
init().catch(e=>{console.error(e);$('#featured-detail').innerHTML='<p class="error-message">Interactive content could not be loaded. Please refresh the page or use the paper and dataset links.</p>';toast('Unable to load page data. Please refresh.');});
