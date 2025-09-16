// Kuis Interaktif
function startQuiz2() {
  const quizBox = document.getElementById('quizBox2');
  const type = document.getElementById('quickQuizType2').value;
  const quizBank = quizBanks[type] || quizBanks['math'];
  let index=0, score=0;
  quizBox.innerHTML = '';
  function showQuestion(){
    if(index>=quizBank.length){
      quizBox.innerHTML = `<h3>Hasil: ${score} / ${quizBank.length}</h3><p class="small">Bagus! Coba lagi untuk nilai lebih tinggi.</p>`;
      return;
    }
    const item = quizBank[index];
    quizBox.innerHTML = `<div><strong>Soal ${index+1}.</strong> ${item.q}</div>`;
    const ul = document.createElement('div'); ul.style.marginTop='8px';
    item.choices.forEach((c,i)=>{
      const btn = document.createElement('button'); btn.style.marginRight='8px'; btn.style.marginTop='6px';
      btn.textContent = c; btn.onclick = ()=>{ if(i===item.a) score++; index++; showQuestion(); };
      ul.appendChild(btn);
    });
    quizBox.appendChild(ul);
  }
  showQuestion();
}
// Bank soal per materi
const quizBanks = {
  math: [
    {q:'5 + 3 = ?', choices:['6','8','9'], a:1},
    {q:'7 - 4 = ?', choices:['3','2','4'], a:0},
    {q:'2 + 6 = ?', choices:['7','8','9'], a:1},
    {q:'9 - 5 = ?', choices:['4','5','3'], a:0},
    {q:'6 + 2 = ?', choices:['7','8','9'], a:1},
    {q:'3 + 4 = ?', choices:['6','7','8'], a:1},
    {q:'8 - 3 = ?', choices:['5','6','4'], a:0},
    {q:'1 + 7 = ?', choices:['7','8','9'], a:1},
    {q:'10 - 2 = ?', choices:['8','9','7'], a:0},
    {q:'4 + 5 = ?', choices:['8','9','10'], a:1}
  ],
  indo: [
    {q:'Huruf awal kata "Rumah" adalah?', choices:['R','M','H'], a:0},
    {q:'Kata "Buku" terdiri dari berapa huruf?', choices:['3','4','5'], a:1},
    {q:'Sinonim kata "besar" adalah?', choices:['kecil','tinggi','luas'], a:0},
    {q:'Antonim kata "panjang" adalah?', choices:['pendek','lebar','besar'], a:0},
    {q:'Kata "apel" adalah nama?', choices:['buah','warna','hewan'], a:0},
    {q:'Huruf vokal pada kata "kuda"?', choices:['u','a','u dan a'], a:2},
    {q:'Kata "berlari" termasuk?', choices:['kata benda','kata kerja','kata sifat'], a:1},
    {q:'Kata "merah" adalah?', choices:['warna','buah','hewan'], a:0},
    {q:'Kata "ibu" adalah?', choices:['orang','benda','hewan'], a:0},
    {q:'Kata "pintar" termasuk?', choices:['kata sifat','kata kerja','kata benda'], a:0}
  ],
  sci: [
    {q:'Binatang yang bisa terbang?', choices:['Sapi','Burung','Ikan'], a:1},
    {q:'Makhluk hidup membutuhkan?', choices:['makanan','mainan','buku'], a:0},
    {q:'Tumbuhan berfotosintesis dengan?', choices:['daun','akar','batang'], a:0},
    {q:'Ikan hidup di?', choices:['air','darat','udara'], a:0},
    {q:'Manusia bernafas dengan?', choices:['paru-paru','insang','daun'], a:0},
    {q:'Burung berkembang biak dengan?', choices:['melahirkan','bertelur','membelah diri'], a:1},
    {q:'Sumber energi utama di bumi?', choices:['matahari','angin','air'], a:0},
    {q:'Hewan pemakan tumbuhan disebut?', choices:['herbivora','karnivora','omnivora'], a:0},
    {q:'Contoh makhluk hidup?', choices:['batu','air','kucing'], a:2},
    {q:'Tumbuhan memerlukan ... untuk tumbuh?', choices:['cahaya','mainan','buku'], a:0}
  ]
};

