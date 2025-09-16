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

// ===========================
// Fungsi Kuis
// ===========================
function startQuiz() {
  const quizBox = document.getElementById('quizBox');
  const type = document.getElementById('quickQuizType') ? document.getElementById('quickQuizType').value : 'math';
  let quizBank = quizBanks[type] || quizBanks['math'];
  quizBank = quizBank.slice().sort(() => Math.random()-0.5).slice(0,10);

  let index=0, score=0;

  function showQuestion(){
    if(index>=quizBank.length){
      quizBox.innerHTML = `<h3>Hasil: ${score}/${quizBank.length}</h3>`;
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

function startQuiz2() {
  const quizBox = document.getElementById('quizBox2');
  const type = document.getElementById('quickQuizType2') ? document.getElementById('quickQuizType2').value : 'math';
  let quizBank = quizBanks[type] || quizBanks['math'];
  quizBank = quizBank.slice().sort(() => Math.random()-0.5).slice(0,10);

  let index=0, score=0;

  function showQuestion(){
    if(index>=quizBank.length){
      quizBox.innerHTML = `<h3>Hasil: ${score}/${quizBank.length}</h3>`;
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

  // Download Worksheet
  const dwBtn = document.getElementById('downloadWorksheet');
  if (dwBtn) {
    dwBtn.onclick = function() {
      const subject = document.getElementById('worksheetSubject').value;
      const type = document.getElementById('worksheetType').value;
      const custom = document.getElementById('customQuestions').value;
      const content = `Materi: ${subject}\nTipe: ${type}\n\n${custom || 'Soal otomatis oleh guru.'}`;
      const blob = new Blob([content], {type:'text/plain'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lembar_kerja.txt';
      a.click();
    };
  }

  // Mulai Kuis utama
  const btnQuiz = document.getElementById('startQuiz');
  if (btnQuiz) btnQuiz.onclick = ()=> startQuiz();

  // Mulai Kuis interaktif (quizBox2)
  const btnQuiz2 = document.getElementById('startQuiz2');
  if (btnQuiz2) btnQuiz2.onclick = ()=> startQuiz2();

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
      const customText = document.getElementById('customPractice').value.trim();
      let questions = [];
      if (customText) {
        questions = customText.split(/\n|\r/).filter(q=>q.trim()).map(q=>({q,choices:['__'],a:0}));
      }
      quizBanks.custom = questions;
      const sel = document.getElementById('quickQuizType');
      if (sel) {
        if (![...sel.options].some(opt=>opt.value==='custom')){
          const opt=document.createElement('option');
          opt.value='custom'; opt.text='Custom'; sel.appendChild(opt);
        }
        sel.value='custom';
      }
      startQuiz();
      alert('Soal custom dikirim ke Kuis!');
    };
  }

});
