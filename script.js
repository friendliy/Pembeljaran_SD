// ===========================
// Bank Soal
// ===========================
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
    {q:'Sinonim kata "besar" adalah?', choices:['kecil','luas','tinggi'], a:1}
  ],
  sci: [
    {q:'Binatang yang bisa terbang?', choices:['Sapi','Burung','Ikan'], a:1},
    {q:'Makhluk hidup membutuhkan?', choices:['makanan','mainan','buku'], a:0},
    {q:'Tumbuhan berfotosintesis dengan?', choices:['daun','akar','batang'], a:0}
  ],
  custom: []
};

// Ensure each bank has at least 25 questions by generating simple questions when necessary
function ensureQuizBank(type) {
  if (!quizBanks[type]) quizBanks[type] = [];
  const bank = quizBanks[type];
  while (bank.length < 25) {
    if (type === 'math') {
      const a = Math.floor(Math.random()*20) + 1;
      const b = Math.floor(Math.random()*20) + 1;
      const sum = a + b;
      const correctIndex = Math.floor(Math.random()*3);
      const choices = [];
      for (let i=0;i<3;i++){
        if (i===correctIndex) choices.push(String(sum));
        else {
          let delta = (Math.floor(Math.random()*5)+1) * (Math.random()<0.5?-1:1);
          let val = sum + delta;
          if (val === sum) val = sum + 1;
          choices.push(String(val));
        }
      }
      bank.push({q:`${a} + ${b} = ?`, choices, a: correctIndex});
    } else if (type === 'indo') {
      const words = ['kucing','rumah','buku','sekolah','matahari','apel','pohon','ikan','bola','pensil','kursi','meja','bunga','air','mobil','lilin','roda','susu','burung','kakak','adik','guru','makanan','minuman','mainan'];
      const w = words[Math.floor(Math.random()*words.length)];
      const kind = Math.floor(Math.random()*3);
      if (kind === 0) {
        const ch = [w[0].toUpperCase(), (w[1]||w[0]).toUpperCase(), w[w.length-1].toUpperCase()];
        bank.push({q:`Huruf awal kata "${w}" adalah?`, choices: ch, a:0});
      } else if (kind === 1) {
        const correct = String(w.length);
        const ch = [correct, String(Math.max(1, w.length-1)), String(w.length+1)];
        bank.push({q:`Kata "${w}" terdiri dari berapa huruf?`, choices: ch, a:0});
      } else {
        const syns = {besar:['besar','luas','agung'], kecil:['kecil','mini','sempit'], cepat:['cepat','kilat','gesit'], lambat:['lambat','pelan','lesu']};
        const keys = Object.keys(syns);
        const key = keys[Math.floor(Math.random()*keys.length)];
        const arr = syns[key];
        bank.push({q:`Sinonim kata "${key}" adalah?`, choices:[arr[1], arr[2], arr[0]], a:0});
      }
    } else if (type === 'sci') {
      const facts = [
        {q:'Binatang yang bisa terbang?', choices:['Sapi','Burung','Ikan'], a:1},
        {q:'Makhluk hidup membutuhkan?', choices:['makanan','mainan','buku'], a:0},
        {q:'Tumbuhan berfotosintesis dengan?', choices:['daun','akar','batang'], a:0},
        {q:'Planet kita disebut?', choices:['Mars','Bumi','Venus'], a:1},
        {q:'Sumber utama energi bagi tumbuhan?', choices:['Air','Matahari','Tanah'], a:1}
      ];
      bank.push(facts[Math.floor(Math.random()*facts.length)]);
    } else {
      bank.push({q:'Soal tambahan', choices:['A','B','C'], a:0});
    }
  }
  return bank;
}