// Mulai kuis

function startQuiz() {
  const quizBox = document.getElementById('quizBox');
  const type = document.getElementById('quickQuizType') ? document.getElementById('quickQuizType').value : 'math';
  const quizBank = quizBanks[type] || quizBanks['math'];
  let index=0, score=0;
  quizBox.innerHTML = '';

  function showQuestion(){
    if(index>=quizBank.length){
      quizBox.innerHTML = `<h3>Hasil: ${score} / ${quizBank.length}</h3><p class="small">Bagus! Coba lagi untuk nilai lebih tinggi.</p>`;
      localStorage.setItem('bs_lastScore', `${score}/${quizBank.length}`);
      document.getElementById('quizResult').innerText = `Skor terakhir: ${score}/${quizBank.length}`;
      return;
    }
    const item = quizBank[index];
    quizBox.innerHTML = `<div><strong>Soal ${index+1}.</strong> ${item.q}</div>`;
    const ul = document.createElement('div'); ul.style.marginTop='8px';
    item.choices.forEach((c,i)=>{
      const btn = document.createElement('button'); btn.style.marginRight='8px'; btn.style.marginTop='6px';
      btn.textContent = c; btn.onclick = ()=>{ if(i===item.a) score++; index++; showQuestion(); };
      ul.appendChild(btn);
    });
    quizBox.appendChild(ul);
  }
  showQuestion();
}

document.getElementById('startQuiz').addEventListener('click', ()=>{
  startQuiz(); window.location.hash = '#kuis';
});

document.getElementById('resetProgress').addEventListener('click', ()=>{
  localStorage.removeItem('bs_lastScore');
  document.getElementById('quizResult').innerText = 'Skor terakhir: -';
  alert('Progress reset.');
});

document.getElementById('downloadWorksheet').addEventListener('click', ()=>{
  // Ambil pilihan materi, tipe latihan, dan soal custom
  const subject = document.getElementById('worksheetSubject').value;
  const type = document.getElementById('worksheetType').value;
  const custom = document.getElementById('customQuestions').value.trim();
  let txt = '';
  let filename = '';
  let defaultSoal = '';
  if(subject==='math' && type==='penjumlahan'){
    defaultSoal = `1) 5 + 2 = __\n2) 7 + 3 = __\n3) 4 + 6 = __\n4) 8 + 1 = __\n5) 6 + 5 = __`;
    filename = 'lembar_kerja_penjumlahan.txt';
  } else if(subject==='math' && type==='pengurangan'){
    defaultSoal = `1) 9 - 4 = __\n2) 7 - 2 = __\n3) 8 - 3 = __\n4) 10 - 5 = __\n5) 6 - 1 = __`;
    filename = 'lembar_kerja_pengurangan.txt';
  } else if(subject==='indo' && type==='bacaan'){
    defaultSoal = `Bacalah teks berikut:\nAni punya kucing bernama Miko. Setiap pagi Ani memberi makan Miko.\n\nPertanyaan:\n1) Apa nama kucing Ani? __\n2) Kapan Ani memberi makan? __`;
    filename = 'lembar_kerja_bacaan.txt';
  } else if(subject==='indo' && type==='kata'){
    defaultSoal = `Tentukan sinonim dari kata berikut:\n1) Besar = __\n2) Pintar = __\n3) Indah = __`;
    filename = 'lembar_kerja_kata.txt';
  } else if(subject==='sci' && type==='ipa'){
    defaultSoal = `Jawab pertanyaan berikut:\n1) Sebutkan 2 contoh makhluk hidup! __\n2) Apa yang dibutuhkan tumbuhan untuk tumbuh? __\n3) Bagaimana cara ikan bernafas? __`;
    filename = 'lembar_kerja_ipa.txt';
  } else {
    defaultSoal = `Soal belum tersedia untuk kombinasi ini.`;
    filename = `lembar_kerja_${type}.txt`;
  }
  let soalFinal = custom ? custom : defaultSoal;
  txt = `Lembar Kerja ${subject==='math'?'Matematika':subject==='indo'?'Bahasa Indonesia':'IPA'} - ${type.charAt(0).toUpperCase()+type.slice(1)}\n\n${soalFinal}\n\nJawab di lembar kertas.`;
  const blob = new Blob([txt], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
});

// Materi


function showLesson(id){
  document.getElementById('lessonContent').style.display = 'none';
  const materiPage = document.getElementById('materiPage');
  materiPage.style.display = 'block';
  let title = '';
  let modulList = [];
  if(id==='math'){
    title = 'Matematika: Penjumlahan & Pengurangan';
    modulList = [
      {judul:'Penjumlahan Dasar', link:'https://id.wikibooks.org/wiki/Matematika_SD/Penjumlahan'},
      {judul:'Pengurangan Dasar', link:'https://id.wikibooks.org/wiki/Matematika_SD/Pengurangan'},
      {judul:'Materi Pecahan SD', link:'https://www.rumahbelajar.id/Matematika/pecahan'},
      {judul:'Latihan Soal Matematika SD', link:'https://www.rumahbelajar.id/Matematika/latihan-soal'}
    ];
  } else if(id==='indo'){
    title = 'Bahasa Indonesia: Membaca & Menulis';
    modulList = [
      {judul:'Materi Membaca SD', link:'https://www.rumahbelajar.id/BahasaIndonesia/membaca'},
      {judul:'Kosa Kata Dasar', link:'https://id.wikibooks.org/wiki/Bahasa_Indonesia_SD/Kosa_Kata'},
      {judul:'Materi Menulis SD', link:'https://www.rumahbelajar.id/BahasaIndonesia/menulis'},
      {judul:'Latihan Soal Bahasa Indonesia SD', link:'https://www.rumahbelajar.id/BahasaIndonesia/latihan-soal'}
    ];
  } else if(id==='sci'){
    title = 'IPA: Makhluk Hidup';
    modulList = [
      {judul:'Ciri Makhluk Hidup', link:'https://id.wikibooks.org/wiki/IPA_SD/Makhluk_Hidup'},
      {judul:'Materi Makhluk Hidup SD', link:'https://www.rumahbelajar.id/IPA/makhluk-hidup'},
      {judul:'Eksperimen Sederhana IPA SD', link:'https://www.rumahbelajar.id/IPA/eksperimen'},
      {judul:'Latihan Soal IPA SD', link:'https://www.rumahbelajar.id/IPA/latihan-soal'}
    ];
  }
  let modulHtml = modulList.map(m=>`<li style='margin-bottom:10px'><a href='${m.link}' target='_blank' style='font-weight:600;color:var(--accent);font-size:1.1rem'>${m.judul}</a></li>`).join('');
  document.getElementById('materiDetail').innerHTML = `<h3>${title}</h3><ul style='margin-top:12px'>${modulHtml}</ul><p class='small' style='margin-top:18px'>Upload modul sendiri di bawah.</p>`;
  window.location.hash = '#materi';
}

document.getElementById('uploadForm').addEventListener('submit', function(e){
  e.preventDefault();
  const file = document.getElementById('modulFile').files[0];
  if(!file){
    document.getElementById('uploadStatus').innerText = 'Pilih file terlebih dahulu.';
    return;
  }
  document.getElementById('uploadStatus').innerText = `Modul "${file.name}" siap digunakan (simulasi, file tidak diunggah ke server).`;
});

// Latihan Harian


document.getElementById('generatePractice').addEventListener('click', ()=>{
  const type = document.getElementById('practiceType').value;
  const area = document.getElementById('practiceArea'); area.innerHTML='';
  if(type==='penjumlahan'){
    const problems = [];
    for(let i=0;i<5;i++){ 
      const a=Math.floor(Math.random()*9)+1; 
      const b=Math.floor(Math.random()*9)+1; 
      problems.push(`${i+1}) <input type='text' style='width:40px'> + <input type='text' style='width:40px'> = <input type='text' style='width:40px'>`); 
    }
    area.innerHTML = `<form id='practiceForm'><ol>${problems.map(p=>`<li>${p}</li>`).join('')}</ol><button type='button' id='savePractice'>Simpan Jawaban</button> <button type='button' id='printBtn'>Cetak</button></form>`;
    document.getElementById('printBtn').onclick = ()=>{ window.print(); };
    document.getElementById('savePractice').onclick = ()=>{
      const vals = Array.from(document.querySelectorAll('#practiceForm input')).map(i=>i.value);
      localStorage.setItem('bs_practice_penjumlahan', JSON.stringify(vals));
      alert('Jawaban disimpan!');
    };
  } else if(type==='pengurangan'){
    const problems = [];
    for(let i=0;i<5;i++){ 
      const a=Math.floor(Math.random()*9)+5; 
      const b=Math.floor(Math.random()*5)+1; 
      problems.push(`${i+1}) <input type='text' style='width:40px'> - <input type='text' style='width:40px'> = <input type='text' style='width:40px'>`); 
    }
    area.innerHTML = `<form id='practiceForm'><ol>${problems.map(p=>`<li>${p}</li>`).join('')}</ol><button type='button' id='savePractice'>Simpan Jawaban</button> <button type='button' id='printBtn'>Cetak</button></form>`;
    document.getElementById('printBtn').onclick = ()=>{ window.print(); };
    document.getElementById('savePractice').onclick = ()=>{
      const vals = Array.from(document.querySelectorAll('#practiceForm input')).map(i=>i.value);
      localStorage.setItem('bs_practice_pengurangan', JSON.stringify(vals));
      alert('Jawaban disimpan!');
    };
  } else if(type==='bacaan'){
    const text = 'Ani punya kucing bernama Miko. Setiap pagi Ani memberi makan Miko.';
    area.innerHTML = `<form id='practiceForm'><p class=\"small\">${text}</p><ol><li>Apa nama kucing Ani? <input type='text'></li><li>Kapan Ani memberi makan? <input type='text'></li></ol><button type='button' id='savePractice'>Simpan Jawaban</button> <button type='button' id='printBtn'>Cetak</button></form>`;
    document.getElementById('printBtn').onclick = ()=>{ window.print(); };
    document.getElementById('savePractice').onclick = ()=>{
      const vals = Array.from(document.querySelectorAll('#practiceForm input')).map(i=>i.value);
      localStorage.setItem('bs_practice_bacaan', JSON.stringify(vals));
      alert('Jawaban disimpan!');
    };
  } else if(type==='kata'){
    area.innerHTML = `<form id='practiceForm'><p class=\"small\">Tentukan sinonim dari kata berikut:</p><ol><li>Besar = <input type='text'></li><li>Pintar = <input type='text'></li><li>Indah = <input type='text'></li></ol><button type='button' id='savePractice'>Simpan Jawaban</button> <button type='button' id='printBtn'>Cetak</button></form>`;
    document.getElementById('printBtn').onclick = ()=>{ window.print(); };
    document.getElementById('savePractice').onclick = ()=>{
      const vals = Array.from(document.querySelectorAll('#practiceForm input')).map(i=>i.value);
      localStorage.setItem('bs_practice_kata', JSON.stringify(vals));
      alert('Jawaban disimpan!');
    };
  } else if(type==='ipa'){
    area.innerHTML = `<form id='practiceForm'><p class=\"small\">Jawab pertanyaan berikut tentang makhluk hidup:</p><ol><li>Sebutkan 2 contoh makhluk hidup! <input type='text'></li><li>Apa yang dibutuhkan tumbuhan untuk tumbuh? <input type='text'></li><li>Bagaimana cara ikan bernafas? <input type='text'></li></ol><button type='button' id='savePractice'>Simpan Jawaban</button> <button type='button' id='printBtn'>Cetak</button></form>`;
    document.getElementById('printBtn').onclick = ()=>{ window.print(); };
    document.getElementById('savePractice').onclick = ()=>{
      const vals = Array.from(document.querySelectorAll('#practiceForm input')).map(i=>i.value);
      localStorage.setItem('bs_practice_ipa', JSON.stringify(vals));
      alert('Jawaban disimpan!');
    };
  }
});

// Tampilkan skor terakhir saat load
window.addEventListener('load', ()=>{
  const last = localStorage.getItem('bs_lastScore');
  if(last) document.getElementById('quizResult').innerText = `Skor terakhir: ${last}`;
}); 

// Event listener untuk tombol kuis interaktif section
document.getElementById('startQuiz2').addEventListener('click', ()=>{
  startQuiz2();
  window.location.hash = '#kuis';
});