// ===========================
// Built-in Latihan (ready-to-download)
// ===========================
const builtInLatihan = [
  {
    id: 'math_penjumlahan_basic',
    title: 'Matematika - Penjumlahan (Dasar)',
    content: '1) 5 + 3 = __\n2) 7 + 4 = __\n3) 2 + 6 = __\n4) 8 + 1 = __\n5) 3 + 2 = __'
  },
  {
    id: 'indo_bacaan_pendek',
    title: 'Bahasa Indonesia - Pemahaman Bacaan (Pendek)',
    content: 'Bacalah teks berikut:\n\nKucing adalah hewan peliharaan yang lucu. Mereka suka bermain dan tidur.\n\nPertanyaan:\n1) Apa hewan dalam teks?\n2) Apa yang suka dilakukan kucing?'
  },
  {
    id: 'sci_makhluk_hidup',
    title: 'IPA - Makhluk Hidup (Soal Singkat)',
    content: '1) Sebutkan tiga kebutuhan makhluk hidup.\n2) Mana yang bukan makhluk hidup: batu, burung, pohon?\n3) Apa fungsi daun pada tumbuhan?'
  }
];

// ===========================
// Firestore Worksheet Functions
// ===========================
// saveWorksheetToFirestore: supports either text content or file payload ({fileName,mime,dataBase64})
window.saveWorksheetToFirestore = function(subject, type, contentOrFile, callback) {
  var payload;
  if (contentOrFile && contentOrFile.fileName) {
    // it's a file object
    payload = { file: contentOrFile, meta: { subject: subject, type: type } };
  } else {
    var content = `Materi: ${subject}\nTipe: ${type}\n\n${contentOrFile || 'Soal otomatis oleh guru.'}`;
    payload = { content: content, meta: { subject: subject, type: type } };
  }
  window.db.collection("lembar_latihan").doc(subject+"_"+type).set(payload)
    .then(function() {
      if (typeof callback === 'function') callback(payload.content || contentOrFile);
    });
};

window.loadWorksheetFromFirestore = function(subject, type, callback) {
  window.db.collection("lembar_latihan").doc(subject+"_"+type).get()
    .then(function(doc) {
      if (doc.exists) callback(doc.data().content);
      else callback('Belum ada lembar latihan yang diisi guru.');
    });
};

window.downloadWorksheetFromFirestore = function(subject, type) {
  window.db.collection('lembar_latihan').doc(subject+"_"+type).get().then(function(doc){
    if (!doc.exists) { alert('Belum ada lembar latihan dari guru.'); return; }
    var data = doc.data();
    if (data.file) {
      // file saved as base64
      var bin = atob(data.file.data);
      var len = bin.length;
      var bytes = new Uint8Array(len);
      for (var i=0;i<len;i++) bytes[i]=bin.charCodeAt(i);
      var blob = new Blob([bytes], {type: data.file.mime || 'application/octet-stream'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
  a.download = data.file.fileName || 'unduhan.bin';
      a.click();
    } else if (data.content) {
      var blob = new Blob([data.content], {type:'text/plain'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lembar_latihan_guru.txt';
      a.click();
    } else {
      alert('Format lembar latihan tidak dikenali.');
    }
  }).catch(function(err){
    alert('Gagal mengambil lembar latihan: '+err.message);
  });
};

// Delete worksheet from Firestore (only call when authorized)
window.deleteWorksheetFromFirestore = function(subject, type, callback) {
  window.db.collection('lembar_latihan').doc(subject+"_"+type).delete()
    .then(function(){ if (typeof callback === 'function') callback(null); })
    .catch(function(err){ if (typeof callback === 'function') callback(err); });
};

// ===========================
// Fungsi Kuis
// ===========================
function startQuiz(onComplete) {
  const quizBox = document.getElementById('quizBox');
  const type = document.getElementById('quickQuizType') ? document.getElementById('quickQuizType').value : 'math';
  // ensure there are enough questions (generate up to 25 if needed)
  let quizBank = ensureQuizBank(type).slice();
  // pick 10 random unique questions
  quizBank = quizBank.sort(() => Math.random() - 0.5).slice(0, 10);

  let index=0, score=0;

  function showQuestion(){
    if(index>=quizBank.length){
      quizBox.innerHTML = `<h3>Hasil: ${score}/${quizBank.length}</h3>`;
      if (typeof onComplete === 'function') onComplete(score);
      return;
    }
    const item = quizBank[index];
    quizBox.innerHTML = `<div><strong>Soal ${index+1}.</strong> ${item.q}</div>`;
    const wrap = document.createElement('div');
    item.choices.forEach((c,i)=>{
      const btn = document.createElement('button');
      btn.textContent = c;
      btn.onclick = ()=>{ if(i===item.a) score++; index++; showQuestion(); };
      wrap.appendChild(btn);
    });
    quizBox.appendChild(wrap);
  }
  showQuestion();
}

function startQuiz2(onComplete) {
  const quizBox = document.getElementById('quizBox2');
  const type = document.getElementById('quickQuizType2') ? document.getElementById('quickQuizType2').value : 'math';
  // ensure there are enough questions (generate up to 25 if needed)
  let quizBank = ensureQuizBank(type).slice();
  // pick 10 random unique questions
  quizBank = quizBank.sort(() => Math.random() - 0.5).slice(0, 10);

  let index=0, score=0;

  function showQuestion(){
    if(index>=quizBank.length){
      quizBox.innerHTML = `<h3>Hasil: ${score}/${quizBank.length}</h3>`;
      if (typeof onComplete === 'function') onComplete(score);
      return;
    }
    const item = quizBank[index];
    quizBox.innerHTML = `<div><strong>Soal ${index+1}.</strong> ${item.q}</div>`;
    const wrap = document.createElement('div');
    item.choices.forEach((c,i)=>{
      const btn = document.createElement('button');
      btn.textContent = c;
      btn.onclick = ()=>{ if(i===item.a) score++; index++; showQuestion(); };
      wrap.appendChild(btn);
    });
    quizBox.appendChild(wrap);
  }
  showQuestion();
}

// ===========================
// Event Listener (satu saja)
// ===========================
document.addEventListener('DOMContentLoaded', function(){

  // --- Auth redirect & role-based UI (moved here so it runs after firebase init & script loaded) ---
  var userRaw = localStorage.getItem('bs_user');
  var userRaw = localStorage.getItem('bs_user');
  if (!userRaw) {
    // create a guest siswa for convenience/testing so quiz and latihan UI are accessible
    var guest = { name: 'Tamu', role: 'siswa' };
    localStorage.setItem('bs_user', JSON.stringify(guest));
    userRaw = localStorage.getItem('bs_user');
  }
  try {
    var user = JSON.parse(userRaw);
    var role = user.role;
  } catch(e) {
    // fallback to guest if parsing fails
    var guest = { name: 'Tamu', role: 'siswa' };
    localStorage.setItem('bs_user', JSON.stringify(guest));
    var user = guest;
    var role = user.role;
  }
  var guruArea = document.getElementById('guruWorksheet');
  var siswaArea = document.getElementById('siswaWorksheet');
  if (role === 'guru') {
    if (guruArea) guruArea.style.display = 'block';
    if (siswaArea) siswaArea.style.display = 'none';
  } else {
    if (guruArea) guruArea.style.display = 'none';
    if (siswaArea) siswaArea.style.display = 'block';
  }

  // Wire Unggah button: guru mengunggah file untuk siswa
  var saveBtn = document.getElementById('saveWorksheet');
  if (saveBtn) {
    saveBtn.onclick = function() {
      var subject = document.getElementById('worksheetSubject').value;
      var type = document.getElementById('worksheetType').value;
      var fileInput = document.getElementById('worksheetFileInput');
      // Role check
      var userRaw = localStorage.getItem('bs_user');
      var isGuru = false;
      if (userRaw) {
        try { var u = JSON.parse(userRaw); isGuru = (u.role === 'guru'); } catch(e){ isGuru = false; }
      }
      if (!isGuru) { alert('Hanya guru yang dapat mengunggah lembar latihan.'); return; }
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) { alert('Pilih file lembar kerja terlebih dahulu.'); return; }

      var file = fileInput.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        var result = evt.target.result;
        if (file.type === 'application/pdf') {
          var bytes = new Uint8Array(result);
          var binary = '';
          for (var i=0;i<bytes.byteLength;i++) binary += String.fromCharCode(bytes[i]);
          var b64 = btoa(binary);
          var fileObj = { fileName: file.name, mime: file.type, data: b64 };
          if (window.saveWorksheetToFirestore) {
            window.saveWorksheetToFirestore(subject, type, fileObj, function(){
              alert('File lembar kerja berhasil diunggah untuk siswa.');
              fileInput.value = '';
              if (window.populateLatihanList) window.populateLatihanList();
            });
          } else alert('Fitur cloud belum tersedia.');
        } else {
          // treat as text
          var text = (typeof result === 'string') ? result : new TextDecoder().decode(result);
          if (window.saveWorksheetToFirestore) {
            window.saveWorksheetToFirestore(subject, type, text, function(){
              alert('File teks lembar kerja berhasil diunggah untuk siswa.');
              fileInput.value = '';
              if (window.populateLatihanList) window.populateLatihanList();
            });
          } else alert('Fitur cloud belum tersedia.');
        }
      };
      if (file.type === 'application/pdf') reader.readAsArrayBuffer(file);
      else reader.readAsText(file);
    };
  }

  // Siswa: update UI and download
  var siswaSubject = document.getElementById('siswaSubject');
  var siswaType = document.getElementById('siswaType');
  var worksheetContent = document.getElementById('worksheetContent');
  function updateSiswaWorksheet() {
    if (!worksheetContent) return;
    var subject = siswaSubject ? siswaSubject.value : 'math';
    var type = siswaType ? siswaType.value : 'penjumlahan';
    if (window.loadWorksheetFromFirestore) {
      window.loadWorksheetFromFirestore(subject, type, function(content){
        worksheetContent.textContent = content;
      });
    }
  }
  if (siswaSubject) siswaSubject.onchange = updateSiswaWorksheet;
  if (siswaType) siswaType.onchange = updateSiswaWorksheet;
  updateSiswaWorksheet();

  var dwSiswaBtn = document.getElementById('downloadWorksheetSiswa');
  if (dwSiswaBtn) {
    dwSiswaBtn.onclick = function(){
      var subject = siswaSubject ? siswaSubject.value : 'math';
      var type = siswaType ? siswaType.value : 'penjumlahan';
      if (window.downloadWorksheetFromFirestore) {
        window.downloadWorksheetFromFirestore(subject, type);
      } else {
        alert('Fitur cloud belum tersedia.');
      }
    };
  }

  // --- Latihan list + upload in Latihan Page ---
  window.populateLatihanList = function(){
    var container = document.getElementById('latihanItems');
    if (!container) return;
    container.textContent = '';
    // Render built-in latihan first
    var html = '<ul>';
    builtInLatihan.forEach(function(item){
      html += `<li style="margin-bottom:8px;"><strong>${item.title}</strong><div style="font-size:0.95em;margin-top:4px">${item.content}</div><div style="margin-top:6px"><button class='builtin-download' data-id='${item.id}'>Unduh</button></div></li>`;
    });

    // Then also include Firestore items if available
    if (!window.db) {
      html += '</ul>';
      container.innerHTML = html;
      // attach builtin handlers
      var bbtns = container.querySelectorAll('.builtin-download');
      bbtns.forEach(function(b){
        b.onclick = function(){
          var id = b.getAttribute('data-id');
          var item = builtInLatihan.find(x=>x.id===id);
          if (!item) return;
          var blob = new Blob([item.content], {type:'text/plain'});
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = item.title.replace(/\s+/g,'_') + '.txt'; a.click();
        };
      });
      return;
    }

    window.db.collection('lembar_latihan').get().then(function(qs){
      if (!qs.empty) {
        qs.forEach(function(doc){
          var id = doc.id; // pattern subject_type
          var data = doc.data();
          var display = id.replace('_',' - ');
          // prefer file name if available
          var fileLabel = data.file ? (data.file.fileName || 'File') : (data.content ? 'Isi (teks)' : 'Kosong');
          html += `<li style="margin-bottom:8px;" data-docid='${id}'><strong>${display}</strong><div style="font-size:0.95em;margin-top:4px">${fileLabel}</div><div style="margin-top:6px"><button class='latihan-download' data-id='${id}'>Unduh</button> <button class='latihan-delete' data-id='${id}' style='margin-left:8px;display:none;background:#e53935;color:#fff'>Hapus</button></div></li>`;
        });
      }
      html += '</ul>';
      container.innerHTML = html;
      // attach builtin handlers
      var bbtns = container.querySelectorAll('.builtin-download');
      bbtns.forEach(function(b){
        b.onclick = function(){
          var id = b.getAttribute('data-id');
          var item = builtInLatihan.find(x=>x.id===id);
          if (!item) return;
          var blob = new Blob([item.content], {type:'text/plain'});
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = item.title.replace(/\s+/g,'_') + '.txt'; a.click();
        };
      });
      // attach firestore handlers
      var buttons = container.querySelectorAll('.latihan-download');
      buttons.forEach(function(b){
        b.onclick = function(){
          var id = b.getAttribute('data-id');
          var parts = id.split('_');
          var subject = parts[0];
          var type = parts.slice(1).join('_');
          if (window.downloadWorksheetFromFirestore) window.downloadWorksheetFromFirestore(subject, type);
        };
      });
      // attach delete handlers (visible only to guru)
      var delButtons = container.querySelectorAll('.latihan-delete');
      var userRaw = localStorage.getItem('bs_user');
      var isGuru = false;
      if (userRaw) { try { var u = JSON.parse(userRaw); isGuru = (u.role === 'guru'); } catch(e){ isGuru = false; } }
      delButtons.forEach(function(b){
        if (isGuru) b.style.display = 'inline-block';
        b.onclick = function(){
          var id = b.getAttribute('data-id');
          if (!confirm('Hapus lembar latihan ini? Aksi ini tidak dapat dibatalkan.')) return;
          var parts = id.split('_');
          var subject = parts[0];
          var type = parts.slice(1).join('_');
          if (window.deleteWorksheetFromFirestore) {
            window.deleteWorksheetFromFirestore(subject,type,function(err){
              if (err) alert('Gagal menghapus: '+err.message);
              else { alert('Lembar latihan dihapus.'); if (window.populateLatihanList) window.populateLatihanList(); }
            });
          }
        };
      });
    }).catch(function(err){
      container.textContent = 'Gagal memuat daftar: '+err.message;
    });
  };

  // Upload/save button on latihan page (guru)
  var uploadSaveBtn = document.getElementById('uploadSaveBtn');
  if (uploadSaveBtn) {
    uploadSaveBtn.onclick = function(){
      var subject = document.getElementById('uploadSubject').value;
      var type = document.getElementById('uploadType').value;
      var fileInput = document.getElementById('uploadFileInput');
      // Role check: only guru can upload
      var userRaw = localStorage.getItem('bs_user');
      var isGuru = false;
      if (userRaw) {
        try { var u = JSON.parse(userRaw); isGuru = (u.role === 'guru'); } catch(e) { isGuru = false; }
      }
      if (!isGuru) { alert('Hanya guru yang dapat mengunggah lembar latihan.'); return; }
      if (!subject || !type) { alert('Pilih materi dan tipe'); return; }
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Pilih file lembar kerja (.txt atau .pdf) terlebih dahulu.');
        return;
      }

      // There is a file: read it
      var file = fileInput.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        var result = evt.target.result;
        if (file.type === 'application/pdf') {
          // result is ArrayBuffer
          var bytes = new Uint8Array(result);
          // convert to base64
          var binary = '';
          for (var i=0;i<bytes.byteLength;i++) binary += String.fromCharCode(bytes[i]);
          var b64 = btoa(binary);
          var fileObj = { fileName: file.name, mime: file.type, data: b64 };
          window.saveWorksheetToFirestore(subject, type, fileObj, function(){ showSaveMessage(); if (window.populateLatihanList) window.populateLatihanList(); fileInput.value = ''; });
        } else {
          // treat as text
          var text = (typeof result === 'string') ? result : new TextDecoder().decode(result);
          window.saveWorksheetToFirestore(subject, type, text, function(){ showSaveMessage(); if (window.populateLatihanList) window.populateLatihanList(); fileInput.value = ''; });
        }
      };
      // Read as ArrayBuffer for PDFs, text for others
      if (file.type === 'application/pdf') reader.readAsArrayBuffer(file);
      else reader.readAsText(file);
    };
  }

  function showSaveMessage(){
    var msg = document.createElement('div');
    msg.textContent = 'Lembar kerja tersimpan.';
    msg.style.color = '#155724';
    msg.style.background = '#d4edda';
    msg.style.padding = '8px';
    msg.style.marginTop = '8px';
    var card = document.getElementById('latihanUploadCard');
    if (card) {
      var old = card.querySelector('.save-msg'); if (old) old.remove();
      msg.className = 'save-msg'; card.appendChild(msg);
    } else alert('Lembar kerja tersimpan');
  }


  // Download Worksheet (tidak lagi membuat dari teks): jika guru memilih file lokal, biarkan unduh lokal
  const dwBtn = document.getElementById('downloadWorksheet');
  if (dwBtn) {
    dwBtn.onclick = function() {
      var fileInput = document.getElementById('worksheetFileInput');
      if (fileInput && fileInput.files && fileInput.files.length>0) {
        // unduh file yang dipilih guru (sebagai fallback lokal)
        var file = fileInput.files[0];
        var blobUrl = URL.createObjectURL(file);
        var a = document.createElement('a'); a.href = blobUrl; a.download = file.name; a.click();
      } else {
        alert('Tidak ada file lokal. Untuk mengunduh lembar kerja yang diunggah guru, buka halaman Latihan dan pilih file dari daftar.');
      }
    };
  }

  // Mulai Kuis utama
  const btnQuiz = document.getElementById('startQuiz');
  if (btnQuiz) {
    btnQuiz.addEventListener('click', function(){
      console.log('[quiz] startQuiz clicked');
      btnQuiz.disabled = true;
      startQuiz(function(){ btnQuiz.disabled = false; });
    });
  }

  // Mulai Kuis interaktif (quizBox2)
  const btnQuiz2 = document.getElementById('startQuiz2');
  if (btnQuiz2) {
    // ensure clickable and visible
    try { btnQuiz2.style.pointerEvents = 'auto'; btnQuiz2.disabled = false; } catch(e){}
    console.log('[quiz] attaching startQuiz2 handler');
    btnQuiz2.addEventListener('click', function onStartQuiz2(){
      console.log('[quiz] startQuiz2 clicked');
      // prevent double-run
      btnQuiz2.disabled = true;
      startQuiz2(function(score){
        console.log('[quiz] startQuiz2 completed, score=', score);
        btnQuiz2.disabled = false;
      });
    });
  }

  // Generate Latihan
  const btnPractice = document.getElementById('generatePractice');
  if (btnPractice) {
    btnPractice.onclick = function() {
      const type = document.getElementById('practiceType').value;
      const area = document.getElementById('practiceArea');
      let questions = [];
      if (type==='penjumlahan') {
        for (let i=0;i<10;i++){
          let a=Math.floor(Math.random()*20)+1;
          let b=Math.floor(Math.random()*20)+1;
          questions.push(`${a} + ${b} = __`);
        }
      } else if (type==='pengurangan') {
        for (let i=0;i<10;i++){
          let a=Math.floor(Math.random()*20)+10;
          let b=Math.floor(Math.random()*10)+1;
          questions.push(`${a} - ${b} = __`);
        }
      } else {
        questions = ['Latihan tidak tersedia'];
      }
      area.innerHTML = '<ul>'+questions.map(q=>`<li>${q}</li>`).join('')+'</ul>';
    };
  }

  // Kirim latihan ke kuis interaktif
  const sendBtn = document.getElementById('sendToQuiz');
  if (sendBtn) {
    sendBtn.onclick = function() {
  var customTextEl = document.getElementById('customPractice');
  const customText = customTextEl ? customTextEl.value.trim() : '';
      let questions = [];
      if (customText) {
        questions = customText.split(/\n|\r/).filter(q=>q.trim()).map(q=>({q,choices:['__'],a:0}));
      }
      quizBanks.custom = questions;
      const sel = document.getElementById('quickQuizType');
      if (sel) {
          if (![...sel.options].some(opt=>opt.value==='custom')){
          const opt=document.createElement('option');
          opt.value='custom'; opt.text='Kustom'; sel.appendChild(opt);
        }
        sel.value='custom';
      }
      startQuiz();
      alert('Soal custom dikirim ke Kuis!');
    };
  }

});
